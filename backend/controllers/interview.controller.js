const ai =
require("../config/gemini");
const MODELS =
require("../config/aiModels");
exports.generateQuestions =
async (req, res) => {

  try {

    const {
      role,
      category,
      difficulty
    } = req.body;

    const prompt = `

Generate 10 REAL interview questions.

Role:
${role}

Category:
${category}

Difficulty:
${difficulty}

IMPORTANT:
- Questions must be REAL
- Different for every role
- Include technical depth
- Return ONLY JSON

Format:

{
  "questions":[
    {
      "id":1,
      "question":"",
      "category":"",
      "difficulty":"",
      "tip":""
    }
  ]
}

`;

    const response =
await ai.models.generateContent({
  model: MODELS.INTERVIEW,
  contents: prompt,
});

const text = response.text;

const parsed =
JSON.parse(text);

res.json(parsed);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message:
        "Interview generation failed"
    });

  }

};
exports.generateFeedback =
async (req, res) => {

  try {

    const {
      question,
      answer
    } = req.body;

    const prompt = `

You are an expert AI interviewer.

Question:
${question}

Candidate Answer:
${answer}

Analyze answer carefully.

Return ONLY JSON.

Format:

{
  "score": 0-100,
  "strengths": [],
  "improvements": [],
  "sampleAnswer": ""
}

`;



const response =
await ai.models.generateContent({
  model: MODELS.INTERVIEW,
  contents: prompt,
});

const text = response.text;

const parsed =
JSON.parse(text);

res.json(parsed);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message:
        "Feedback generation failed"
    });

  }

};