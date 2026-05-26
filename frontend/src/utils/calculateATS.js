/**
 * ATS Score Calculator
 * Calculates ATS compatibility score based on multiple factors
 */
 
const calculateATSScore = (parsedData, jobDescription = "", targetRole = "") => {
  const scores = {};
  const issues = [];
 
  // 1. Formatting Score (20%)
  scores.formatting = calculateFormattingScore(parsedData, issues);
 
  // 2. Keywords Score (25%)
  scores.keywords = calculateKeywordScore(parsedData, jobDescription, targetRole, issues);
 
  // 3. Experience Score (20%)
  scores.experience = calculateExperienceScore(parsedData, issues);
 
  // 4. Education Score (15%)
  scores.education = calculateEducationScore(parsedData, issues);
 
  // 5. Skills Score (15%)
  scores.skills = calculateSkillsScore(parsedData, issues);
 
  // 6. Readability Score (5%)
  scores.readability = calculateReadabilityScore(parsedData, issues);
 
  // Weighted ATS Score
  const atsScore = Math.round(
    scores.formatting * 0.20 +
    scores.keywords * 0.25 +
    scores.experience * 0.20 +
    scores.education * 0.15 +
    scores.skills * 0.15 +
    scores.readability * 0.05
  );
 
  return {
    atsScore: Math.min(100, Math.max(0, atsScore)),
    scores,
    formattingIssues: issues,
  };
};
 
const calculateFormattingScore = (data, issues) => {
  let score = 100;
 
  if (!data.email || data.email === "") {
    score -= 20;
    issues.push({ issue: "Missing email address", severity: "critical", fix: "Add a professional email address to your contact section" });
  }
  if (!data.phone || data.phone === "") {
    score -= 10;
    issues.push({ issue: "Missing phone number", severity: "high", fix: "Add a phone number to your contact section" });
  }
  if (!data.name || data.name === "") {
    score -= 25;
    issues.push({ issue: "Name not detected", severity: "critical", fix: "Ensure your full name is clearly visible at the top of your resume" });
  }
  if (!data.summary || data.summary.length < 50) {
    score -= 10;
    issues.push({ issue: "Missing or too short professional summary", severity: "medium", fix: "Add a 2-3 sentence professional summary highlighting your value proposition" });
  }
  if (!data.location || data.location === "") {
    score -= 5;
    issues.push({ issue: "Missing location", severity: "low", fix: "Add your city and state/country" });
  }
 
  return Math.max(0, score);
};
 
const calculateKeywordScore = (data, jobDescription, targetRole, issues) => {
  if (!jobDescription && !targetRole) return 65;
 
  const resumeText = [
    ...(data.skills || []),
    data.summary || "",
    ...(data.experience || []).map((e) => `${e.title} ${e.description} ${(e.technologies || []).join(" ")}`),
    ...(data.projects || []).map((p) => `${p.description} ${(p.technologies || []).join(" ")}`),
  ]
    .join(" ")
    .toLowerCase();
 
  const jdWords = (jobDescription + " " + targetRole)
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 3);
 
  const uniqueJDWords = [...new Set(jdWords)];
  const matchedWords = uniqueJDWords.filter((w) => resumeText.includes(w));
  const matchRate = uniqueJDWords.length > 0 ? matchedWords.length / uniqueJDWords.length : 0.65;
 
  if (matchRate < 0.4) {
    issues.push({ issue: "Low keyword match with job description", severity: "critical", fix: "Tailor your resume keywords to match the job description more closely" });
  }
 
  return Math.round(matchRate * 100);
};
 
const calculateExperienceScore = (data, issues) => {
  const experience = data.experience || [];
  if (experience.length === 0) {
    issues.push({ issue: "No work experience detected", severity: "high", fix: "Add work experience, internships, or relevant projects" });
    return 30;
  }
 
  let score = 70;
  experience.forEach((exp) => {
    if (exp.description && exp.description.length > 100) score += 5;
    if (exp.technologies && exp.technologies.length > 0) score += 3;
    if (exp.title) score += 2;
  });
 
  const hasQuantifiableAchievements = experience.some(
    (e) => e.description && /\d+%|\d+ (users|clients|projects|team|revenue|sales)/i.test(e.description)
  );
  if (!hasQuantifiableAchievements) {
    issues.push({ issue: "No quantifiable achievements found", severity: "medium", fix: "Add metrics like 'Increased sales by 30%' or 'Managed team of 10'" });
    score -= 10;
  }
 
  return Math.min(100, Math.max(0, score));
};
 
const calculateEducationScore = (data, issues) => {
  const education = data.education || [];
  if (education.length === 0) {
    issues.push({ issue: "No education section detected", severity: "medium", fix: "Add your educational background including degree, institution, and year" });
    return 50;
  }
  return Math.min(100, 70 + education.length * 10);
};
 
const calculateSkillsScore = (data, issues) => {
  const skills = data.skills || [];
  if (skills.length === 0) {
    issues.push({ issue: "No skills section detected", severity: "high", fix: "Add a dedicated skills section with your technical and soft skills" });
    return 20;
  }
  if (skills.length < 5) {
    issues.push({ issue: "Too few skills listed", severity: "medium", fix: "Expand your skills section to include at least 8-12 relevant skills" });
    return 55;
  }
  return Math.min(100, 60 + skills.length * 2);
};
 
const calculateReadabilityScore = (data, issues) => {
  const text = data.summary || "";
  if (!text) return 60;
 
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const avgWordsPerSentence = words.length / Math.max(sentences.length, 1);
 
  if (avgWordsPerSentence > 25) {
    issues.push({ issue: "Long sentences detected in summary", severity: "low", fix: "Break long sentences into shorter, impactful statements" });
    return 70;
  }
  return 90;
};
 
module.exports = { calculateATSScore };