const client =
require("../config/openrouter");
const { safeParseJSON, ensureObject } = require("../utils/jsonParser");
const { buildJobMatchPrompt } = require("../utils/promptBuilder");
const logger = require("../utils/logger");

function cosineSimilarity(a, b) {
  if (!a?.length || !b?.length || a.length !== b.length) return 0;
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

function keywordMatchScore(resumeSkills, job) {
  const jobText = `${job.title} ${Array.isArray(job.requirements) ? job.requirements.join(" ") : job.description || ""}`.toLowerCase();
  const matches = resumeSkills.filter(s => jobText.includes(s.toLowerCase())).length;
  const base = Math.min(85, Math.round((matches / Math.max(resumeSkills.length, 1)) * 100));
  return Math.min(
  100,
  base + (
    matches >= 5
      ? 10
      : matches >= 3
      ? 5
      : 2
  )
);
}
async function matchJobsToResume(
  resumeSkills,
  resumeText,
  jobs
) {

  if (!jobs?.length) return [];

  const scored =
    jobs.map((job) => {

      const score =
        keywordMatchScore(
          resumeSkills.all || resumeSkills,
          job
        );

      return {
        ...job,
        matchScore: score
      };
    });

  return scored.sort(
    (a, b) =>
      b.matchScore - a.matchScore
  );
}

async function generateJobMatchAnalysis(resume, job) {
  const skills = resume.skills || [];
     const prompt = `

You are an expert AI job matcher.

Analyze the resume and job carefully.

Resume Skills:
${Array.isArray(skills)
  ? skills.join(", ")
  : (skills.all || []).join(", ")}

Resume:
${resume.rawText || resume.text || ""}

Job:
${JSON.stringify(job)}

IMPORTANT:

- Use REAL resume content
- Use REAL job requirements
- Do NOT generate mock/sample output
- Do NOT use fixed scores
- Return ONLY valid JSON
- No markdown
- No explanation

Return format:

{
  "matchScore": number,
  "matchingSkills": [],
  "missingSkills": [],
  "strengths": [],
  "gaps": [],
  "recommendation": "",
  "tailoringSuggestions": []
}

`;
    
  const defaults = {
  matchScore: 0,
  matchingSkills: [],
  missingSkills: [],
  strengths: [],
  gaps: [],
  recommendation: "No recommendation available",
  tailoringSuggestions: [],
};
const completion =
await client.chat.completions.create({

  model:
    "openai/gpt-3.5-turbo",

  temperature: 0.1,

  max_tokens: 700,

  messages: [
    {
      role: "user",
      content: prompt,
    },
  ],

});

const raw =
completion.choices[0]
.message.content;
console.log(
  "JOB MATCH AI:",
  raw
);

const cleaned = raw
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

const jsonMatch =
  cleaned.match(/\{[\s\S]*\}/);

if (!jsonMatch) {

  return defaults;

}

return ensureObject(
  JSON.parse(jsonMatch[0]),
  defaults
);
}

module.exports = { matchJobsToResume, generateJobMatchAnalysis, cosineSimilarity };