/**
 * Portfolio Template Service
 * Renders portfolio data into full standalone HTML using template engines.
 * Place at: backend/services/portfolioTemplate.service.js
 */

const path = require("path");
const fs   = require("fs");

// ──────────────────────────────────────────────
// Template registry
// ──────────────────────────────────────────────
const TEMPLATES = {
  cyberpunk: require("../templates/cyberpunk"),
  futuristic: require("../templates/futuristic"),
  glassmorphism: require("../templates/glassmorphism"),
  minimal: require("../templates/minimal"),
};

/**
 * Renders portfolio data into a standalone HTML string.
 * @param {Object} portfolioData  - Normalized portfolio data object
 * @param {string} templateId     - Template key: cyberpunk|futuristic|glassmorphism|minimal
 * @returns {Promise<string>}     - Full HTML string ready to save/send
 */
const renderPortfolioHTML = async (portfolioData, templateId = "cyberpunk") => {
  const templateFn = TEMPLATES[templateId];

  if (!templateFn) {
    throw new Error(
      `Unknown template: "${templateId}". Valid: ${Object.keys(TEMPLATES).join(", ")}`
    );
  }
  console.log("EXPORT PORTFOLIO DATA =", JSON.stringify(portfolioData, null, 2));
console.log("EXPORT SKILLS =", portfolioData.skills);
console.log("EXPORT TECHNICAL =", portfolioData.skills?.technical);

  const html = templateFn(portfolioData);

  if (!html || typeof html !== "string") {
    throw new Error(`Template "${templateId}" returned invalid HTML`);
  }

  return html;
};

/**
 * Helper: wraps template content with a shared HTML shell.
 * Every template calls this to avoid duplicating boilerplate.
 *
 * @param {Object} opts
 * @param {string} opts.title
 * @param {string} opts.primaryColor
 * @param {string} opts.accentColor
 * @param {string} opts.styles     - Inline CSS string
 * @param {string} opts.body       - HTML body content
 * @param {string} opts.scripts    - Inline JS string
 * @returns {string}
 */
const wrapHTML = ({ title, primaryColor, accentColor, styles, body, scripts = "" }) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="Portfolio of ${escapeHtml(title)}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700&family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet" />
  <style>
    :root {
      --primary: ${primaryColor};
      --accent: ${accentColor};
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    ${styles}
  </style>
</head>
<body>
  ${body}
  <script>
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    ${scripts}
  </script>
</body>
</html>`;

// ──────────────────────────────────────────────
// Shared escaping + formatting helpers
// (Exported so templates can use them)
// ──────────────────────────────────────────────

const escapeHtml = (str = "") =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const formatSkillBar = (level, primaryColor) =>
  `<div style="height:4px;background:rgba(255,255,255,0.1);border-radius:2px;margin-top:4px;">
    <div style="height:100%;width:${level}%;background:${primaryColor};border-radius:2px;transition:width 1s ease;"></div>
  </div>`;

const linkIcon = (href, label) =>
  href
    ? `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer"
         style="color:inherit;text-decoration:none;opacity:0.8;transition:opacity 0.2s;"
         onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.8">
         ${escapeHtml(label)}
       </a>`
    : "";

module.exports = {
  renderPortfolioHTML,
  wrapHTML,
  escapeHtml,
  formatSkillBar,
  linkIcon,
};