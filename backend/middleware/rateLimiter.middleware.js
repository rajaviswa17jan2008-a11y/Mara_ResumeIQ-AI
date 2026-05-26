const rateLimit = require("express-rate-limit");

const createLimiter = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message },
    skip: (req) => req.path === "/health",
  });

const globalLimiter = createLimiter(
  parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60_000,
  parseInt(process.env.RATE_LIMIT_MAX) || 100,
  "Too many requests. Please try again later."
);

const chatLimiter = createLimiter(60_000, 30, "Too many chat messages. Please slow down.");

const analysisLimiter = createLimiter(60_000, 10, "Analysis limit reached. Please wait before analyzing again.");

const uploadLimiter = createLimiter(60_000, 5, "Upload limit reached. Please wait before uploading again.");

module.exports = { globalLimiter, chatLimiter, analysisLimiter, uploadLimiter };