const {
  geminiChat,
} = require("../config/gemini");

function cosineSimilarity(a, b) {

  const dot =
    a.reduce((sum, ai, i) =>
      sum + ai * b[i], 0);

  const magA =
    Math.sqrt(
      a.reduce((sum, ai) =>
        sum + ai * ai, 0)
    );

  const magB =
    Math.sqrt(
      b.reduce((sum, bi) =>
        sum + bi * bi, 0)
    );

  return dot / (magA * magB);
}

async function matchJobsToResume(
  resumeSkills,
  resumeText,
  jobs
) {

  // Keyword-based matching
  return jobs.map(job => {

    const jobText =
      `${job.title}
       ${job.requirements?.join(" ") || ""}
       ${job.description || ""}`
      .toLowerCase();

    const matches =
      resumeSkills.all.filter(skill =>
        jobText.includes(skill.toLowerCase())
      ).length;

    const total =
      resumeSkills.all.length || 1;

    return {
      ...job,
      matchScore: Math.min(
        95,
        Math.round((matches / total) * 100) + 40
      ),
    };

  }).sort((a, b) =>
    b.matchScore - a.matchScore
  );
}

async function generateJobMatchAnalysis(
  resume,
  job
) {

  const prompt = `
Analyze the match between this resume and job posting.

RESUME SKILLS:
${resume.skills?.join(", ")}

RESUME EXPERIENCE:
${resume.rawText?.slice(0, 1000)}

JOB:
${job.title} at ${job.company}

REQUIREMENTS:
${job.requirements?.join(", ") || job.description}

Return ONLY valid JSON:

{
  "matchScore": 0,
  "matchingSkills": [],
  "missingSkills": [],
  "strengths": [],
  "gaps": [],
  "recommendation": "",
  "tailoringSuggestions": []
}
`;

  try {

    const raw =
      await geminiChat(prompt);

    const cleaned =
      raw
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    return JSON.parse(cleaned);

  } catch (err) {

    console.log(
      "Gemini Job Match Error:",
      err
    );

    throw new Error(
      "Job match analysis failed"
    );
  }
}

module.exports = {
  matchJobsToResume,
  generateJobMatchAnalysis,
};