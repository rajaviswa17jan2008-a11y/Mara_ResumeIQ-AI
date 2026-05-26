import { aiAxios } from "./api";

// ─── AI Engine API ────────────────────────────────────────────────────

export const aiAPI = {

  // Full Resume Analysis
  fullAnalysis: (resumeText, targetRole = "") =>
    aiAxios.post("/analysis/full", {
      resumeText,
      targetRole,
    }),

  // Resume Feedback
  getResumeFeedback: (resumeText, targetRole = "") =>
    aiAxios.post("/analysis/feedback", {
      resumeText,
      targetRole,
    }),

  // ATS Score
  getATSScore: (resumeText) =>
    aiAxios.post("/analysis/ats-score", {
      resumeText,
    }),

  // Skill Extraction
  extractSkills: (resumeText) =>
    aiAxios.post("/skills/extract", {
      resumeText,
    }),

  // Skill Recommendations
  getSkillRecommendations: (
    resumeText,
    targetRole = ""
  ) =>
    aiAxios.post("/analysis/skills", {
      resumeText,
      targetRole,
    }),

  // Professional Summary
  generateSummary: (experience, skills = []) =>
    aiAxios.post("/analysis/summary", {
      experience,
      skills,
    }),

  // Job Matching
  getJobMatches: (
    resumeText,
    targetRole = ""
  ) =>
    aiAxios.post("/jobs/match", {
      resumeText,
      targetRole,
    }),

  // Career Chatbot
  chat: (message) =>
    aiAxios.post("/chatbot/message", {
      message,
    }),

  // Interview Questions
  generateInterviewQuestions: (
    role,
    level = "Intermediate"
  ) =>
    aiAxios.post("/interview/questions", {
      role,
      level,
    }),

  // Resume Rewrite Suggestions
  getRewriteSuggestion: (
    section,
    content
  ) =>
    aiAxios.post("/resume/rewrite", {
      section,
      content,
    }),

  // Keyword Analysis
  analyzeKeywords: (
    resumeText,
    jobDescription
  ) =>
    aiAxios.post("/resume/keywords", {
      resumeText,
      jobDescription,
    }),

  // Compare Resume With Job
  compareWithJob: (
    resumeText,
    jobDescription
  ) =>
    aiAxios.post("/resume/compare-job", {
      resumeText,
      jobDescription,
    }),

  // Cover Letter Generation
  generateCoverLetter: (data) =>
    aiAxios.post("/resume/cover-letter", data),

  // LinkedIn Optimization
  optimizeLinkedIn: (profileData) =>
    aiAxios.post("/resume/linkedin", profileData),

  // Salary Insights
  getSalaryInsights: (
    role,
    location
  ) =>
    aiAxios.post("/career/salary", {
      role,
      location,
    }),

};

export default aiAPI;