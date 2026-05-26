const { parseResume } = require("../services/resumeParser.service");
const { calculateATSScore } = require("../services/atsScorer.service");
const { extractSkillsFromText } = require("../services/skillExtractor.service");
const { generateResumeFeedback } = require("../services/aiResumeAnalysis.service");
const { logger } = require("../utils/logger");
const fs = require("fs");
const path = require("path");

exports.parseAndAnalyze = async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ success: false, message: "No file uploaded" });

  try {
    logger.info(`Parsing resume: ${file.filename}`);
    const parsed = await parseResume(file.path);
    const skills = extractSkillsFromText(parsed.rawText);
    const atsScore = calculateATSScore(parsed);

    // Clean up file
    fs.unlink(file.path, () => {});

    res.json({
      success: true,
      data: { parsed: { name: parsed.name, contact: parsed.contact, wordCount: parsed.wordCount, sections: Object.fromEntries(Object.entries(parsed.sections).map(([k, v]) => [k, v.length])) }, skills, atsScore }
    });
  } catch (err) {
    logger.error("Parse error:", err);
    if (file?.path && fs.existsSync(file.path)) fs.unlink(file.path, () => {});
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getDetailedAnalysis = async (req, res) => {
  const { resumeText } = req.body;
  if (!resumeText) return res.status(400).json({ success: false, message: "Resume text required" });

  try {
    const { parseResume: _p, splitIntoSections, extractContactInfo, extractName } = require("../services/resumeParser.service");
    const sections = splitIntoSections(resumeText);
    const contact = extractContactInfo(resumeText);
    const name = extractName(resumeText);
    const parsedResume = { rawText: resumeText, name, contact, sections };
    const skills = extractSkillsFromText(resumeText);
    const atsScore = calculateATSScore(parsedResume);
    const aiFeedback = await generateResumeFeedback(parsedResume);
    res.json({ success: true, data: { atsScore, skills, aiFeedback } });
  } catch (err) {
    logger.error("Analysis error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};