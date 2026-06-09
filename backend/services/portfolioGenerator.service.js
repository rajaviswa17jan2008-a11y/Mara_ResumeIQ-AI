/**
 * Portfolio Generator Service
 * Orchestrates AI extraction + normalization of portfolio data from resume.
 * Place at: backend/services/portfolioGenerator.service.js
 */

// ──────────────────────────────────────────────
// Color palette presets per scheme
// ──────────────────────────────────────────────
const COLOR_SCHEMES = {
  neon: { primaryColor: "#00ffff", accentColor: "#ff00ff" },
  purple: { primaryColor: "#7b2fff", accentColor: "#00ffcc" },
  gold: { primaryColor: "#f59e0b", accentColor: "#10b981" },
  blue: { primaryColor: "#3b82f6", accentColor: "#a78bfa" },
  green: { primaryColor: "#10b981", accentColor: "#06b6d4" },
  red: { primaryColor: "#ef4444", accentColor: "#f97316" },
};

/**
 * Main service: extracts portfolio data from resume text using AI,
 * optionally overrides colors, and returns a fully normalized data object.
 *
 * @param {string} resumeText   - Raw resume text
 * @param {string} colorScheme  - Optional color scheme key (e.g. "neon")
 * @returns {Promise<Object>}   - Normalized portfolio data
 */
const generatePortfolioData = async (
  formData,
  colorScheme = null
) => {

  let projects = [];

  try {
    projects =
      typeof formData.projects === "string"
        ? JSON.parse(formData.projects)
        : formData.projects || [];
  } catch {
    projects = [];
  }

 const skillsArray =
  formData.skills
    ? formData.skills
        .split(/[\n,]/)
        .map((s) =>
          s.replace("•", "").trim()
        )
        .filter(Boolean)
    : [];
     
  const portfolioData = {
    personal: {
      name: formData.name || "Portfolio User",
      title: formData.title || "Developer",
      bio: formData.bio || "",
aboutMe: formData.aboutMe || "",
      email: formData.email || "",
      phone: formData.phone || "",
      github: formData.github || "",
      linkedin: formData.linkedin || "",
      website: formData.website || "",
      image: formData.image || "",
      location: "",
    },

    skills: {
      featured: skillsArray.slice(0, 6),

      technical: skillsArray.map((skill) => ({
        name: skill,
        level: 80,
      })),
    },

    projects: projects.map((project) => ({
      name: project.name || "",
      description:
        project.description || "",
      technologies: project.tech
        ? project.tech
            .split(",")
            .map((t) => t.trim())
        : [],
      githubUrl:
        project.link || "",
      liveUrl:
        project.link || "",
    })),

    experience: [],

    education: [],

    certifications: [],

    achievements: [],

    meta: {
      industry: "Technology",
      experienceLevel: "Student",
      totalYearsExperience: 0,
      primaryColor: "#00ffff",
      accentColor: "#ff00ff",
    },

    copy: {
      heroHeadline:
        `Hi, I'm ${formData.name || "Developer"}`,

      heroSubheadline:
        formData.title ||
        "Full Stack Developer",

      aboutParagraph1:
  formData.aboutMe ||
  "Tell visitors about yourself...",

      aboutParagraph2:
        "",

      callToAction:
        "Let's Work Together",

      contactIntro:
        "Feel free to contact me for opportunities and collaborations.",
    },
  };

  if (
    colorScheme &&
    COLOR_SCHEMES[colorScheme]
  ) {
    portfolioData.meta.primaryColor =
      COLOR_SCHEMES[colorScheme]
        .primaryColor;

    portfolioData.meta.accentColor =
      COLOR_SCHEMES[colorScheme]
        .accentColor;
  }

  console.log(
    `[PortfolioGenerator] Generated Portfolio | ${portfolioData.personal.name}`
  );

  return portfolioData;
};

module.exports = {
  generatePortfolioData,
};