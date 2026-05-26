const { logger } = require("./logger");

function safeParseJSON(raw, fallback = null) {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {}

  try {
    const stripped = raw
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .trim();
    return JSON.parse(stripped);
  } catch {}

  try {
    const firstBrace = raw.search(/[{[]/);
    const lastBrace = Math.max(raw.lastIndexOf("}"), raw.lastIndexOf("]"));
    if (firstBrace !== -1 && lastBrace !== -1) {
      const extracted = raw.slice(firstBrace, lastBrace + 1);
      return JSON.parse(extracted);
    }
  } catch {}

  logger.warn("Failed to parse JSON response:", raw?.slice(0, 200));
  return fallback;
}

function ensureArray(data) {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const keys = Object.keys(data);
    const arrKey = keys.find(k => Array.isArray(data[k]));
    if (arrKey) return data[arrKey];
  }
  return [];
}

function ensureObject(data, defaults = {}) {
  if (data && typeof data === "object" && !Array.isArray(data)) return { ...defaults, ...data };
  return defaults;
}

module.exports = { safeParseJSON, ensureArray, ensureObject };