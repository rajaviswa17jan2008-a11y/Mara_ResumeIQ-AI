const { generateInterviewQuestions, evaluateInterviewAnswer } = require("../services/interviewGenerator.service");
const { logger } = require("../utils/logger");

exports.generateQuestions = async (req, res) => {
  const { role, category = "All", difficulty = "All", count = 10 } = req.body;
  if (!role) return res.status(400).json({ success: false, message: "Job role required" });
  try {
    const questions = await generateInterviewQuestions(role, category, difficulty, Math.min(count, 20));
    res.json({ success: true, data: { questions, role, category, difficulty } });
  } catch (err) {
    logger.error("Interview gen error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.evaluateAnswer = async (req, res) => {
  const { question, answer } = req.body;
  if (!question || !answer) return res.status(400).json({ success: false, message: "Question and answer required" });
  if (answer.trim().length < 20) return res.status(400).json({ success: false, message: "Answer too short (min 20 chars)" });
  try {
    const feedback = await evaluateInterviewAnswer(question, answer);
    res.json({ success: true, data: feedback });
  } catch (err) {
    logger.error("Answer eval error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};