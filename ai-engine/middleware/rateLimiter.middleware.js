const rateLimit = require("express-rate-limit");
const { STATUS } = require("../constants/statusCodes");
const { logger } = require("../utils/logger");

const createLimiter = ({ windowMs, max, message, skipPaths = [], keyPrefix = "" }) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      const userId = req.user?.id || req.ip;
      return `${keyPrefix}:${userId}`;
    },
    skip: (req) =>
      skipPaths.includes(req.path) ||
      req.path === "/health" ||
      process.env.NODE_ENV === "test",
    handler: (req, res) => {
      logger.warn(`Rate limit exceeded: ${req.method} ${req.path} — IP: ${req.ip}`);
      res.status(STATUS.TOO_MANY_REQUESTS).json({
        success: false,
        message,
        code: "RATE_LIMIT_EXCEEDED",
        retryAfter: Math.ceil(windowMs / 1000),
      });
    },
  });

const globalLimiter = createLimiter({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60_000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 120,
  message: "Too many requests from this IP. Please try again later.",
  keyPrefix: "global",
});

const chatLimiter = createLimiter({
  windowMs: 60_000,
  max: 30,
  message: "Chat message limit reached. Please wait 60 seconds.",
  keyPrefix: "chat",
});

const analysisLimiter = createLimiter({
  windowMs: 60_000,
  max: 12,
  message: "Analysis limit reached. Please wait before analyzing again.",
  keyPrefix: "analysis",
});

const uploadLimiter = createLimiter({
  windowMs: 60_000,
  max: 5,
  message: "Upload limit reached. Please wait 60 seconds before uploading again.",
  keyPrefix: "upload",
});

const interviewLimiter = createLimiter({
  windowMs: 60_000,
  max: 15,
  message: "Interview generation limit reached. Please wait.",
  keyPrefix: "interview",
});

const strictLimiter = createLimiter({
  windowMs: 15 * 60_000,
  max: 10,
  message: "Too many requests for this resource. Please try again in 15 minutes.",
  keyPrefix: "strict",
});

module.exports = {
  globalLimiter,
  chatLimiter,
  analysisLimiter,
  uploadLimiter,
  interviewLimiter,
  strictLimiter,
};