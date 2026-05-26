const client =
require("../config/openrouter");

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

    const completion =
await client.chat.completions.create({

  model:
    "openai/gpt-3.5-turbo",

  response_format: {
    type: "json_object"
  },

  messages: [
    {
      role: "user",
      content: prompt
    }
  ]

});

const text =
completion.choices[0]
.message.content;

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

const completion =
await client.chat.completions.create({

  model:
    "openai/gpt-3.5-turbo",

  response_format: {
    type: "json_object"
  },

  messages: [
    {
      role: "user",
      content: prompt
    }
  ]

});

const text =
completion.choices[0]
.message.content;

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