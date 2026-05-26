const express = require("express");
const router = express.Router();
const { generateQuestions, evaluateAnswer } = require("../controllers/interview.controller");
const { body, validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) return res.status(400).json({ success: false, errors: errs.array() });
  next();
};

router.post("/generate", [body("role").notEmpty().isLength({ max: 100 })], validate, generateQuestions);
router.post("/evaluate", [body("question").notEmpty(), body("answer").notEmpty().isLength({ min: 20 })], validate, evaluateAnswer);

module.exports = router;