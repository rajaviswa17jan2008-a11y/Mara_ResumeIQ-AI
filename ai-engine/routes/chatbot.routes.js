const express = require("express");
const router = express.Router();
const { chat } = require("../controllers/chatbot.controller");
const { body, validationResult } = require("express-validator");
const rateLimit = require("express-rate-limit");

const chatLimiter = rateLimit({ windowMs: 60 * 1000, max: 30, message: { success: false, message: "Too many messages. Slow down." } });

router.post("/", chatLimiter, [body("message").notEmpty().isLength({ max: 2000 })], (req, res, next) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) return res.status(400).json({ success: false, errors: errs.array() });
  next();
}, chat);

module.exports = router;