const { geminiChat } = require("../config/gemini");
const NodeCache = require("node-cache");

const cache = new NodeCache({
  stdTTL: 1800,
});

async function generateInterviewQuestions(
  role,
  category = "All",
  difficulty = "All",
  count = 10
) {

  const cacheKey =
    `iq_${role}_${category}_${difficulty}_${count}`;

  const cached = cache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const prompt = `
Generate ${count} interview questions for a ${role} position.

${category !== "All"
  ? `Category: ${category}`
  : "Mix of behavioral, technical, and situational"}

${difficulty !== "All"
  ? `Difficulty: ${difficulty}`
  : "Mix of difficulties"}

Return a JSON array:

[
  {
    "id": 1,
    "question": "",
    "category": "Behavioral|Technical|System Design|HR|Situational",
    "difficulty": "Easy|Medium|Hard",
    "tip": "",
    "keywords": ["key1", "key2"]
  }
]

Make questions specific to the ${role} role.
Include real-world scenarios.
`;

  try {

    const raw = await geminiChat(prompt, {
      temperature: 0.8,
      maxTokens: 2000,
    });

    const cleaned =
      raw
        .replace(/```json\n?/g, "")
        .replace(/\n?```/g, "")
        .trim();

    const result = JSON.parse(cleaned);

    cache.set(cacheKey, result);

    return result;

  } catch (err) {

    console.log(
      "Interview Question Error:",
      err
    );

    throw new Error(
      "Interview question generation failed"
    );
  }
}

async function evaluateInterviewAnswer(
  question,
  answer
) {

  const prompt = `
You are an expert interviewer evaluating a candidate's answer.

QUESTION:
${question}

CANDIDATE ANSWER:
${answer}

Return ONLY valid JSON:

{
  "score": 0,
  "grade": "",
  "strengths": [],
  "improvements": [],
  "missedKeyPoints": [],
  "sampleAnswer": "",
  "followUpQuestions": []
}
`;

  try {

    const raw = await geminiChat(prompt, {
      temperature: 0.4,
      maxTokens: 800,
    });

    const cleaned =
      raw
        .replace(/```json\n?/g, "")
        .replace(/\n?```/g, "")
        .trim();

    return JSON.parse(cleaned);

  } catch (err) {

    console.log(
      "Interview Evaluation Error:",
      err
    );

    throw new Error(
      "Interview evaluation failed"
    );
  }
}

module.exports = {
  generateInterviewQuestions,
  evaluateInterviewAnswer,
};