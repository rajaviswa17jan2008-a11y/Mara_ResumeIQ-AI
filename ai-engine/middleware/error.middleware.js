const { logger } = require("../utils/logger");
const { STATUS } = require("../constants/statusCodes");

const notFound = (req, res, next) => {
  res.status(STATUS.NOT_FOUND).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    code: "NOT_FOUND",
    timestamp: new Date().toISOString(),
  });
};

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || STATUS.INTERNAL_SERVER_ERROR;
  let message = err.message || "An unexpected error occurred";
  let code = err.code || "INTERNAL_ERROR";
  let details = err.details || null;

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = STATUS.BAD_REQUEST;
    code = "VALIDATION_ERROR";
    message = Object.values(err.errors).map((e) => e.message).join("; ");
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === "CastError") {
    statusCode = STATUS.BAD_REQUEST;
    code = "INVALID_ID";
    message = `Invalid value for field: ${err.path}`;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = STATUS.CONFLICT;
    code = "DUPLICATE_KEY";
    const field = Object.keys(err.keyValue || {})[0];
    message = `Duplicate value for field: ${field}`;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = STATUS.UNAUTHORIZED;
    code = "INVALID_TOKEN";
    message = "Invalid authentication token";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = STATUS.UNAUTHORIZED;
    code = "TOKEN_EXPIRED";
    message = "Authentication token has expired";
  }

  // Multer errors
  if (err.name === "MulterError") {
    statusCode = STATUS.BAD_REQUEST;
    code = "UPLOAD_ERROR";
    message = err.message;
  }

  // Axios errors (upstream service)
  if (err.isAxiosError) {
    statusCode = err.response?.status || STATUS.BAD_GATEWAY;
    code = "UPSTREAM_ERROR";
    message = "Upstream service error";
    if (process.env.NODE_ENV === "development") {
      message = err.response?.data?.message || err.message;
    }
  }

  // OpenAI API errors
  if (err.constructor?.name === "APIError" || err.status === 429) {
    statusCode = STATUS.TOO_MANY_REQUESTS;
    code = "AI_RATE_LIMIT";
    message = "AI service rate limit reached. Please wait and try again.";
  }

  // SyntaxError (bad JSON body)
  if (err instanceof SyntaxError && err.status === 400) {
    statusCode = STATUS.BAD_REQUEST;
    code = "INVALID_JSON";
    message = "Invalid JSON in request body";
  }

  // Log error
  const logPayload = {
    statusCode,
    code,
    method: req.method,
    path: req.originalUrl,
    ip: req.ip,
    userId: req.user?.id,
    userAgent: req.headers["user-agent"],
  };

  if (statusCode >= 500) {
    logger.error(`[${code}] ${message}`, { ...logPayload, stack: err.stack });
  } else if (statusCode >= 400) {
    logger.warn(`[${code}] ${message}`, logPayload);
  }

  const response = {
    success: false,
    message,
    code,
    timestamp: new Date().toISOString(),
    ...(details && { details }),
    ...(process.env.NODE_ENV === "development" && statusCode >= 500 && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};

module.exports = { errorHandler, notFound };