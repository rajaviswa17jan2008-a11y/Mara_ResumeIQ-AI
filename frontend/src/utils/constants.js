export const API_ENDPOINTS = {
  AUTH: { LOGIN: "/auth/login", REGISTER: "/auth/register", ME: "/auth/me", REFRESH: "/auth/refresh" },
  RESUME: { UPLOAD: "/resume/upload", LIST: "/resume/list", ANALYSIS: (id) => `/resume/analysis/${id}`, DELETE: (id) => `/resume/${id}`, BUILDER_SAVE: "/resume/builder/save", BUILDER_EXPORT: "/resume/builder/export" },
  AI: { CHATBOT: "/ai/chatbot", INTERVIEW_GENERATE: "/ai/interview/generate", INTERVIEW_FEEDBACK: "/ai/interview/feedback", SKILL_RECS: "/ai/skills/recommend", JOB_MATCH: "/ai/jobs/match", GENERATE_SUMMARY: "/ai/generate-summary" },
  USER: { PROFILE: "/users/profile", PASSWORD: "/users/password" },
  ADMIN: { USERS: "/admin/users", STATS: "/admin/stats" },
};

export const PLANS = {
  FREE: { id: "free", name: "Free", price: 0, features: ["3 Resume Scans/mo", "Basic ATS Score", "Job Board"] },
  PRO: { id: "pro", name: "Pro", price: 19, features: ["Unlimited Scans", "AI Skill Coach", "Interview Prep", "Career Chatbot"] },
  ENTERPRISE: { id: "enterprise", name: "Enterprise", price: 49, features: ["Everything in Pro", "Team Analytics", "API Access", "Priority Support"] },
};

export const RESUME_ACCEPTED_TYPES = { "application/pdf": [".pdf"], "application/msword": [".doc"], "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"] };
export const MAX_RESUME_SIZE = 10 * 1024 * 1024; // 10MB