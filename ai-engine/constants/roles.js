const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
  MODERATOR: "moderator",
};

const SUBSCRIPTION_PLANS = {
  FREE: "free",
  PRO: "pro",
  ENTERPRISE: "enterprise",
};

const PLAN_LIMITS = {
  [SUBSCRIPTION_PLANS.FREE]: {
    resumeScansPerMonth: 3,
    jobMatchesPerDay: 10,
    chatMessagesPerDay: 20,
    interviewQuestionsPerDay: 5,
    builderTemplates: 1,
    storageGb: 0.1,
    aiAnalysisPerMonth: 3,
    features: ["basic_ats_score", "skill_extraction", "job_board"],
  },
  [SUBSCRIPTION_PLANS.PRO]: {
    resumeScansPerMonth: -1,
    jobMatchesPerDay: -1,
    chatMessagesPerDay: 200,
    interviewQuestionsPerDay: 50,
    builderTemplates: 10,
    storageGb: 5,
    aiAnalysisPerMonth: -1,
    features: ["basic_ats_score", "skill_extraction", "job_board", "ai_chatbot", "interview_prep", "skill_recommendations", "detailed_feedback", "resume_builder"],
  },
  [SUBSCRIPTION_PLANS.ENTERPRISE]: {
    resumeScansPerMonth: -1,
    jobMatchesPerDay: -1,
    chatMessagesPerDay: -1,
    interviewQuestionsPerDay: -1,
    builderTemplates: -1,
    storageGb: 50,
    aiAnalysisPerMonth: -1,
    features: ["all"],
  },
};

const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: [
    "view_all_users", "manage_users", "view_analytics", "manage_subscriptions",
    "access_admin_panel", "delete_any_resume", "ban_users", "export_data",
    "manage_ai_settings",
  ],
  [USER_ROLES.MODERATOR]: [
    "view_flagged_content", "manage_reports", "view_basic_analytics",
  ],
  [USER_ROLES.USER]: [
    "upload_resume", "view_own_resumes", "run_analysis", "access_chatbot",
    "view_job_matches", "manage_own_profile",
  ],
};

const JOB_CATEGORIES = [
  "Software Engineering", "Frontend Development", "Backend Development",
  "Full Stack Development", "DevOps / SRE", "Data Science", "Machine Learning",
  "Mobile Development", "Cloud Architecture", "Security Engineering",
  "Product Management", "UX / Design", "QA / Testing", "Blockchain",
  "Embedded Systems", "Game Development",
];

const EXPERIENCE_LEVELS = {
  JUNIOR: "0-1 years",
  MID: "1-3 years",
  SENIOR: "3-5 years",
  LEAD: "5-10 years",
  PRINCIPAL: "10+ years",
};

const ANALYSIS_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
  CACHED: "cached",
};

const AI_PROVIDERS = {
  OPENAI: "openai",
  GEMINI: "gemini",
};

const RESUME_FORMATS = {
  PDF: "pdf",
  DOCX: "docx",
  DOC: "doc",
};

module.exports = {
  USER_ROLES,
  SUBSCRIPTION_PLANS,
  PLAN_LIMITS,
  ROLE_PERMISSIONS,
  JOB_CATEGORIES,
  EXPERIENCE_LEVELS,
  ANALYSIS_STATUS,
  AI_PROVIDERS,
  RESUME_FORMATS,
};