const { body, query } = require("express-validator");
const Joi = require("joi");

const VALID_CATEGORIES = ["All", "Behavioral", "Technical", "System Design", "HR", "Situational"];
const VALID_DIFFICULTIES = ["All", "Easy", "Medium", "Hard"];

const aiFeedbackValidation = [
  body("resumeText")
    .notEmpty().withMessage("Resume text is required")
    .isString().withMessage("Resume text must be a string")
    .isLength({ min: 50 }).withMessage("Resume text too short (minimum 50 characters)")
    .isLength({ max: 50000 }).withMessage("Resume text too long"),

  body("targetRole")
    .optional()
    .trim()
    .isString()
    .isLength({ max: 100 }).withMessage("Target role too long"),
];

const skillRecommendationValidation = [
  body("resumeText")
    .optional()
    .isString()
    .isLength({ min: 20, max: 50000 }).withMessage("Resume text must be 20–50,000 characters"),

  body("currentSkills")
    .optional()
    .isArray().withMessage("Current skills must be an array")
    .custom((arr) => arr.every((s) => typeof s === "string")).withMessage("Each skill must be a string")
    .custom((arr) => arr.length <= 100).withMessage("Too many skills (max 100)"),

  body("targetRole")
    .optional()
    .isString()
    .isLength({ max: 100 }).withMessage("Target role too long"),

  body().custom((body) => {
    if (!body.resumeText && (!body.currentSkills || !body.currentSkills.length)) {
      throw new Error("Either resumeText or currentSkills is required");
    }
    return true;
  }),
];

const summaryGenerationValidation = [
  body("experience")
    .notEmpty().withMessage("Experience is required")
    .isArray({ min: 1 }).withMessage("Experience must be a non-empty array")
    .custom((arr) => arr.length <= 20).withMessage("Too many experience entries"),

  body("experience.*.title")
    .optional()
    .isString()
    .isLength({ max: 100 }).withMessage("Job title too long"),

  body("experience.*.company")
    .optional()
    .isString()
    .isLength({ max: 100 }).withMessage("Company name too long"),

  body("skills")
    .optional()
    .isObject().withMessage("Skills must be an object"),
];

const interviewGenerationValidation = [
  body("role")
    .notEmpty().withMessage("Job role is required")
    .isString()
    .isLength({ min: 2, max: 100 }).withMessage("Role must be 2–100 characters"),

  body("category")
    .optional()
    .isIn(VALID_CATEGORIES).withMessage(`Category must be one of: ${VALID_CATEGORIES.join(", ")}`),

  body("difficulty")
    .optional()
    .isIn(VALID_DIFFICULTIES).withMessage(`Difficulty must be one of: ${VALID_DIFFICULTIES.join(", ")}`),

  body("count")
    .optional()
    .isInt({ min: 1, max: 20 }).withMessage("Count must be an integer between 1 and 20"),
];

const answerEvaluationValidation = [
  body("question")
    .notEmpty().withMessage("Question is required")
    .isString()
    .isLength({ min: 5, max: 2000 }).withMessage("Question must be 5–2000 characters"),

  body("answer")
    .notEmpty().withMessage("Answer is required")
    .isString()
    .isLength({ min: 15, max: 10000 }).withMessage("Answer must be 15–10,000 characters"),
];

const chatMessageValidation = [
  body("message")
    .notEmpty().withMessage("Message is required")
    .isString()
    .isLength({ min: 1, max: 2000 }).withMessage("Message must be 1–2000 characters"),

  body("history")
    .optional()
    .isArray().withMessage("History must be an array")
    .custom((arr) => arr.length <= 50).withMessage("History too long (max 50 messages)"),

  body("history.*.role")
    .optional()
    .isIn(["user", "assistant"]).withMessage("History role must be 'user' or 'assistant'"),

  body("history.*.content")
    .optional()
    .isString()
    .isLength({ max: 5000 }).withMessage("History message content too long"),

  body("userContext")
    .optional()
    .isObject().withMessage("User context must be an object"),
];

const jobMatchValidation = [
  body("resumeText")
    .notEmpty().withMessage("Resume text is required")
    .isString()
    .isLength({ min: 50 }).withMessage("Resume text too short"),

  body("jobs")
    .notEmpty().withMessage("Jobs array is required")
    .isArray().withMessage("Jobs must be an array")
    .custom((arr) => arr.length <= 50).withMessage("Too many jobs (max 50)"),

  body("jobs.*.title")
    .notEmpty().withMessage("Each job must have a title")
    .isString()
    .isLength({ max: 150 }),

  body("jobs.*.company")
    .optional()
    .isString()
    .isLength({ max: 100 }),
];

// Joi schemas
const chatSchema = Joi.object({
  message: Joi.string().min(1).max(2000).required(),
  history: Joi.array().max(50).items(
    Joi.object({
      role: Joi.string().valid("user", "assistant").required(),
      content: Joi.string().max(5000).required(),
    })
  ).optional(),
  userContext: Joi.object().optional(),
});

const interviewSchema = Joi.object({
  role: Joi.string().min(2).max(100).required(),
  category: Joi.string().valid(...VALID_CATEGORIES).default("All"),
  difficulty: Joi.string().valid(...VALID_DIFFICULTIES).default("All"),
  count: Joi.number().integer().min(1).max(20).default(10),
});

const skillGapSchema = Joi.object({
  resumeText: Joi.string().min(50).max(50000).required(),
  targetRole: Joi.string().min(2).max(100).required(),
});

module.exports = {
  aiFeedbackValidation,
  skillRecommendationValidation,
  summaryGenerationValidation,
  interviewGenerationValidation,
  answerEvaluationValidation,
  chatMessageValidation,
  jobMatchValidation,
  chatSchema,
  interviewSchema,
  skillGapSchema,
};