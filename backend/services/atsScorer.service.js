const ACTION_VERBS = [
  "achieved","architected","automated","built","collaborated","created","debugged","delivered",
  "deployed","designed","developed","drove","engineered","established","executed","expanded",
  "generated","implemented","improved","increased","launched","led","managed","mentored",
  "migrated","optimized","orchestrated","reduced","refactored","scaled","shipped","solved",
  "spearheaded","streamlined","transformed","upgraded",
];

const QUANTIFIER_PATTERNS = [
  /\d+\s*%/,/\$\s*\d+[kKmMbB]?/,/\d+[xX]\s/,/\d+k\b/i,
  /\d+\s+(?:users|customers|clients|projects|engineers|developers|team\s+members|services|APIs|endpoints)/i,
  /\d+\s+(?:million|thousand|billion)/i,
  /(?:increased|decreased|reduced|improved|grew|saved)\s+(?:by\s+)?\d+/i,
];

const REQUIRED_SECTIONS = ["contact","experience","education","skills"];
const IMPORTANT_SECTIONS = ["summary","projects","certifications"];

function scoreActionVerbs(text) {
  const lower = text.toLowerCase();
  const found = ACTION_VERBS.filter(v => {
    const regex = new RegExp(`\\b${v}(?:d|ed|s|ing)?\\b`, "i");
    return regex.test(lower);
  });
  return { found, score: Math.min(100, Math.round((found.length / 8) * 100)) };
}

function scoreQuantifiedAchievements(text) {
  const found = QUANTIFIER_PATTERNS.filter(r => r.test(text));
  return { count: found.length, score: Math.min(100, found.length * 14) };
}

function scoreSectionPresence(sections) {
  const present = REQUIRED_SECTIONS.filter(s => sections[s]?.length > 0);
  const optional = IMPORTANT_SECTIONS.filter(s => sections[s]?.length > 0);
  const baseScore = Math.round((present.length / REQUIRED_SECTIONS.length) * 85);
  const bonus = Math.min(15, optional.length * 5);
  return {
    present,
    missing: REQUIRED_SECTIONS.filter(s => !sections[s]?.length),
    score: Math.min(100, baseScore + bonus),
  };
}

function scoreKeywordDensity(text, targetKeywords = []) {
  if (!targetKeywords.length) return { score: 68, found: [], missing: [] };
  const lower = text.toLowerCase();
  const found = targetKeywords.filter(k => lower.includes(k.toLowerCase()));
  return {
    found,
    missing: targetKeywords.filter(k => !found.includes(k)),
    score: Math.round((found.length / targetKeywords.length) * 100),
  };
}

function scoreReadability(text) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const words = text.split(/\s+/).filter(Boolean);
  if (!sentences.length) return 50;

  const avgWords = words.length / sentences.length;
  const longLines = text.split("\n").filter(l => l.length > 130).length;
  const bulletPoints = (text.match(/^[\s]*[•\-\*◦▸▹►]/gm) || []).length;

  let score = 100;
  if (avgWords > 30) score -= 20;
  else if (avgWords > 22) score -= 10;
  if (longLines > 5) score -= 10;
  if (bulletPoints < 5) score -= 10;
  return Math.max(30, score);
}

function scoreFormatQuality(sections, rawText) {
  const wordCount = rawText.split(/\s+/).filter(Boolean).length;
  const issues = [];
  let score = 100;

  if (!sections.contact?.length) { score -= 25; issues.push("Missing contact information section"); }
  if (!sections.summary?.length) { score -= 10; issues.push("No professional summary — highly recommended"); }
  if (wordCount < 150) { score -= 25; issues.push("Resume too short (under 150 words)"); }
  if (wordCount > 1400) { score -= 10; issues.push("Resume may be too long (over 1400 words)"); }
  if (!sections.skills?.length) { score -= 15; issues.push("No dedicated skills section"); }

  const hasEmail = sections.contact?.some(l => /@/.test(l)) || /@/.test(rawText.slice(0, 300));
  if (!hasEmail) { score -= 10; issues.push("No email address found"); }

  return { score: Math.max(0, score), issues };
}

function calculateATSScore(parsedResume, targetKeywords = []) {
  const { rawText, sections } = parsedResume;

  const actionVerbResult = scoreActionVerbs(rawText);
  const quantResult = scoreQuantifiedAchievements(rawText);
  const sectionResult = scoreSectionPresence(sections);
  const keywordResult = scoreKeywordDensity(rawText, targetKeywords);
  const readabilityResult = scoreReadability(rawText);
  const formatResult = scoreFormatQuality(sections, rawText);

  const weights = {
    actionVerbs: 0.12,
    quantified: 0.20,
    sections: 0.18,
    keywords: 0.25,
    readability: 0.10,
    format: 0.15,
  };

  const overall = Math.round(
    actionVerbResult.score * weights.actionVerbs +
    quantResult.score * weights.quantified +
    sectionResult.score * weights.sections +
    keywordResult.score * weights.keywords +
    readabilityResult * weights.readability +
    formatResult.score * weights.format
  );

  return {
    overall: Math.min(100, Math.max(0, overall)),
    breakdown: {
      actionVerbs: { score: actionVerbResult.score, found: actionVerbResult.found },
      quantifiedAchievements: { score: quantResult.score, count: quantResult.count },
      sectionPresence: { score: sectionResult.score, missing: sectionResult.missing },
      keywords: { score: keywordResult.score, found: keywordResult.found, missing: keywordResult.missing },
      readability: { score: readabilityResult },
      format: { score: formatResult.score, issues: formatResult.issues },
    },
  };
}

module.exports = {
  calculateATSScore,
  scoreActionVerbs,
  scoreQuantifiedAchievements,
  scoreSectionPresence,
  scoreKeywordDensity,
};