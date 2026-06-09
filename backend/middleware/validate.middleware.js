const {
  body,
  validationResult
} = require("express-validator");

const {
  AppError
} = require("../utils/errorHandler");


// =====================================================
// OLD VALIDATE MIDDLEWARE
// =====================================================

const validate = (
  req,
  res,
  next
) => {

  const errors =
    validationResult(req);

  if (!errors.isEmpty()) {

    const messages =
      errors
        .array()
        .map(
          e =>
            `${e.path}: ${e.msg}`
        )
        .join(", ");

    return next(
      new AppError(
        messages,
        400,
        "VALIDATION_ERROR"
      )
    );

  }

  next();

};


// =====================================================
// CHECK VALIDATION
// =====================================================

const checkValidation = (
  req,
  res,
  next
) => {
  console.log("VALIDATION BODY =", req.body);
console.log("CONTENT TYPE =", req.headers["content-type"]);
  const errors =
    validationResult(req);

  if (!errors.isEmpty()) {

    return res.status(400)
      .json({

        success: false,

        message:
          "Validation failed",

        errors:
          errors.array().map(
            (e) => ({
              field: e.path,
              message: e.msg,
            })
          ),

      });

  }

  next();

};

const validatePortfolioExport = [
  checkValidation,
];
const validateResumeImprovement = [
  body("jobTitle")
    .optional()
    .isString()
    .withMessage("jobTitle must be text"),

  checkValidation,
];
// =====================================================
// RESUME IMPROVEMENT VALIDATOR
// =====================================================

const validatePortfolioGeneration = [

  body("name")
    .notEmpty()
    .withMessage("Name is required"),

  body("title")
    .notEmpty()
    .withMessage("Title is required"),

  body("template")
    .optional()
    .isIn([
      "cyberpunk",
      "glassmorphism",
      "minimal",
      "futuristic",
    ]),

  checkValidation,
];
// =====================================================
// PORTFOLIO GENERATION VALIDATOR
// =====================================================



// =====================================================
// SANITIZER
// =====================================================

const sanitizeBody = (
  req,
  res,
  next
) => {

  const sanitize = (obj) => {

    if (
      typeof obj !== "object" ||
      obj === null
    )
      return obj;

    const clean = {};

    for (const key of Object.keys(obj)) {

      if (
        key === "__proto__" ||
        key === "constructor" ||
        key === "prototype"
      )
        continue;

      clean[key] =
        sanitize(obj[key]);

    }

    return clean;

  };

 if (
  req.headers["content-type"]?.includes("multipart/form-data")
) {
  return next();
}

req.body = sanitize(req.body);
next();

};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {

  validate,

  checkValidation,

  validateResumeImprovement,

  validatePortfolioGeneration,
 validatePortfolioExport,
  sanitizeBody,

};