const { body, query, param } = require("express-validator");
const Joi = require("joi");

const resumeTextValidation = [
  body("resumeText")
    .notEmpty().withMessage("Resume text is required")
    .isString().withMessage("Resume text must be a string")
    .isLength({ min: 50 }).withMessage("Resume text too short (minimum 50 characters)")
    .isLength({ max: 50000 }).withMessage("Resume text too long (maximum 50,000 characters)"),

  body("targetRole")
    .optional()
    .isString().withMessage("Target role must be a string")
    .isLength({ max: 100 }).withMessage("Target role too long"),
];

const resumeUploadValidation = [
  body("targetRole")
    .optional()
    .isString()
    .isLength({ max: 100 }).withMessage("Target role too long"),

  body("jobDescription")
    .optional()
    .isString()
    .isLength({ max: 5000 }).withMessage("Job description too long"),
];

const resumeIdValidation = [
  param("id")
    .notEmpty().withMessage("Resume ID is required")
    .isMongoId().withMessage("Invalid resume ID format"),
];

const builderSaveValidation = [
  body("resume").notEmpty().withMessage("Resume data is required").isObject().withMessage("Resume must be an object"),

  body("resume.personalInfo").optional().isObject(),
  body("resume.personalInfo.name").optional().isString().isLength({ max: 80 }),
  body("resume.personalInfo.email").optional().isEmail().withMessage("Invalid email in personal info"),
  body("resume.personalInfo.phone").optional().isString().isLength({ max: 20 }),

  body("resume.summary").optional().isString().isLength({ max: 1000 }).withMessage("Summary too long"),

  body("resume.experience")
    .optional()
    .isArray().withMessage("Experience must be an array")
    .custom((arr) => arr.length <= 20)
    .withMessage("Too many experience entries (max 20)"),

  body("resume.education")
    .optional()
    .isArray().withMessage("Education must be an array")
    .custom((arr) => arr.length <= 10)
    .withMessage("Too many education entries (max 10)"),

  body("resume.skills").optional().isObject().withMessage("Skills must be an object"),

  body("resume.projects")
    .optional()
    .isArray()
    .custom((arr) => arr.length <= 20)
    .withMessage("Too many project entries (max 20)"),

  body("resume.certifications")
    .optional()
    .isArray()
    .custom((arr) => arr.length <= 20)
    .withMessage("Too many certification entries (max 20)"),
];

const paginationValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 }).withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 }).withMessage("Limit must be between 1 and 50"),

  query("sort")
    .optional()
    .isIn(["createdAt", "-createdAt", "score", "-score", "name"]).withMessage("Invalid sort field"),
];

// Joi schemas
const resumeTextSchema = Joi.object({
  resumeText: Joi.string().min(50).max(50000).required(),
  targetRole: Joi.string().max(100).optional().allow(""),
  jobDescription: Joi.string().max(5000).optional().allow(""),
});

const builderResumeSchema = Joi.object({
  resume: Joi.object({
    personalInfo: Joi.object({
      name: Joi.string().max(80).allow(""),
      email: Joi.string().email().allow(""),
      phone: Joi.string().max(20).allow(""),
      location: Joi.string().max(100).allow(""),
      linkedin: Joi.string().uri().allow(""),
      github: Joi.string().uri().allow(""),
      website: Joi.string().uri().allow(""),
    }).optional(),
    summary: Joi.string().max(1000).allow("").optional(),
    experience: Joi.array().max(20).optional(),
    education: Joi.array().max(10).optional(),
    skills: Joi.object().optional(),
    projects: Joi.array().max(20).optional(),
    certifications: Joi.array().max(20).optional(),
  }).required(),
});

module.exports = {
  resumeTextValidation,
  resumeUploadValidation,
  resumeIdValidation,
  builderSaveValidation,
  paginationValidation,
  resumeTextSchema,
  builderResumeSchema,
};