const express = require("express");
const router = express.Router();
const { getAIFeedback, getSkillRecommendations, generateSummary } = require("../controllers/analysis.controller");
const { body, validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) return res.status(400).json({ success: false, errors: errs.array() });
  next();
};

router.post("/feedback", [body("resumeText").notEmpty()], validate, getAIFeedback);
router.post("/skills", [body("resumeText").notEmpty()], validate, getSkillRecommendations);
router.post("/summary", [body("experience").isArray({ min: 1 })], validate, generateSummary);

module.exports = router;