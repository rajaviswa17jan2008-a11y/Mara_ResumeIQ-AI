const { AI_PROMPTS } = require("../constants/aiPrompts");
const { countTokens, truncateToTokenLimit } = require("./tokenCounter");

function buildResumeAnalysisPrompt(resumeText, targetRole = "", options = {}) {
  const { maxTokens = 4000, includeJobDescription = false, jobDescription = "" } = options;

  const safeResume = truncateToTokenLimit(resumeText, maxTokens);
  let prompt = AI_PROMPTS.TEMPLATES.RESUME_ANALYSIS(safeResume, targetRole);

  if (includeJobDescription && jobDescription) {
    const safeJD = truncateToTokenLimit(jobDescription, 800);
    prompt += `\n\nJOB DESCRIPTION FOR CONTEXT:\n"""\n${safeJD}\n"""`;
  }

  return prompt;
}

function buildSkillRecommendationPrompt(currentSkills = [], targetRole = "", options = {}) {
  const safeSkills = currentSkills.slice(0, 80);
  return AI_PROMPTS.TEMPLATES.SKILL_RECOMMENDATIONS(safeSkills, targetRole);
}

function buildInterviewQuestionsPrompt(role, category = "All", difficulty = "All", count = 10) {
  return AI_PROMPTS.TEMPLATES.INTERVIEW_QUESTIONS(role, category, difficulty, count);
}

function buildAnswerEvaluationPrompt(question, answer) {
  const safeAnswer = truncateToTokenLimit(answer, 3000);
  return AI_PROMPTS.TEMPLATES.ANSWER_EVALUATION(question, safeAnswer);
}

function buildChatSystemPrompt(userContext = {}) {
  const { name, jobTitle, experience, plan, skills = [] } = userContext;

  const contextLines = [];
  if (name) contextLines.push(`You are speaking with: ${name}`);
  if (jobTitle) contextLines.push(`Their current/target role: ${jobTitle}`);
  if (experience) contextLines.push(`Experience level: ${experience}`);
  if (plan) contextLines.push(`Subscription plan: ${plan}`);
  if (skills.length > 0) contextLines.push(`Key skills: ${skills.slice(0, 15).join(", ")}`);

  const contextBlock = contextLines.length
    ? `\n\nUSER CONTEXT:\n${contextLines.join("\n")}`
    : "";

  return AI_PROMPTS.SYSTEM.CAREER_COACH + contextBlock;
}

function buildJobMatchPrompt(skills = [], resumeText = "", job = {}) {
  return AI_PROMPTS.TEMPLATES.JOB_MATCH(skills, resumeText, job);
}

function buildProfessionalSummaryPrompt(experience = [], skills = {}) {
  const expText = experience
    .slice(0, 5)
    .map(e => {
      const parts = [];
      if (e.title) parts.push(e.title);
      if (e.company) parts.push(`at ${e.company}`);
      if (e.startDate) parts.push(`(${e.startDate}–${e.current ? "Present" : e.endDate || ""})`);
      return parts.join(" ");
    })
    .join("; ");

  const skillText =
    typeof skills === "string"
      ? skills
      : Object.values(skills).filter(Boolean).join(", ");

  return AI_PROMPTS.TEMPLATES.PROFESSIONAL_SUMMARY(expText, skillText);
}

function buildSkillGapPrompt(currentSkills = [], targetRole = "", requirements = []) {
  return `${AI_PROMPTS.INSTRUCTIONS.JSON_ONLY}
${AI_PROMPTS.INSTRUCTIONS.CURRENT_MARKET}

Perform a precise skill gap analysis.

CURRENT SKILLS: ${currentSkills.join(", ")}
TARGET ROLE: ${targetRole}
ROLE REQUIREMENTS: ${requirements.join(", ")}

Return this exact JSON:
{
  "coverage": <integer 0-100, percentage of requirements met>,
  "matchedSkills": ["<skill that matches a requirement>"],
  "gapSkills": ["<required skill currently missing>"],
  "prioritizedLearningPath": [
    {
      "skill": "<skill to learn>",
      "urgency": "critical|high|medium|low",
      "timeToLearn": "<e.g. 3-4 weeks>",
      "prereqs": ["<prerequisite skill if any>"]
    }
  ],
  "readinessScore": <integer 0-100, overall readiness for this role>,
  "estimatedTimeToReady": "<e.g. 3-4 months>",
  "advice": "<2-3 sentence specific advice for bridging the gap>"
}`;
}

function addJsonInstruction(prompt) {
  return `${AI_PROMPTS.INSTRUCTIONS.JSON_ONLY}\n\n${prompt}`;
}

function buildBatchAnalysisPrompt(resumes = []) {
  return `${AI_PROMPTS.INSTRUCTIONS.JSON_ONLY}

Analyze and rank these ${resumes.length} resumes for comparative assessment.

${resumes.map((r, i) => `RESUME ${i + 1}:\n${r.slice(0, 1000)}\n`).join("\n---\n")}

Return a JSON array ranked by strength:
[
  {
    "rank": <1 = strongest>,
    "resumeIndex": <0-based index>,
    "overallScore": <0-100>,
    "topStrength": "<single strongest quality>",
    "criticalWeakness": "<most important improvement needed>",
    "recommendation": "<one specific action to take>"
  }
]`;
}

module.exports = {
  buildResumeAnalysisPrompt,
  buildSkillRecommendationPrompt,
  buildInterviewQuestionsPrompt,
  buildAnswerEvaluationPrompt,
  buildChatSystemPrompt,
  buildJobMatchPrompt,
  buildProfessionalSummaryPrompt,
  buildSkillGapPrompt,
  buildBatchAnalysisPrompt,
  addJsonInstruction,
};