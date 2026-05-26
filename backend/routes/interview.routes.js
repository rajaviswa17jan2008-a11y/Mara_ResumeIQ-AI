const express =
require("express");

const router =
express.Router();

const {
  generateQuestions,
  generateFeedback
} =
require(
"../controllers/interview.controller"
);

router.post(
"/questions",
generateQuestions
);

router.post(
"/feedback",
generateFeedback
);

module.exports =
router;