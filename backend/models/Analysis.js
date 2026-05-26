const mongoose = require("mongoose");
 
const analysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },
    jobDescription: { type: String, default: "" },
    targetRole: { type: String, default: "" },
    atsScore: { type: Number, min: 0, max: 100, default: 0 },
    scores: {
      formatting: { type: Number, min: 0, max: 100, default: 0 },
      keywords: { type: Number, min: 0, max: 100, default: 0 },
      experience: { type: Number, min: 0, max: 100, default: 0 },
      education: { type: Number, min: 0, max: 100, default: 0 },
      skills: { type: Number, min: 0, max: 100, default: 0 },
      readability: { type: Number, min: 0, max: 100, default: 0 },
    },
    keywords: {
      found: [{ word: String, count: Number, importance: String }],
      missing: [{ word: String, importance: String, category: String }],
      density: { type: Number, default: 0 },
    },
    suggestions: {
      critical: [{ type: String }],
      improvements: [{ type: String }],
      positive: [{ type: String }],
    },
    skillAnalysis: {
      presentSkills: [{ name: String, level: String, demand: String }],
      missingSkills: [
        { name: String, importance: String, category: String, demand: String },
      ],
      trendingSkills: [{ name: String, growth: String, demand: String }],
      skillGapScore: { type: Number, default: 0 },
    },
    jobMatches: [
      {
        title: String,
        company: String,
        matchScore: Number,
        location: String,
        salary: String,
        requiredSkills: [String],
        missingSkills: [String],
        url: String,
      },
    ],
    grammarIssues: [
      {
        text: String,
        suggestion: String,
        type: String,
      },
    ],
    formattingIssues: [
      {
        issue: String,
        severity: String,
        fix: String,
      },
    ],
    aiInsights: {
      summary: { type: String, default: "" },
      strengths: [{ type: String }],
      weaknesses: [{ type: String }],
      careerAdvice: { type: String, default: "" },
      industryFit: [{ industry: String, score: Number }],
      salaryEstimate: {
        min: Number,
        max: Number,
        currency: { type: String, default: "USD" },
      },
    },
    interviewQuestions: {
      technical: [{ question: String, difficulty: String, topic: String }],
      behavioral: [{ question: String, category: String }],
      roleSpecific: [{ question: String, focus: String }],
    },
    learningRoadmap: [
      {
        skill: String,
        resources: [{ name: String, url: String, type: String, duration: String }],
        priority: String,
        estimatedTime: String,
      },
    ],
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "error"],
      default: "pending",
    },
    processingTime: { type: Number, default: 0 },
    model: { type: String, default: "gpt-4" },
  },
  { timestamps: true }
);
 
analysisSchema.index({ user: 1, createdAt: -1 });
analysisSchema.index({ resume: 1 });
analysisSchema.index({ atsScore: -1 });
 
module.exports = mongoose.model("Analysis", analysisSchema);
 