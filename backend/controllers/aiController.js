const Analysis = require("../models/Analysis");
const Resume = require("../models/resume");
const Chat = require("../models/Chat");
const User = require("../models/user");
const { asyncHandler } = require("../middleware/errorMiddleware");
const {
  analyzeResumeWithGemini,
  chatWithGeminiBot
} = require("../services/geminiService");
const { analyzeResumeWithGemini, chatWithGeminiBot } = require("../services/geminiService");
const { calculateATSScore } = require("../utils/calculateATS");
const { getTrendingSkills } = require("../utils/extractSkills");
 
// @desc    Analyze resume with AI
// @route   POST /api/ai/analyze/:resumeId
// @access  Private
const analyzeResume = asyncHandler(async (req, res) => {
  const { jobDescription, targetRole } = req.body;
 
  const resume = await Resume.findOne({ _id: req.params.resumeId, user: req.user._id });
  if (!resume) return res.status(404).json({ success: false, message: "Resume not found." });
 
  if (resume.status === "uploaded") {
    return res.status(400).json({ success: false, message: "Resume is still being parsed. Please wait." });
  }
 
  const startTime = Date.now();
 
  // Create analysis record
  const analysis = await Analysis.create({
    user: req.user._id,
    resume: resume._id,
    jobDescription: jobDescription || "",
    targetRole: targetRole || "",
    status: "processing",
  });
 
  // Calculate ATS score from parsed data
  const { atsScore, scores, formattingIssues } = calculateATSScore(
    resume.parsedData,
    jobDescription,
    targetRole
  );
 
  // Try OpenAI first, fallback to Gemini
  let aiResult;
  let modelUsed = "gpt-4";
  try {
    aiResult = await analyzeResumeWithAI(resume.rawText, jobDescription, targetRole);
  } catch (openaiError) {
    console.warn("OpenAI failed, falling back to Gemini:", openaiError.message);
    try {
      aiResult = await analyzeResumeWithGemini(resume.rawText, jobDescription, targetRole);
      modelUsed = "gemini-pro";
    } catch (geminiError) {
      // If both fail, use calculated data only
      aiResult = getDefaultAIResult(resume.parsedData, targetRole);
      modelUsed = "local";
    }
  }
 
  const processingTime = Date.now() - startTime;
 
  // Update analysis with all results
  const updatedAnalysis = await Analysis.findByIdAndUpdate(
    analysis._id,
    {
      atsScore,
      scores,
      formattingIssues,
      aiInsights: aiResult.aiInsights || {},
      suggestions: aiResult.suggestions || {},
      keywords: aiResult.keywords || {},
      skillAnalysis: {
        ...aiResult.skillAnalysis,
        presentSkills: aiResult.skillAnalysis?.presentSkills || resume.parsedData.skills.map((s) => ({ name: s, level: "intermediate", demand: "high" })),
      },
      interviewQuestions: aiResult.interviewQuestions || {},
      learningRoadmap: aiResult.learningRoadmap || [],
      grammarIssues: [],
      status: "completed",
      processingTime,
      model: modelUsed,
    },
    { new: true }
  );
 
  // Update resume stats
  await Resume.findByIdAndUpdate(resume._id, {
    status: "analyzed",
    lastAnalyzedAt: Date.now(),
    $inc: { analysisCount: 1 },
  });
 
  await User.findByIdAndUpdate(req.user._id, { $inc: { analysisCount: 1 } });
 
  res.status(200).json({
    success: true,
    message: "Resume analyzed successfully!",
    data: { analysis: updatedAnalysis },
  });
});
 
// @desc    Get analysis by ID
// @route   GET /api/ai/analysis/:id
// @access  Private
const getAnalysis = asyncHandler(async (req, res) => {
  const analysis = await Analysis.findOne({ _id: req.params.id, user: req.user._id })
    .populate("resume", "fileName title parsedData cloudinary");
 
  if (!analysis) return res.status(404).json({ success: false, message: "Analysis not found." });
  res.status(200).json({ success: true, data: { analysis } });
});
 
