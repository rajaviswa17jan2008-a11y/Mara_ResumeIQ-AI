const { generateResumeFeedback, generateSkillRecommendations, generateProfessionalSummary } = require("../services/aiResumeAnalysis.service");
const { extractSkillsFromText } = require("../services/skillExtractor.service");
const { logger } = require("../utils/logger");

exports.getAIFeedback = async (req, res) => {
  const { resumeText, targetRole } = req.body;
  if (!resumeText) return res.status(400).json({ success: false, message: "Resume text required" });
  try {
    const { splitIntoSections, extractContactInfo, extractName } = require("../services/resumeParser.service");
    const parsedResume = { rawText: resumeText, name: extractName(resumeText), contact: extractContactInfo(resumeText), sections: splitIntoSections(resumeText) };
    const feedback = await generateResumeFeedback(parsedResume);
    res.json({ success: true, data: feedback });
  } catch (err) {
    logger.error("AI feedback error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSkillRecommendations = async (req, res) => {
  const { resumeText, targetRole } = req.body;
  if (!resumeText) return res.status(400).json({ success: false, message: "Resume text required" });
  try {
    const skills = extractSkillsFromText(resumeText);
    const recommendations = await generateSkillRecommendations(skills, targetRole);
    res.json({ success: true, data: { currentSkills: skills, recommendations } });
  } catch (err) {
    logger.error("Skill rec error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.generateSummary = async (req, res) => {
  const { experience, skills } = req.body;
  if (!experience?.length) return res.status(400).json({ success: false, message: "Experience required" });
  try {
    const summary = await generateProfessionalSummary(experience, skills);
    res.json({ success: true, data: { summary } });
  } catch (err) {
    logger.error("Summary gen error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};