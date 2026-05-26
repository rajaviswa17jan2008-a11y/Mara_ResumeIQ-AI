const { logger } = require("../utils/logger");

// Character-based approximation constants (matches GPT-4 tokenization closely)
const CHARS_PER_TOKEN = 4;
const WORDS_PER_TOKEN = 0.75;

// Per-model context limits (input tokens)
const MODEL_LIMITS = {
  "gpt-4-turbo-preview": 128000,
  "gpt-4": 8192,
  "gpt-4-32k": 32768,
  "gpt-3.5-turbo": 16385,
  "gpt-3.5-turbo-16k": 16385,
  "gemini-1.5-pro": 1048576,
  "gemini-1.5-flash": 1048576,
  "gemini-pro": 32768,
  "text-embedding-3-small": 8191,
  "text-embedding-3-large": 8191,
  default: 8192,
};

// Safe output budget (tokens reserved for model response)
const OUTPUT_RESERVE = {
  "gpt-4-turbo-preview": 4096,
  "gpt-4": 2048,
  "gpt-3.5-turbo": 2048,
  "gemini-1.5-pro": 8192,
  default: 2000,
};

function estimateTokens(text) {
  if (!text || typeof text !== "string") return 0;
  const byChars = Math.ceil(text.length / CHARS_PER_TOKEN);
  const byWords = Math.ceil(text.split(/\s+/).filter(Boolean).length / WORDS_PER_TOKEN);
  return Math.round((byChars + byWords) / 2);
}

function estimateMessagesTokens(messages = []) {
  if (!Array.isArray(messages)) return 0;
  return messages.reduce((total, msg) => {
    const roleTokens = 4; // overhead per message
    const contentTokens = estimateTokens(msg.content || "");
    return total + roleTokens + contentTokens;
  }, 3); // 3 tokens for priming
}

function getModelLimit(model = "default") {
  return MODEL_LIMITS[model] || MODEL_LIMITS.default;
}

function getOutputReserve(model = "default") {
  return OUTPUT_RESERVE[model] || OUTPUT_RESERVE.default;
}

function getAvailableInputTokens(model = "default", reservedOutputTokens = null) {
  const limit = getModelLimit(model);
  const reserve = reservedOutputTokens ?? getOutputReserve(model);
  return limit - reserve - 200; // 200 buffer for system/formatting
}

function truncateToTokenLimit(text, maxTokens = 4000) {
  if (!text) return "";
  const estimated = estimateTokens(text);
  if (estimated <= maxTokens) return text;

  const targetChars = maxTokens * CHARS_PER_TOKEN;
  const truncated = text.slice(0, targetChars);

  // Try to truncate at a sentence boundary
  const lastPeriod = truncated.lastIndexOf(".");
  const lastNewline = truncated.lastIndexOf("\n");
  const breakPoint = Math.max(lastPeriod, lastNewline);

  if (breakPoint > targetChars * 0.7) {
    logger.debug(`Text truncated from ~${estimated} to ~${maxTokens} tokens`);
    return truncated.slice(0, breakPoint + 1);
  }

  logger.debug(`Text truncated from ~${estimated} to ~${maxTokens} tokens`);
  return truncated;
}

function willExceedLimit(messages = [], model = "default") {
  const used = estimateMessagesTokens(messages);
  const limit = getAvailableInputTokens(model);
  return { exceeds: used > limit, used, limit, remaining: limit - used };
}

function trimConversationHistory(history = [], systemPrompt = "", model = "default", preserveLast = 6) {
  if (!Array.isArray(history) || history.length === 0) return [];

  const systemTokens = estimateTokens(systemPrompt);
  const available = getAvailableInputTokens(model) - systemTokens - 500;

  // Always keep the last N messages
  const mustKeep = history.slice(-preserveLast);
  const mustKeepTokens = estimateMessagesTokens(mustKeep);

  if (mustKeepTokens >= available) {
    return mustKeep.slice(-Math.max(2, preserveLast - 2));
  }

  // Add older messages until budget is exhausted
  const olderHistory = history.slice(0, -preserveLast);
  const result = [];
  let usedTokens = mustKeepTokens;

  for (let i = olderHistory.length - 1; i >= 0; i--) {
    const msgTokens = estimateTokens(olderHistory[i].content || "") + 4;
    if (usedTokens + msgTokens > available) break;
    result.unshift(olderHistory[i]);
    usedTokens += msgTokens;
  }

  return [...result, ...mustKeep];
}

function estimateCost(tokens, model = "gpt-4-turbo-preview", type = "input") {
  const pricing = {
    "gpt-4-turbo-preview": { input: 0.01 / 1000, output: 0.03 / 1000 },
    "gpt-4": { input: 0.03 / 1000, output: 0.06 / 1000 },
    "gpt-3.5-turbo": { input: 0.0005 / 1000, output: 0.0015 / 1000 },
    "text-embedding-3-small": { input: 0.00002 / 1000, output: 0 },
    "gemini-1.5-pro": { input: 0.00125 / 1000, output: 0.005 / 1000 },
    default: { input: 0.01 / 1000, output: 0.03 / 1000 },
  };

  const rates = pricing[model] || pricing.default;
  const rate = type === "output" ? rates.output : rates.input;
  return tokens * rate;
}

function buildTokenReport(messages = [], model = "default") {
  const inputTokens = estimateMessagesTokens(messages);
  const { exceeds, limit, remaining } = willExceedLimit(messages, model);
  return {
    model,
    estimatedInputTokens: inputTokens,
    contextLimit: getModelLimit(model),
    availableInputLimit: limit,
    remainingTokens: remaining,
    willExceedLimit: exceeds,
    estimatedInputCost: `$${estimateCost(inputTokens, model, "input").toFixed(6)}`,
    utilizationPercent: Math.round((inputTokens / limit) * 100),
  };
}

module.exports = {
  estimateTokens,
  estimateMessagesTokens,
  getModelLimit,
  getAvailableInputTokens,
  truncateToTokenLimit,
  willExceedLimit,
  trimConversationHistory,
  estimateCost,
  buildTokenReport,
  MODEL_LIMITS,
};