const { geminiChat } = require("../config/gemini");
const { calculateATSScore } = require("./atsScorer.service");
const { extractSkillsFromText } = require("./skillExtractor.service");
const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: parseInt(process.env.CACHE_TTL) || 3600 });

async function generateResumeFeedback(parsedResume) {
  const cacheKey = `feedback_${Buffer.from(parsedResume.rawText.slice(0, 100)).toString("base64")}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const prompt = `You are an expert ATS resume analyst and career coach. Analyze this resume and provide detailed, actionable feedback.

RESUME TEXT:
${parsedResume.rawText.slice(0, 4000)}

Return a JSON object with this exact structure:
{
  "overallScore": <number 0-100>,
  "readabilityScore": <number 0-100>,
  "keywordScore": <number 0-100>,
  "formatScore": <number 0-100>,
  "strengths": [<array of 4-6 specific strengths as strings>],
  "weaknesses": [<array of 4-6 specific weaknesses as strings>],
  "suggestions": [
    {"priority": "high|medium|low", "text": "<specific actionable suggestion>"}
  ],
  "keywords": {
    "found": [<array of important keywords present>],
    "missing": [<array of important missing keywords>]
  },
  "sections": [
    {"name": "<section name>", "score": <0-100>, "status": "excellent|good|average|poor"}
  ],
  "summary": "<2-3 sentence overall assessment>"
}

Be specific, actionable, and professional. Focus on real ATS optimization.`;

  try {
    const raw = await chatCompletion([{ role: "user", content: prompt }], { temperature: 0.3, max_tokens: 2000 });
    const cleaned = raw.replace(/```json\n?|\n?```/g, "").trim();
    const result = JSON.parse(cleaned);
    cache.set(cacheKey, result);
    return result;
  } catch {
    // Fallback to Gemini
    const raw = await geminiChat(prompt, { temperature: 0.3 });
    const cleaned = raw.replace(/```json\n?|\n?```/g, "").trim();
    const result = JSON.parse(cleaned);
    cache.set(cacheKey, result);
    return result;
  }
}

async function generateSkillRecommendations(extractedSkills, targetRole = "") {
  const cacheKey = `skills_${extractedSkills.all.join(",")}_${targetRole}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const prompt = `You are an expert career advisor. Based on these extracted skills and target role, recommend skills to learn.

CURRENT SKILLS: ${extractedSkills.all.join(", ")}
TARGET ROLE: ${targetRole || "Software Engineer"}

Return a JSON array of skill recommendations:
[
  {
    "name": "<skill name>",
    "demand": <market demand score 0-100>,
    "salary": "<e.g. +$12k>",
    "time": "<e.g. 2-3 months>",
    "priority": "high|medium|low",
    "category": "<e.g. Backend, Frontend, Cloud>",
    "reason": "<why this skill is important>",
    "resources": ["<resource 1>", "<resource 2>", "<resource 3>"]
  }
]

Return 5-7 recommendations. Prioritize by market demand and skill gap.`;

  try {
    const raw = await chatCompletion([{ role: "user", content: prompt }], { temperature: 0.4, max_tokens: 1500 });
    const cleaned = raw.replace(/```json\n?|\n?```/g, "").trim();
    const result = JSON.parse(cleaned);
    cache.set(cacheKey, result);
    return result;
  } catch {
    const raw = await geminiChat(prompt, { temperature: 0.4 });
    const cleaned = raw.replace(/```json\n?|\n?```/g, "").trim();
    const result = JSON.parse(cleaned);
    cache.set(cacheKey, result);
    return result;
  }
}

async function generateProfessionalSummary(experience, skills) {
  const expText = experience.map(e => `${e.title} at ${e.company}`).join(", ");
  const skillText = Object.values(skills || {}).join(", ");

  const prompt = `Write a compelling 3-4 sentence professional summary for a resume based on:
Experience: ${expText}
Skills: ${skillText}

The summary should be ATS-optimized, impact-focused, and written in first person without saying "I". Be specific and powerful.`;

  return chatCompletion([{ role: "user", content: prompt }], { temperature: 0.6, max_tokens: 200 });
}

module.exports = { generateResumeFeedback, generateSkillRecommendations, generateProfessionalSummary };