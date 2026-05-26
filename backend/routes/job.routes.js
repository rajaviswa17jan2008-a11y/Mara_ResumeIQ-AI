const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { validate } = require("../middleware/validate.middleware");
const { analysisLimiter } = require("../middleware/rateLimiter.middleware");
const { optionalAuth } = require("../middleware/auth.middleware");
const { matchJobs, analyzeJobMatch, batchMatchAnalysis } = require("../controllers/job.controller");
const axios =
require("axios");
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
router.get(
  "/recommendations",

  async (req, res) => {

    try {

      const query =
        req.query.query ||
        "software developer";

      const response =
        await axios.get(

          "https://jsearch.p.rapidapi.com/search",

          {

            params: {

              query:
                `${query} jobs in India`,

              page: "1",

              num_pages: "1",

              country: "in"

            },

            headers: {

              "X-RapidAPI-Key":
                process.env.RAPID_API_KEY,

              "X-RapidAPI-Host":
                "jsearch.p.rapidapi.com"

            }

          }

        );

      res.json({

        success: true,

        jobs:
          response.data.data

      });

    } catch (err) {

      console.log(err);

      res.status(500).json({

        success: false,

        message:
          "Failed to fetch jobs"

      });

    }

  }
);
module.exports = router;