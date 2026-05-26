const { validationResult } = require("express-validator");
const Joi = require("joi");
const { AppError } = require("../utils/errorHandler");
const { STATUS } = require("../constants/statusCodes");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((e) => ({
      field: e.path || e.param,
      message: e.msg,
      value: e.value,
    }));
    return next(
      new AppError(
        `Validation failed: ${formatted.map((e) => `${e.field} — ${e.message}`).join("; ")}`,
        STATUS.BAD_REQUEST,
        "VALIDATION_ERROR",
        formatted
      )
    );
  }
  next();
};

const validateJoi = (schema, source = "body") => async (req, res, next) => {
  try {
    const data = source === "body" ? req.body : source === "query" ? req.query : req.params;
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      const details = error.details.map((d) => ({
        field: d.path.join("."),
        message: d.message.replace(/['"]/g, ""),
      }));
      return next(
        new AppError(
          `Validation failed: ${details.map((d) => `${d.field} — ${d.message}`).join("; ")}`,
          STATUS.BAD_REQUEST,
          "VALIDATION_ERROR",
          details
        )
      );
    }

    if (source === "body") req.body = value;
    else if (source === "query") req.query = value;
    else req.params = value;

    next();
  } catch (err) {
    next(err);
  }
};

const sanitizeBody = (req, res, next) => {
  const sanitize = (obj) => {
    if (!obj || typeof obj !== "object") return obj;
    const result = {};
    for (const [key, val] of Object.entries(obj)) {
      if (typeof val === "string") {
        result[key] = val.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").trim();
      } else if (Array.isArray(val)) {
        result[key] = val.map((v) => (typeof v === "string" ? v.trim() : v));
      } else if (typeof val === "object") {
        result[key] = sanitize(val);
      } else {
        result[key] = val;
      }
    }
    return result;
  };
  req.body = sanitize(req.body);
  next();
};

module.exports = { validate, validateJoi, sanitizeBody };