const client =
require("../config/openrouter");

async function generateResumeFeedback(
  parsedText,
  targetRole,
  skills
) {

  try {
    const candidateName =

  typeof parsedText === "string"

    ? "The candidate"

    : parsedText.name || "The candidate";
    const prompt = `

You are an expert ATS resume analyzer.

Analyze the following resume carefully.

Candidate Name:
${candidateName}

Resume:
${typeof parsedText === "string"
  ? parsedText
  : parsedText.rawText || JSON.stringify(parsedText)}

Target Role:
${targetRole}

Skills:
${skills?.join(", ")}

IMPORTANT:
- Summary MUST include the exact candidate name from the resume
- Use the extracted resume name dynamically
- Do not use generic words like "candidate" or "the resume"
- Generate summary based only on actual resume content
- Analyze REAL resume content carefully
- ATS score MUST be calculated dynamically
- Different resumes MUST produce different scores
- Base ATS score on:
  - skills quality
  - projects
  - certifications
  - formatting
  - experience
  - keywords
  - resume completeness
- Weak resumes should get low scores
- Strong resumes should get high scores
- NEVER return fixed scores like 85 repeatedly
- Return ONLY valid JSON
- No markdown
- No explanation

Return format:

{
  "atsScore": number,
  "strengths": [],
  "improvements": [],
  "keywords": [],
  "summary": ""
}

`;

    const completion =
await client.chat.completions.create({

  model:
    "openai/gpt-3.5-turbo",
    temperature: 0.7,
    max_tokens: 700,
    response_format: {
  type: "json_object"
},

  messages: [
    {
      role: "user",
      content: prompt,
    },
  ],

});

const text =
completion.choices[0]
.message.content;
let feedback;

try {

  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const jsonMatch =
    cleaned.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {

    throw new Error(
      "No valid JSON found"
    );

  }

  feedback =
  JSON.parse(jsonMatch[0]);

if (
  !feedback.atsScore ||
  feedback.atsScore === 85
) {
const safeText =

  typeof parsedText === "string"

    ? parsedText

    : parsedText.rawText || "";

const textLength =
  safeText.length || 0;

  const skillsCount =
    skills?.length || 0;

  let dynamicScore = 35;

  // Skills score
  dynamicScore +=
    Math.min(skillsCount * 4, 35);

  // Resume content quality
  dynamicScore +=
    Math.min(
      Math.floor(textLength / 400),
      25
    );

  // Projects bonus
  if (
    safeText.toLowerCase()
      .includes("project")
  ) {
    dynamicScore += 10;
  }

  // Internship bonus
  if (
    safeText.toLowerCase()
      .includes("intern")
  ) {
    dynamicScore += 8;
  }

  // Certification bonus
  if (
    safeText.toLowerCase()
      .includes("certification")
  ) {
    dynamicScore += 7;
  }

  feedback.atsScore =
    Math.max(
      35,
      Math.min(dynamicScore, 95)
    );

}

} catch (parseError) {

  console.error(
    "JSON Parse Error:",
    parseError.message
  );
feedback = {

  atsScore: null,

  strengths: [],

  improvements: [],

  keywords: [],

  summary:
    "AI parsing failed"

};

}
console.log(
  "AI RAW RESPONSE:",
  text
);
    return {
      success: true,
      feedback
    };

  } catch (error) {

    console.error(
  "OpenRouter AI Error:",
  error.message
);

  throw new Error(
  "OpenRouter AI analysis failed"
);
  }
}
module.exports = {

  generateResumeFeedback

};