const ai =
require("../config/gemini");
const MODELS =
require("../config/aiModels");
const cacheMiddleware = require("../middleware/cache.middleware");
const cache = cacheMiddleware.cache;
const { safeParseJSON, ensureArray, ensureObject } = require("../utils/jsonParser");
const { buildInterviewQuestionsPrompt, buildAnswerEvaluationPrompt } = require("../utils/promptBuilder");
const { logger } =
require("../utils/logger");
const crypto = require("crypto");
async function callAI(
  prompt
) {

  const response =
await ai.models.generateContent({
  model: MODELS.INTERVIEW,
  contents: prompt,
});
  return response.text;
}



async function generateInterviewQuestions(role, category = "All", difficulty = "All", count = 10) {
  const cacheKey = `iq_${crypto.createHash("md5").update(`${role}${category}${difficulty}${count}`).digest("hex")}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const prompt = buildInterviewQuestionsPrompt(role, category, difficulty, count);
  const raw = await callAI(prompt, { temperature: 0.82, max_tokens: 2200 });
  const parsed = safeParseJSON(raw);
  const questions = ensureArray(parsed).map((q, i) => ({ ...q, id: q.id || i + 1 }));

  cache.set(cacheKey, questions, 1800);
  return questions;
}

async function evaluateInterviewAnswer(question, answer) {
  const prompt = buildAnswerEvaluationPrompt(question, answer);
  const raw = await callAI(prompt, { temperature: 0.35, max_tokens: 900 });

  const defaults = {
    score: 65, grade: "Average",
    strengths: ["Response provided"],
    improvements: ["Could be more specific"],
    missedKeyPoints: [],
    sampleAnswer: "A strong answer would include concrete examples, measurable outcomes, and clear reasoning.",
    followUpQuestions: [],
  };

  return ensureObject(safeParseJSON(raw), defaults);
}

async function generateRoleFocusedPlan(role, weeks = 4) {
  const cacheKey = `plan_${crypto.createHash("md5").update(`${role}${weeks}`).digest("hex")}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const prompt = `Create a ${weeks}-week interview preparation plan for a ${role} position.
Return ONLY a valid JSON array:
[
  {
    "week": <number>,
    "focus": "<main focus area>",
    "topics": ["<topic 1>", "<topic 2>"],
    "practiceQuestions": <number of questions to practice>,
    "resources": ["<resource 1>", "<resource 2>"]
  }
]`;

  const raw = await callAI(prompt, { temperature: 0.5, max_tokens: 1000 });
  const result = ensureArray(safeParseJSON(raw));
  cache.set(cacheKey, result, 7200);
  return result;
}

module.exports = { generateInterviewQuestions, evaluateInterviewAnswer, generateRoleFocusedPlan };