const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { validate } = require("../middleware/validate.middleware");
const { analysisLimiter } = require("../middleware/rateLimiter.middleware");
const { optionalAuth } = require("../middleware/auth.middleware");
const { extractSkills, getRecommendations, getSkillGapAnalysis } = require("../controllers/skill.controller");

router.post(
  "/extract",
  optionalAuth,
  [body("resumeText").notEmpty().withMessage("Resume text required")],
  validate,
  extractSkills
);

router.post(
  "/recommend",
  analysisLimiter,
  optionalAuth,
  [
    body("resumeText").optional().isString(),
    body("currentSkills").optional().isArray(),
    body("targetRole").optional().isString().isLength({ max: 100 }),
  ],
  validate,
  getRecommendations
);

router.post(
  "/gap-analysis",
  analysisLimiter,
  optionalAuth,
  [
    body("resumeText").notEmpty().withMessage("Resume text required"),
    body("targetRole").notEmpty().withMessage("Target role required"),
  ],
  validate,
  getSkillGapAnalysis
);

module.exports = router;