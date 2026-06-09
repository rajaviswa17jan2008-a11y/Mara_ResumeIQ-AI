/**
 * Resume Improvement Routes
 * Registers all endpoints for the AI Resume Improvement feature.
 * Place at: backend/routes/resumeImprovement.routes.js
 *
 * Mount in app.js:
 *   const resumeImprovementRoutes = require('./routes/resumeImprovement.routes');
 *   app.use('/api/resume-improvement', resumeImprovementRoutes);
 */

const express = require("express");
const router = express.Router();

const {
  analyzeResume,
  improveSection,
  getImprovementHistory,
} = require("../controllers/resumeImprovement.controller");

const {
  validateResumeImprovement,
  sanitizeBody,
} = require("../middleware/validate.middleware");
const {
  uploadResume,
} = require("../middleware/uploadMiddleware");
// Optional: swap this for your real JWT auth middleware
// const { protect } = require("../middleware/auth.middleware");

// ──────────────────────────────────────────────
// POST /api/resume-improvement/analyze
// Full resume improvement analysis via AI
// Body: { resumeText, targetRole?, targetIndustry? }
// ──────────────────────────────────────────────
router.post(
  "/analyze",
  uploadResume.single("resume"),
  analyzeResume
);

// ──────────────────────────────────────────────
// POST /api/resume-improvement/improve-section
// Single-section targeted improvement
// Body: { sectionContent, sectionName, targetRole? }
// ──────────────────────────────────────────────
router.post(
  "/improve-section",
  sanitizeBody,
  improveSection
);

// ──────────────────────────────────────────────
// GET /api/resume-improvement/history
// Returns list of past analyses for current user
// ──────────────────────────────────────────────
router.get(
  "/history",
  // protect,
  getImprovementHistory
);

module.exports = router;