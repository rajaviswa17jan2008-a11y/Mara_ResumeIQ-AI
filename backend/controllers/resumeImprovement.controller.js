/**
 * Resume Improvement Controller
 * Handles HTTP layer: validates, calls service, formats response.
 * Place at: backend/controllers/resumeImprovement.controller.js
 */

const {
  analyzeResumeForImprovement,
  improveSingleSection,
} = require("../services/resumeImprovement.service");
const mammoth = require("mammoth");
const fs = require("fs");
const pdfParse = require("pdf-parse");
// ──────────────────────────────────────────────
// Utility: standard response builder
// ──────────────────────────────────────────────
const success = (res, data, message = "Success", status = 200) =>
  res.status(status).json({ success: true, message, data });

const failure = (res, message = "Server Error", status = 500, errors = null) =>
  res.status(status).json({ success: false, message, errors });

// ──────────────────────────────────────────────
// POST /api/resume-improvement/analyze
// ──────────────────────────────────────────────
/**
 * analyzeResume
 * Receives raw resume text and optional context, calls the AI service,
 * and returns a detailed improvement analysis report.
 *
 * @route  POST /api/resume-improvement/analyze
 * @access Public (add auth middleware in routes when needed)
 */
const analyzeResume = async (req, res) => {

  try {

    if (!req.file) {
      return failure(
        res,
        "Resume file is required",
        400
      );
    }

    const targetRole =
      req.body.jobTitle || "";

    const targetIndustry =
      req.body.targetIndustry || "";

    // Read uploaded resume text
    let resumeText = "";

     const buffer =
  fs.readFileSync(req.file.path);

if (
  req.file.mimetype.includes("word") ||
  req.file.originalname.endsWith(".docx")
) {

  const result =
    await mammoth.extractRawText({
      buffer,
    });

  resumeText = result.value;

} else {

  const pdfData =
    await pdfParse(buffer);

  resumeText =
    pdfData.text;

}
     


  

    const analysisResult =
      await analyzeResumeForImprovement(
        resumeText,
        targetRole,
        targetIndustry
      );

    console.log(
      `[ResumeImprovement] AI Analysis Done`
    );

    return success(
      res,
      analysisResult,
      "Resume analysis complete"
    );

  } catch (err) {

    console.error(
      "[ResumeImprovement] Error:",
      err.message
    );

    return failure(
      res,
      "Failed to analyze resume",
      500
    );
  }
};

// ──────────────────────────────────────────────
// POST /api/resume-improvement/improve-section
// ──────────────────────────────────────────────
/**
 * improveSection
 * Takes a single resume section and returns AI-rewritten content.
 *
 * @route  POST /api/resume-improvement/improve-section
 * @body   { sectionContent, sectionName, targetRole? }
 */
const improveSection = async (req, res) => {
  try {
    const { sectionContent, sectionName, targetRole = "" } = req.body;

    if (!sectionContent || !sectionName) {
      return failure(
        res,
        "sectionContent and sectionName are required.",
        400
      );
    }

    if (sectionContent.trim().length < 20) {
      return failure(res, "Section content is too short.", 400);
    }

    const ALLOWED_SECTIONS = [
      "Summary",
      "Objective",
      "Experience",
      "Skills",
      "Education",
      "Projects",
      "Certifications",
      "Achievements",
      "Interests",
    ];

    if (!ALLOWED_SECTIONS.includes(sectionName)) {
      return failure(
        res,
        `sectionName must be one of: ${ALLOWED_SECTIONS.join(", ")}`,
        400
      );
    }

    const result = await improveSingleSection(
      sectionContent.trim(),
      sectionName,
      targetRole.trim()
    );

    return success(res, result, `${sectionName} section improved`);
  } catch (err) {
    console.error("[ResumeImprovement] Section improve error:", err.message);
    return failure(res, "Failed to improve section. Please try again.", 500);
  }
};

// ──────────────────────────────────────────────
// GET /api/resume-improvement/history
// ──────────────────────────────────────────────
/**
 * getImprovementHistory
 * Placeholder for when a database is connected.
 * Returns mock history for now; replace with DB query.
 *
 * @route  GET /api/resume-improvement/history
 */
const getImprovementHistory = async (req, res) => {
  try {
    // TODO: Replace with real DB query when MongoDB model is set up
    // const userId = req.user._id;
    // const history = await ResumeAnalysis.find({ userId }).sort({ createdAt: -1 }).limit(10);

    const mockHistory = [
      {
        id: "hist_001",
        analyzedAt: new Date(Date.now() - 86400000).toISOString(),
        overallScore: 72,
        atsScore: 68,
        targetRole: "Full Stack Developer",
        totalIssues: 8,
      },
      {
        id: "hist_002",
        analyzedAt: new Date(Date.now() - 172800000).toISOString(),
        overallScore: 65,
        atsScore: 60,
        targetRole: "React Engineer",
        totalIssues: 12,
      },
    ];

    return success(res, mockHistory, "History retrieved");
  } catch (err) {
    console.error("[ResumeImprovement] History error:", err.message);
    return failure(res, "Failed to retrieve history.", 500);
  }
};

module.exports = {
  analyzeResume,
  improveSection,
  getImprovementHistory,
};