// @desc    Get all analyses for user
// @route   GET /api/ai/analyses
// @access  Private
const getAnalyses = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
 
  const analyses = await Analysis.find({ user: req.user._id, status: "completed" })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("resume", "fileName title")
    .select("-keywords -grammarIssues -formattingIssues -learningRoadmap");
 
  const total = await Analysis.countDocuments({ user: req.user._id, status: "completed" });
 
  res.status(200).json({
    success: true,
    data: { analyses, pagination: { page, limit, total, pages: Math.ceil(total / limit) } },
  });
});
 
// @desc    AI Career Chatbot
// @route   POST /api/ai/chat
// @access  Private
const careerChat = asyncHandler(async (req, res) => {
  const { message, chatId, resumeId } = req.body;
 
  if (!message?.trim()) {
    return res.status(400).json({ success: false, message: "Message is required." });
  }
 
  // Get or create chat session
  let chat;
  if (chatId) {
    chat = await Chat.findOne({ _id: chatId, user: req.user._id });
  }
  if (!chat) {
    chat = new Chat({ user: req.user._id, title: message.substring(0, 50), context: "career" });
  }
 
  // Get resume context if provided
  let resumeContext = "";
  if (resumeId) {
    const resume = await Resume.findOne({ _id: resumeId, user: req.user._id });
    if (resume?.rawText) {
      resumeContext = resume.rawText.substring(0, 1000);
      chat.resumeContext = resumeId;
    }
  }
 
  // Add user message
  chat.messages.push({ role: "user", content: message });
 
  // Build messages for AI
  const aiMessages = chat.messages.slice(-10).map((m) => ({
    role: m.role,
    content: m.content,
  }));
 
  // Get AI response
  let aiResponse;
  try {
    aiResponse = await chatWithCareerBot(aiMessages, resumeContext);
  } catch {
    aiResponse = await chatWithGeminiBot(aiMessages, resumeContext);
  }
 
  // Add assistant response
  chat.messages.push({
    role: "assistant",
    content: aiResponse.content,
    tokens: aiResponse.tokens,
  });
 
  chat.totalTokens += aiResponse.tokens || 0;
  await chat.save();
 
  res.status(200).json({
    success: true,
    data: {
      chatId: chat._id,
      message: aiResponse.content,
      totalMessages: chat.messages.length,
    },
  });
});
 
// @desc    Get chat history
// @route   GET /api/ai/chats
// @access  Private
const getChats = asyncHandler(async (req, res) => {
  const chats = await Chat.find({ user: req.user._id, isArchived: false })
    .sort({ updatedAt: -1 })
    .select("title messages totalTokens createdAt updatedAt")
    .limit(20);
 
  res.status(200).json({ success: true, data: { chats } });
});
 
// @desc    Generate interview questions
// @route   POST /api/ai/interview/:resumeId
// @access  Private
const generateInterview = asyncHandler(async (req, res) => {
  const { targetRole, difficulty } = req.body;
 
  const resume = await Resume.findOne({ _id: req.params.resumeId, user: req.user._id });
  if (!resume) return res.status(404).json({ success: false, message: "Resume not found." });
 
  const questions = await generateInterviewQuestions(
    resume.rawText || "",
    targetRole || req.user.targetRole || "Software Engineer",
    difficulty || "mixed"
  );
 
  res.status(200).json({ success: true, data: { questions } });
});
 
// @desc    Get job recommendations
// @route   POST /api/ai/jobs/:resumeId
// @access  Private
const getJobRecommendations = asyncHandler(async (req, res) => {
  const { targetRole } = req.body;
 
  const resume = await Resume.findOne({ _id: req.params.resumeId, user: req.user._id });
  if (!resume) return res.status(404).json({ success: false, message: "Resume not found." });
 
  const recommendations = await generateJobRecommendations(
    resume.parsedData,
    targetRole || req.user.targetRole
  );
 
  res.status(200).json({ success: true, data: recommendations });
});
 
