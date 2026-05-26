const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { validate } = require("../middleware/validate.middleware");
const { analysisLimiter } = require("../middleware/rateLimiter.middleware");
const { optionalAuth } = require("../middleware/auth.middleware");
const cacheMiddleware = require("../middleware/cache.middleware");
const {
  getAIFeedback,
  getSkillRecommendations,
  generateSummary,
  fullAnalysis,
} = require("../controllers/analysis.controller");

router.post(
  "/feedback",
  analysisLimiter,
  optionalAuth,
  [
    body("resumeText").notEmpty().isLength({ min: 50 }).withMessage("Resume text required (min 50 chars)"),
    body("targetRole").optional().isString().isLength({ max: 100 }),
  ],
  validate,
  cacheMiddleware(3600),
  getAIFeedback
);

router.post(
  "/skills",
  analysisLimiter,
  optionalAuth,
  [
    body("resumeText").notEmpty().withMessage("Resume text required"),
    body("targetRole").optional().isString(),
  ],
  validate,
  cacheMiddleware(3600),
  getSkillRecommendations
);

router.post(
  "/summary",
  optionalAuth,
  [
    body("experience").isArray({ min: 1 }).withMessage("At least one experience entry required"),
    body("skills").optional(),
  ],
  validate,
  generateSummary
);

router.post(
  "/full",
  analysisLimiter,
  optionalAuth,
  [body("resumeText").notEmpty().withMessage("Resume text required")],
  validate,
  fullAnalysis
);

module.exports = router;