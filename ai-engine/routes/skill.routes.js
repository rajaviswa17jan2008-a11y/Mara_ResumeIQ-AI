const express = require("express");
const router = express.Router();
const { getSkillRecommendations } = require("../controllers/analysis.controller");
const { body, validationResult } = require("express-validator");

router.post("/recommend", [body("resumeText").notEmpty()], (req, res, next) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) return res.status(400).json({ success: false, errors: errs.array() });
  next();
}, getSkillRecommendations);

module.exports = router;