// @desc    Get skill recommendations
// @route   GET /api/ai/skills/:resumeId
// @access  Private
const getSkillRecommendations = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.resumeId, user: req.user._id });
  if (!resume) return res.status(404).json({ success: false, message: "Resume not found." });
 
  const presentSkills = resume.parsedData?.skills || [];
  const targetRole = req.query.targetRole || req.user.targetRole || "Software Engineer";
  const trending = getTrendingSkills(targetRole);
 
  const missingTrending = trending.filter(
    (skill) => !presentSkills.some((s) => s.toLowerCase().includes(skill.toLowerCase()))
  );
 
  res.status(200).json({
    success: true,
    data: {
      presentSkills,
      trendingSkills: trending,
      recommendedSkills: missingTrending.slice(0, 8).map((skill) => ({
        name: skill,
        priority: "high",
        demand: "high",
        estimatedTime: "4-8 weeks",
      })),
    },
  });
});
 
// @desc    Get user analytics (dashboard)
// @route   GET /api/ai/analytics
// @access  Private
const getUserAnalytics = asyncHandler(async (req, res) => {
  const userId = "test-user-id";
 
  const [analyses, totalResumes, recentAnalyses] = await Promise.all([
    Analysis.find({ user: userId, status: "completed" }).select("atsScore scores createdAt targetRole"),
    Resume.countDocuments({ user: userId, isActive: true }),
    Analysis.find({ user: userId, status: "completed" })
      .sort({ createdAt: -1 })
      .limit(6)
      .select("atsScore scores createdAt targetRole")
      .populate("resume", "fileName title"),
  ]);
 
  const avgATSScore = analyses.length > 0
    ? Math.round(analyses.reduce((sum, a) => sum + a.atsScore, 0) / analyses.length)
    : 0;
 
  const bestScore = analyses.length > 0
    ? Math.max(...analyses.map((a) => a.atsScore))
    : 0;
 
  const scoreHistory = recentAnalyses.reverse().map((a) => ({
    date: a.createdAt.toISOString().split("T")[0],
    score: a.atsScore,
    role: a.targetRole || "General",
    resumeTitle: a.resume?.title || a.resume?.fileName || "Resume",
  }));
 
  res.status(200).json({
    success: true,
    data: {
      stats: {
        totalResumes,
        totalAnalyses: analyses.length,
        avgATSScore,
        bestScore,
      },
      scoreHistory,
      recentAnalyses,
    },
  });
});
 
// Default AI result when both APIs fail
const getDefaultAIResult = (parsedData, targetRole) => ({
  aiInsights: {
    summary: "Your resume has been analyzed. Please review the ATS score and suggestions below.",
    strengths: ["Resume structure detected", "Contact information present", "Skills section found"],
    weaknesses: ["Consider adding more quantifiable achievements", "Expand your professional summary"],
    careerAdvice: `Focus on tailoring your resume for ${targetRole || "your target role"} by including relevant keywords and quantifiable achievements.`,
    industryFit: [{ industry: "Technology", score: 70 }],
    salaryEstimate: { min: 70000, max: 120000, currency: "USD" },
  },
  suggestions: {
    critical: ["Add quantifiable achievements to experience section", "Expand professional summary"],
    improvements: ["Include more technical keywords", "Add LinkedIn profile URL"],
    positive: ["Good skills section", "Clear contact information"],
  },
  keywords: { found: [], missing: [] },
  skillAnalysis: {
    presentSkills: (parsedData?.skills || []).map((s) => ({ name: s, level: "intermediate", demand: "medium" })),
    missingSkills: [],
    trendingSkills: getTrendingSkills(targetRole).slice(0, 5).map((s) => ({ name: s, growth: "+50%", demand: "high" })),
    skillGapScore: 60,
  },
  interviewQuestions: { technical: [], behavioral: [], roleSpecific: [] },
  learningRoadmap: [],
});
 
module.exports = { analyzeResume, getAnalysis, getAnalyses, careerChat, getChats, generateInterview, getJobRecommendations, getSkillRecommendations, getUserAnalytics };
 