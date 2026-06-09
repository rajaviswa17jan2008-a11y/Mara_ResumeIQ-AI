const ai = require("../config/gemini");
const MODELS =
require("../config/aiModels");
const {
  buildResumeImprovementMessages,
  buildSectionImprovementMessages,
} = require("../utils/resumeImprovementPrompt");

/**
 * Analyze full resume using REAL OpenRouter AI
 */
const analyzeResumeForImprovement = async (
  resumeText,
  targetRole = "",
  targetIndustry = ""
) => {

  resumeText = resumeText.slice(0, 4000);

  const messages =
    buildResumeImprovementMessages(
      resumeText,
      targetRole,
      targetIndustry
    );

  try {
    const response =
await ai.models.generateContent({
    model: MODELS.ANALYSIS,
contents:`
You are an ATS resume analyzer.

Respond ONLY in valid JSON.

Response format:

{
  "overallScore": number,
  "atsIssues": [
    {
      "title": string,
      "description": string,
      "severity": "high" | "medium" | "low"
    }
  ],
  "missingKeywords": [
    {
      "keyword": string,
      "importance": "critical" | "important" | "nice"
    }
  ],
  "grammarSuggestions": [
    {
      "type": string,
      "original": string,
      "improved": string,
      "reason": string
    }
  ],
  "improvementTips": [
    {
      "category": string,
      "tip": string,
      "impact": "high" | "medium" | "low"
    }
  ],
  "weakSections": [string]
}

${JSON.stringify(messages)}
`,
  });

const raw = response.text;

          

if (!raw) {
  console.log(
  "FULL RESPONSE:",
  JSON.stringify(response, null, 2)
);

  throw new Error(
    "No content returned from AI"
  );
}

    const cleaned = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed = {};

try {

  parsed = JSON.parse(cleaned);

} catch (parseError) {

  console.log(
    "RAW AI RESPONSE:\n",
    raw
  );

  throw new Error(
    "Invalid JSON returned from AI"
  );
}

    return {
      overallScore:
        parsed.overallScore || 65,

      atsIssues:
        parsed.atsIssues || [],

      missingKeywords:
        parsed.missingKeywords || [],

      grammarSuggestions:
        parsed.grammarSuggestions || [],

      improvementTips:
        parsed.improvementTips || [],

      weakSections:
        parsed.weakSections || [],
    };

  } catch (err) {

  console.log(
    "FULL ERROR:",
    err.response?.data || err
  );

  throw err;
}
};





/**
 * Improve single section
 */
const improveSingleSection = async (
  sectionContent,
  sectionName,
  targetRole = ""
) => {

  const messages =
    buildSectionImprovementMessages(
      sectionContent,
      sectionName,
      targetRole
    );

  try {

   const response =
await ai.models.generateContent({
  model: MODELS.IMPROVEMENT,
  contents: `
You are an ATS resume analyzer.

Respond ONLY in valid JSON.

${JSON.stringify(messages)}
`,
});

const raw = response.text;

if (!raw) {
  console.log(
    "FULL RESPONSE:",
    JSON.stringify(response, null, 2)
  );

  throw new Error(
    "No content returned from AI"
  );
}

    const cleaned = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

   try {

  return JSON.parse(cleaned);

} catch (parseError) {

  console.log(
    "RAW SECTION RESPONSE:\n",
    raw
  );

  throw new Error(
    "Invalid JSON returned from AI"
  );
}

  } catch (err) {

    console.log(
      "Section Improvement AI Error:",
      err.message
    );

    throw new Error(
      "AI Section Improvement Failed"
    );
  }
};
module.exports = {
  analyzeResumeForImprovement,
  improveSingleSection,
};