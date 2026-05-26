const express = require("express");
const router = express.Router();

const {
  matchJobsToResume,
  generateJobMatchAnalysis,
} = require("../services/jobMatcher.service");

const {
  extractSkillsFromText,
} = require("../services/skillExtractor.service");

const { body, validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errs = validationResult(req);

  if (!errs.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errs.array(),
    });
  }

  next();
};

router.post(
  "/match",
  [body("resumeText").notEmpty(), body("jobs").isArray()],
  validate,
  async (req, res) => {
    try {
      const { resumeText, jobs } = req.body;

      const skills = extractSkillsFromText(resumeText);

      const matched = await matchJobsToResume(
        skills,
        resumeText,
        jobs
      );

      res.json({
        success: true,
        data: {
          jobs: matched,
          skills,
        },
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
);

router.post(
  "/analyze-match",
  [body("resume").notEmpty(), body("job").notEmpty()],
  validate,
  async (req, res) => {
    try {
      const { resume, job } = req.body;

      const analysis = await generateJobMatchAnalysis(
        resume,
        job
      );

      res.json({
        success: true,
        data: analysis,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
);

module.exports = router;