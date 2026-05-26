const { NODE_ENV } = require("../config/env");
 
const errorMiddleware = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
 
  // Log error in development
  if (NODE_ENV === "development") {
    console.error("❌ Error:", err.stack);
  }
 
  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    error.message = `Resource not found with id: ${err.value}`;
    error.statusCode = 404;
  }
 
  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error.message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
    error.statusCode = 400;
  }
 
  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    error.message = messages.join(". ");
    error.statusCode = 400;
  }
 
  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error.message = "Invalid authentication token.";
    error.statusCode = 401;
  }
 
  if (err.name === "TokenExpiredError") {
    error.message = "Authentication token has expired.";
    error.statusCode = 401;
  }
 
  // Multer errors
  if (err.code === "LIMIT_FILE_SIZE") {
    error.message = "File too large. Maximum size is 10MB.";
    error.statusCode = 400;
  }
 
  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    error.message = "Unexpected file field.";
    error.statusCode = 400;
  }
 
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal Server Error",
    ...(NODE_ENV === "development" && { stack: err.stack, error: err }),
  });
};
 
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
 
module.exports = { errorMiddleware, asyncHandler };
