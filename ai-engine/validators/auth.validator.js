const { body, param, query } = require("express-validator");
const Joi = require("joi");

const passwordSchema = Joi.string()
  .min(8)
  .max(128)
  .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/)
  .messages({
    "string.pattern.base": "Password must contain uppercase, lowercase, and a number",
    "string.min": "Password must be at least 8 characters",
  });

const registerValidation = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 80 }).withMessage("Name must be 2–80 characters")
    .matches(/^[a-zA-Z\s'-]+$/).withMessage("Name can only contain letters, spaces, hyphens, apostrophes"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Must be a valid email address")
    .normalizeEmail()
    .isLength({ max: 254 }).withMessage("Email too long"),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .isLength({ max: 128 }).withMessage("Password too long")
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/).withMessage("Password must contain uppercase, lowercase, and number"),

  body("confirmPassword")
    .notEmpty().withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) throw new Error("Passwords do not match");
      return true;
    }),

  body("jobTitle")
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage("Job title too long"),

  body("experience")
    .optional()
    .isIn(["0-1 years", "1-3 years", "3-5 years", "5-10 years", "10+ years"])
    .withMessage("Invalid experience range"),

  body("plan")
    .optional()
    .isIn(["free", "pro", "enterprise"])
    .withMessage("Invalid plan"),
];

const loginValidation = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Must be a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 1, max: 128 }).withMessage("Invalid password"),
];

const changePasswordValidation = [
  body("currentPassword")
    .notEmpty().withMessage("Current password is required"),

  body("newPassword")
    .notEmpty().withMessage("New password is required")
    .isLength({ min: 8 }).withMessage("New password must be at least 8 characters")
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/).withMessage("New password must contain uppercase, lowercase, and number")
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) throw new Error("New password must differ from current password");
      return true;
    }),

  body("confirmPassword")
    .notEmpty().withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) throw new Error("Passwords do not match");
      return true;
    }),
];

const forgotPasswordValidation = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Must be a valid email address")
    .normalizeEmail(),
];

const resetPasswordValidation = [
  body("token")
    .notEmpty().withMessage("Reset token is required")
    .isLength({ min: 10 }).withMessage("Invalid reset token"),

  body("newPassword")
    .notEmpty().withMessage("New password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/).withMessage("Password must contain uppercase, lowercase, and number"),
];

const updateProfileValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 80 }).withMessage("Name must be 2–80 characters"),

  body("phone")
    .optional()
    .matches(/^\+?[\d\s\-().]{7,20}$/).withMessage("Invalid phone number"),

  body("location")
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage("Location too long"),

  body("bio")
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage("Bio must be under 500 characters"),

  body("linkedin")
    .optional()
    .trim()
    .isURL({ protocols: ["https"] }).withMessage("LinkedIn must be a valid HTTPS URL"),

  body("github")
    .optional()
    .trim()
    .isURL({ protocols: ["https"] }).withMessage("GitHub must be a valid HTTPS URL"),

  body("website")
    .optional()
    .trim()
    .isURL().withMessage("Website must be a valid URL"),

  body("skills")
    .optional()
    .isArray().withMessage("Skills must be an array"),
];

// Joi schemas for programmatic validation
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(80).required(),
  email: Joi.string().email().max(254).required(),
  password: Joi.string().min(8).max(128).required(),
  confirmPassword: Joi.any().valid(Joi.ref("password")).required().messages({ "any.only": "Passwords do not match" }),
  jobTitle: Joi.string().max(100).optional().allow(""),
  experience: Joi.string().valid("0-1 years", "1-3 years", "3-5 years", "5-10 years", "10+ years").optional(),
  plan: Joi.string().valid("free", "pro", "enterprise").default("free"),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(1).max(128).required(),
});

module.exports = {
  registerValidation,
  loginValidation,
  changePasswordValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  updateProfileValidation,
  registerSchema,
  loginSchema,
};