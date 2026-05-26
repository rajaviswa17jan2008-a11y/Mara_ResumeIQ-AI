const express = require("express");
const router = express.Router();
const upload = require("../config/upload");
const { parseAndAnalyze, getDetailedAnalysis } = require("../controllers/resume.controller");
const { body, validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  next();
};

router.post("/parse", upload.single("resume"), parseAndAnalyze);
router.post("/analyze", [body("resumeText").notEmpty().isLength({ min: 50 })], validate, getDetailedAnalysis);

module.exports = router;