const { STATUS } = require("../constants/statusCodes");

function successResponse(data, meta = {}) {
  return {
    success: true,
    timestamp: new Date().toISOString(),
    ...(Object.keys(meta).length > 0 && { meta }),
    data,
  };
}

function errorResponse(message, code = "INTERNAL_ERROR", details = null) {
  return {
    success: false,
    timestamp: new Date().toISOString(),
    message,
    code,
    ...(details && { details }),
  };
}

function paginatedResponse(data, { page, limit, total }) {
  const totalPages = Math.ceil(total / limit);
  return {
    success: true,
    timestamp: new Date().toISOString(),
    meta: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    data,
  };
}

function send(res, data, statusCode = STATUS.OK, meta = {}) {
  res.status(statusCode).json(successResponse(data, meta));
}

function sendError(res, message, statusCode = STATUS.INTERNAL_SERVER_ERROR, code = "INTERNAL_ERROR", details = null) {
  res.status(statusCode).json(errorResponse(message, code, details));
}

function sendPaginated(res, data, pagination) {
  res.status(STATUS.OK).json(paginatedResponse(data, pagination));
}

function sendCreated(res, data, meta = {}) {
  res.status(STATUS.CREATED).json(successResponse(data, meta));
}

function sendNoContent(res) {
  res.status(STATUS.NO_CONTENT).end();
}

function sendCached(res, data, meta = {}) {
  res.status(STATUS.OK).json({
    ...successResponse(data, meta),
    cached: true,
  });
}

function formatValidationErrors(errors = []) {
  return errors.map((e) => ({
    field: e.field || e.path || e.param,
    message: e.message || e.msg,
    ...(e.value !== undefined && { received: e.value }),
  }));
}

function formatAIAnalysisResponse(raw) {
  const defaults = {
    overallScore: 0,
    readabilityScore: 0,
    keywordScore: 0,
    formatScore: 0,
    strengths: [],
    weaknesses: [],
    suggestions: [],
    keywords: { found: [], missing: [] },
    sections: [],
    summary: "Analysis unavailable.",
  };

  if (!raw || typeof raw !== "object") return defaults;

  return {
    overallScore: clamp(raw.overallScore, 0, 100),
    readabilityScore: clamp(raw.readabilityScore, 0, 100),
    keywordScore: clamp(raw.keywordScore, 0, 100),
    formatScore: clamp(raw.formatScore, 0, 100),
    strengths: sanitizeArray(raw.strengths),
    weaknesses: sanitizeArray(raw.weaknesses),
    suggestions: sanitizeArray(raw.suggestions).map((s) => ({
      priority: ["high", "medium", "low"].includes(s.priority) ? s.priority : "medium",
      text: typeof s.text === "string" ? s.text : String(s),
    })),
    keywords: {
      found: sanitizeArray(raw.keywords?.found),
      missing: sanitizeArray(raw.keywords?.missing),
    },
    sections: sanitizeArray(raw.sections).map((s) => ({
      name: s.name || "Unknown",
      score: clamp(s.score, 0, 100),
      status: ["excellent", "good", "average", "poor"].includes(s.status) ? s.status : "average",
    })),
    summary: typeof raw.summary === "string" ? raw.summary : defaults.summary,
  };
}

function formatSkillRecommendations(raw = []) {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => ({
    name: item.name || "Unknown Skill",
    demand: clamp(item.demand ?? 60, 0, 100),
    salary: typeof item.salary === "string" ? item.salary : "+$0",
    time: typeof item.time === "string" ? item.time : "Unknown",
    priority: ["high", "medium", "low"].includes(item.priority) ? item.priority : "medium",
    category: item.category || "General",
    reason: item.reason || "",
    resources: sanitizeArray(item.resources),
  }));
}

function formatInterviewQuestions(raw = []) {
  if (!Array.isArray(raw)) return [];
  const validCategories = ["Behavioral", "Technical", "System Design", "HR", "Situational"];
  const validDifficulties = ["Easy", "Medium", "Hard"];
  return raw.map((q, i) => ({
    id: q.id || i + 1,
    question: q.question || "",
    category: validCategories.includes(q.category) ? q.category : "Behavioral",
    difficulty: validDifficulties.includes(q.difficulty) ? q.difficulty : "Medium",
    tip: q.tip || "",
    keywords: sanitizeArray(q.keywords),
  }));
}

function formatAnswerEvaluation(raw = {}) {
  const defaults = {
    score: 50,
    grade: "Average",
    strengths: [],
    improvements: [],
    missedKeyPoints: [],
    sampleAnswer: "",
    followUpQuestions: [],
  };
  if (!raw || typeof raw !== "object") return defaults;
  return {
    score: clamp(raw.score ?? 50, 0, 100),
    grade: ["Excellent", "Good", "Average", "Poor"].includes(raw.grade) ? raw.grade : "Average",
    strengths: sanitizeArray(raw.strengths),
    improvements: sanitizeArray(raw.improvements),
    missedKeyPoints: sanitizeArray(raw.missedKeyPoints),
    sampleAnswer: typeof raw.sampleAnswer === "string" ? raw.sampleAnswer : "",
    followUpQuestions: sanitizeArray(raw.followUpQuestions),
  };
}

function clamp(val, min, max) {
  const num = Number(val);
  if (isNaN(num)) return min;
  return Math.min(max, Math.max(min, Math.round(num)));
}

function sanitizeArray(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.filter((item) => item !== null && item !== undefined);
}

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse,
  send,
  sendError,
  sendPaginated,
  sendCreated,
  sendNoContent,
  sendCached,
  formatValidationErrors,
  formatAIAnalysisResponse,
  formatSkillRecommendations,
  formatInterviewQuestions,
  formatAnswerEvaluation,
  clamp,
  sanitizeArray,
};