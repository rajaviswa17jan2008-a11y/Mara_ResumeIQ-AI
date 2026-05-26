const { getChatbotResponse } = require("../services/chatbot.service");
const { logger } = require("../utils/logger");

exports.chat = async (req, res) => {
  const { message, history = [] } = req.body;
  if (!message?.trim()) return res.status(400).json({ success: false, message: "Message required" });
  try {
    const reply = await getChatbotResponse(message, history);
    res.json({ success: true, data: { reply, timestamp: new Date().toISOString() } });
  } catch (err) {
    logger.error("Chatbot error:", err);
    res.status(500).json({ success: false, message: "AI service unavailable. Please try again." });
  }
};