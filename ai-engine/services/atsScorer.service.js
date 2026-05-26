const { extractSkillsFromText } = require("./skillExtractor.service");

const ATS_KEYWORDS = {
  action_verbs: ["achieved", "built", "created", "delivered", "designed", "developed", "engineered", "established", "improved", "increased", "launched", "led", "managed", "optimized", "reduced", "scaled", "shipped", "streamlined"],
  quantifiers: [/\d+%/, /\$\d+/, /\d+x/, /\d+k/, /\d+ (users|customers|clients|projects|team)/i],
  sections_required: ["contact", "experience", "education", "skills"],
  format_issues: [/(.{150,})/, /[^\x00-\x7F]/],
};

function scoreActionVerbs(text) {
  const lowerText = text.toLowerCase();
  const found = ATS_KEYWORDS.action_verbs.filter(v => lowerText.includes(v));
  return { found, score: Math.min(100, Math.round((found.length / 10) * 100)) };
}

function scoreQuantifiedAchievements(text) {
  const found = ATS_KEYWORDS.quantifiers.filter(r => r.test(text));
  return { count: found.length, score: Math.min(100, found.length * 15) };
}

function scoreSectionPresence(sections) {
  const present = ATS_KEYWORDS.sections_required.filter(s => sections[s]?.length > 0);
  return { present, missing: ATS_KEYWORDS.sections_required.filter(s => !sections[s]?.length), score: Math.round((present.length / ATS_KEYWORDS.sections_required.length) * 100) };
}

function scoreKeywordDensity(text, targetKeywords = []) {
  if (!targetKeywords.length) return { score: 70, found: [], missing: [] };
  const lowerText = text.toLowerCase();
  const found = targetKeywords.filter(k => lowerText.includes(k.toLowerCase()));
  return { found, missing: targetKeywords.filter(k => !found.includes(k)), score: Math.round((found.length / targetKeywords.length) * 100) };
}

function scoreReadability(text) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(Boolean);
  if (!sentences.length || !words.length) return 50;
  const avgWordsPerSentence = words.length / sentences.length;
  const hasLongLines = text.split("\n").some(l => l.length > 120);
  let score = 100;
  if (avgWordsPerSentence > 25) score -= 15;
  if (avgWordsPerSentence > 35) score -= 15;
  if (hasLongLines) score -= 10;
  return Math.max(0, score);
}

function scoreFormat(sections, rawText) {
  let score = 100;
  const issues = [];
  if (!sections.contact?.length) { score -= 20; issues.push("Missing contact information"); }
  if (!sections.summary?.length) { score -= 10; issues.push("No professional summary"); }
  const wordCount = rawText.split(/\s+/).length;
  if (wordCount < 200) { score -= 20; issues.push("Resume too short (under 200 words)"); }
  if (wordCount > 1200) { score -= 10; issues.push("Resume too long (over 1200 words)"); }
  return { score: Math.max(0, score), issues };
}

function calculateATSScore(parsedResume, targetKeywords = []) {
  const { rawText, sections } = parsedResume;
  const actionVerbScore = scoreActionVerbs(rawText);
  const quantScore = scoreQuantifiedAchievements(rawText);
  const sectionScore = scoreSectionPresence(sections);
  const keywordScore = scoreKeywordDensity(rawText, targetKeywords);
  const readabilityScore = scoreReadability(rawText);
  const formatScore = scoreFormat(sections, rawText);

  const weights = { actionVerbs: 0.15, quantified: 0.20, sections: 0.20, keywords: 0.25, readability: 0.10, format: 0.10 };

  const overall = Math.round(
    actionVerbScore.score * weights.actionVerbs +
    quantScore.score * weights.quantified +
    sectionScore.score * weights.sections +
    keywordScore.score * weights.keywords +
    readabilityScore * weights.readability +
    formatScore.score * weights.format
  );

  return {
    overall: Math.min(100, overall),
    breakdown: {
      actionVerbs: { score: actionVerbScore.score, found: actionVerbScore.found },
      quantifiedAchievements: { score: quantScore.score, count: quantScore.count },
      sectionPresence: { score: sectionScore.score, missing: sectionScore.missing },
      keywords: { score: keywordScore.score, found: keywordScore.found, missing: keywordScore.missing },
      readability: { score: readabilityScore },
      format: { score: formatScore.score, issues: formatScore.issues },
    }
  };
}

module.exports = { calculateATSScore, scoreActionVerbs, scoreQuantifiedAchievements, scoreSectionPresence };