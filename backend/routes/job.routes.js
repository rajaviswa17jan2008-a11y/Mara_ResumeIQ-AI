const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { validate } = require("../middleware/validate.middleware");
const { analysisLimiter } = require("../middleware/rateLimiter.middleware");
const { optionalAuth } = require("../middleware/auth.middleware");
const {
  matchJobs,
  analyzeJobMatch,
  batchMatchAnalysis,
  recommendJobs
} = require("../controllers/job.controller");

router.post(
  "/match",
  analysisLimiter,
  optionalAuth,
  [
    body("resumeText").notEmpty().withMessage("Resume text required"),
    body("jobs").isArray().withMessage("Jobs must be an array"),
  ],
  validate,
  matchJobs
);

router.post(
  "/analyze-match",
  analysisLimiter,
  optionalAuth,
  [
    body("resume").notEmpty().withMessage("Resume data required"),
    body("job").notEmpty().withMessage("Job data required"),
  ],
  validate,
  analyzeJobMatch
);
router.post(
  "/recommend",
   (req,res,next)=>{
    console.log("RECOMMEND API HIT");
    next();
  },
  recommendJobs
);
router.post(
  "/batch-match",
  analysisLimiter,
  optionalAuth,
  [
    body("resumeText").notEmpty().withMessage("Resume text required"),
    body("jobs").isArray({ min: 1 }).withMessage("At least one job required"),
  ],
  validate,
  batchMatchAnalysis
);

module.exports = router;