/**
 * Resume Improvement Prompt Builder
 * Constructs highly specific AI prompts for deep resume analysis.
 * Place this file at: backend/utils/resumeImprovementPrompt.js
 */

/**
 * Builds the full message array for the resume improvement AI call.
 * @param {string} resumeText      - Raw resume text
 * @param {string} targetRole      - e.g. "Senior Frontend Engineer"
 * @param {string} targetIndustry  - e.g. "FinTech"
 * @returns {Array} OpenAI message format
 */
const buildResumeImprovementMessages = (
  resumeText,
  targetRole = "",
  targetIndustry = ""
) => {
  const contextLine =
    targetRole || targetIndustry
      ? `The candidate is targeting: Role = "${targetRole || "Not specified"}", Industry = "${targetIndustry || "Not specified"}".`
      : "No specific target role or industry was provided. Give general professional advice.";

  const systemPrompt = `
You are a world-class resume coach and ATS expert with 15+ years of experience helping candidates land roles at top companies like Google, Amazon, Microsoft, and leading startups.

Your task is to perform a DEEP, PROFESSIONAL analysis of the provided resume and return ONLY a valid JSON object — no markdown, no explanation, no text outside the JSON.

${contextLine}

Analyze the resume across ALL of the following dimensions and return this EXACT JSON structure:

{
  "overallScore": <integer 0-100>,
  "atsScore": <integer 0-100>,
  "readabilityScore": <integer 0-100>,
  "impactScore": <integer 0-100>,

  "atsIssues": [
    {
      "severity": "critical|warning|info",
      "category": "formatting|keywords|structure|length|contact",
      "issue": "<specific issue description>",
      "fix": "<exact actionable fix>"
    }
  ],

     "missingKeywords": [
  {
    "keyword": "React",
    "importance": "critical"
  
],
    "softSkills": ["leadership", "communication"],
    "industrySpecific": ["keyword1"],
    "actionVerbs": ["achieved", "optimized", "launched"]
  },

  "grammarSuggestions": [
    {
      "type": "grammar|tone|clarity|wordiness|passive_voice",
      "original": "<the problematic phrase from resume>",
      "suggestion": "<improved version>",
      "reason": "<why this is better>"
    }
  ],

  "weakSections": [
    {
      "section": "Summary|Experience|Education|Skills|Projects|Certifications",
      "severity": "critical|moderate|minor",
      "problem": "<what is weak>",
      "recommendation": "<exact improvement steps>"
    }
  ],

  "strengths": [
    {
      "area": "<what is strong>",
      "reason": "<why this is a strength>"
    }
  ],

  "improvementTips": [
    {
      "priority": "high|medium|low",
      "category": "content|format|keywords|impact|length|structure",
      "tip": "<specific actionable tip>",
      "example": "<before/after example or implementation detail>"
    }
  ],

  "rewriteSuggestions": {
    "summary": "<a rewritten professional summary if the current one is weak or missing>",
    "topBulletRewrite": [
      {
        "original": "<original bullet point>",
        "rewritten": "<stronger, metric-driven rewrite>"
      }
    ]
  },

  "professionalRecommendations": [
    "<specific professional career-level recommendation as a full sentence>"
  ],

  "formattingIssues": [
    {
      "issue": "<formatting problem>",
      "fix": "<how to fix it>"
    }
  ],

  "estimatedInterviewChance": "<Low|Moderate|High|Very High>",
  "summaryFeedback": "<2-3 sentence honest overall assessment of the resume>"
}

Rules:
- Be brutally honest but constructive
- Base all feedback on the ACTUAL resume content provided
- Provide SPECIFIC examples from the resume, not generic advice
- All string values must be non-empty
- Return ONLY the JSON, nothing else
`.trim();

  return [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: `Please analyze this resume:\n\n---\n${resumeText}\n---`,
    },
  ];
};

/**
 * Builds a quick "single section" improvement prompt.
 * Used when user wants to improve one specific section.
 * @param {string} sectionContent  - The section text
 * @param {string} sectionName     - e.g. "Summary", "Experience"
 * @param {string} targetRole
 * @returns {Array}
 */
const buildSectionImprovementMessages = (
  sectionContent,
  sectionName,
  targetRole = ""
) => {
  return [
    {
      role: "system",
      content:
        `You are a professional resume writer. Rewrite the provided resume "${sectionName}" section ` +
        `to be stronger, more impactful, ATS-optimized, and quantifiable. ` +
        `${targetRole ? `Target role: ${targetRole}.` : ""} ` +
        `Return ONLY a JSON object: { "original": "...", "rewritten": "...", "changes": ["change1", "change2"] }`,
    },
    {
      role: "user",
      content: `${sectionName} section to improve:\n\n${sectionContent}`,
    },
  ];
};

module.exports = {
  buildResumeImprovementMessages,
  buildSectionImprovementMessages,
};