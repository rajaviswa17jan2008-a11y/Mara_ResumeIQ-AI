/**
 * Portfolio Data Parser & Normalizer
 * Cleans and validates AI-extracted portfolio data before rendering.
 * Place this file at: backend/utils/portfolioParser.js
 */

const { v4: uuidv4 } = require("uuid");

// ──────────────────────────────────────────────
// Default fallback values
// ──────────────────────────────────────────────
const DEFAULTS = {
  primaryColor: "#00ffff",
  accentColor: "#7b2fff",
  name: "Professional",

  title: "Software Professional",
  tagline: "Building the future, one line of code at a time.",
  bio: "A passionate professional dedicated to delivering high-quality solutions.",
};

/**
 * Normalizes and sanitizes AI-extracted portfolio data.
 * Ensures all required fields exist and are correctly typed.
 * @param {Object} raw - Raw AI output
 * @returns {Object}   - Normalized portfolio data
 */
const normalizePortfolioData = (raw) => {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid portfolio data received from AI");
  }

  return {
    personal: normalizePersonal(raw.personal || {}),
    skills: normalizeSkills(raw.skills || {}),
    experience: normalizeExperience(raw.experience || []),
    education: normalizeEducation(raw.education || []),
    projects: normalizeProjects(raw.projects || []),
    certifications: normalizeCertifications(raw.certifications || []),
    achievements: (raw.achievements || []).filter(Boolean).slice(0, 10),
    languages: (raw.languages || []).filter((l) => l?.language),
    meta: normalizeMeta(raw.meta || {}),
  };
};

// ──────────────────────────────────────────────
// Section normalizers
// ──────────────────────────────────────────────

const normalizePersonal = (p) => ({
  name: p.name || DEFAULTS.name,
  title: p.title || DEFAULTS.title,
  tagline: p.tagline || DEFAULTS.tagline,
  bio: p.bio || DEFAULTS.bio,
  email: p.email || "",
  phone: p.phone || "",
  location: p.location || "",
  website: p.website || "",
  linkedin: p.linkedin || "",
  github: p.github || "",
  twitter: p.twitter || "",
  // Generate avatar initials
  initials: (p.name || "P")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2),
});

const normalizeSkills = (s) => {
  const technical = (s.technical || [])
    .filter((skill) => skill?.name)
    .map((skill) => ({
      name: String(skill.name),
      level: Math.min(100, Math.max(1, Number(skill.level) || 75)),
      category: skill.category || "other",
    }))
    .slice(0, 30);

  const featured =
    s.featured?.filter(Boolean).slice(0, 6) ||
    technical
      .slice(0, 6)
      .map((t) => t.name);

  return {
    technical,
    soft: (s.soft || []).filter(Boolean).slice(0, 10),
    featured,
  };
};

const normalizeExperience = (arr) =>
  arr
    .filter((e) => e?.company && e?.role)
    .map((e, i) => ({
      id: e.id || `exp_${i + 1}`,
      company: e.company,
      role: e.role,
      duration: e.duration || "",
      location: e.location || "",
      description: e.description || "",
      achievements: (e.achievements || []).filter(Boolean).slice(0, 6),
      technologies: (e.technologies || []).filter(Boolean).slice(0, 10),
      current: Boolean(e.current),
    }))
    .slice(0, 10);

const normalizeEducation = (arr) =>
  arr
    .filter((e) => e?.institution)
    .map((e, i) => ({
      id: e.id || `edu_${i + 1}`,
      institution: e.institution,
      degree: e.degree || "",
      field: e.field || "",
      duration: e.duration || "",
      grade: e.grade || "",
      achievements: (e.achievements || []).filter(Boolean),
    }))
    .slice(0, 5);

const normalizeProjects = (arr) =>
  arr
    .filter((p) => p?.name)
    .map((p, i) => ({
      id: p.id || `proj_${i + 1}`,
      name: p.name,
      description: p.description || "",
      impact: p.impact || "",
      technologies: (p.technologies || []).filter(Boolean).slice(0, 8),
      liveUrl: p.liveUrl || "",
      githubUrl: p.githubUrl || "",
      featured: Boolean(p.featured),
    }))
    .slice(0, 12);

const normalizeCertifications = (arr) =>
  arr
    .filter((c) => c?.name)
    .map((c) => ({
      name: c.name,
      issuer: c.issuer || "",
      year: c.year || "",
      url: c.url || "",
    }))
    .slice(0, 10);

const normalizeMeta = (m) => ({
  primaryColor: isValidHex(m.primaryColor)
    ? m.primaryColor
    : DEFAULTS.primaryColor,
  accentColor: isValidHex(m.accentColor) ? m.accentColor : DEFAULTS.accentColor,
  industry: m.industry || "Technology",
  experienceLevel: m.experienceLevel || "Mid",
  totalYearsExperience: Math.max(0, Number(m.totalYearsExperience) || 0),
  generatedAt: new Date().toISOString(),
  portfolioId: uuidv4(),
});

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

const isValidHex = (hex) =>
  typeof hex === "string" && /^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(hex);

/**
 * Groups technical skills by category for the skills display.
 * @param {Array} skills
 * @returns {Object}
 */
const groupSkillsByCategory = (skills) => {
  const groups = {};
  for (const skill of skills) {
    const cat = skill.category || "other";
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(skill);
  }
  return groups;
};

/**
 * Gets the top N featured projects.
 * @param {Array} projects
 * @param {number} n
 */
const getFeaturedProjects = (projects, n = 3) =>
  projects.filter((p) => p.featured).slice(0, n);

module.exports = {
  normalizePortfolioData,
  groupSkillsByCategory,
  getFeaturedProjects,
};