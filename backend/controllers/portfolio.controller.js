/**
 * Portfolio Controller
 * Handles HTTP layer for all portfolio generation endpoints.
 * Place at: backend/controllers/portfolio.controller.js
 */

const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const { generatePortfolioData } = require("../services/portfolioGenerator.service");
const { renderPortfolioHTML } = require("../services/portfolioTemplate.service");
const { exportPortfolioAsZip } = require("../services/portfolioExport.service");
const Portfolio = require("../models/portfolio");
const puppeteer = require("puppeteer");
const archiver = require("archiver");
// ──────────────────────────────────────────────
// Utility: standard responses
// ──────────────────────────────────────────────
const success = (res, data, message = "Success", status = 200) =>
  res.status(status).json({ success: true, message, data });

const failure = (res, message = "Server Error", status = 500) =>
  res.status(status).json({ success: false, message });

// ──────────────────────────────────────────────
// Available templates metadata
// ──────────────────────────────────────────────
const TEMPLATE_METADATA = [
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    description: "Neon-lit futuristic design with glitch effects and dark aesthetics",
    preview: "/templates/cyberpunk/preview.png",
    tags: ["Dark", "Neon", "Futuristic", "Tech"],
    colors: { primary: "#00ffff", accent: "#ff00ff", bg: "#0a0a0a" },
    bestFor: ["Developers", "Designers", "Game Dev"],
  },
  {
    id: "futuristic",
    name: "Futuristic",
    description: "Space-age UI with holographic gradients and orbital animations",
    preview: "/templates/futuristic/preview.png",
    tags: ["Space", "Gradient", "Modern", "AI"],
    colors: { primary: "#7b2fff", accent: "#00ffcc", bg: "#050510" },
    bestFor: ["AI Engineers", "Data Scientists", "Tech Leads"],
  },
  {
    id: "glassmorphism",
    name: "Glassmorphism",
    description: "Frosted glass surfaces with blur effects and soft gradients",
    preview: "/templates/glassmorphism/preview.png",
    tags: ["Glass", "Blur", "Elegant", "Modern"],
    colors: { primary: "#6366f1", accent: "#a78bfa", bg: "#0f0f1a" },
    bestFor: ["Product Managers", "UX Designers", "Consultants"],
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean, typography-first design. Professional and ATS-friendly",
    preview: "/templates/minimal/preview.png",
    tags: ["Clean", "Simple", "Professional", "ATS"],
    colors: { primary: "#3b82f6", accent: "#10b981", bg: "#ffffff" },
    bestFor: ["Finance", "Law", "Management", "Academia"],
  },
];

// ──────────────────────────────────────────────
// POST /api/portfolio/generate
// ──────────────────────────────────────────────
/**
 * generatePortfolio
 * Extracts portfolio data from resume text via AI,
 * renders it into HTML using the selected template,
 * and returns both the structured data and rendered HTML.
 *
 * @route  POST /api/portfolio/generate
 * @body   { resumeText, template?, colorScheme? }
 */
const generatePortfolio = async (req, res) => {
  console.log("REQ BODY =", req.body);
console.log("REQ FILE =", req.file);
  try {
    const {
  name,
  title,
  skills,
  projects,
  template = "cyberpunk",
  colorScheme = null,
} = req.body;
let imageUrl = "";

if (req.file) {
  console.log(
    "Image received:",
    req.file.originalname
  );

  imageUrl =
    `/uploads/${req.file.filename}`;
}
console.log("IMAGE URL =", imageUrl);
console.log("REQ FILE =", req.file);
console.log("IMAGE URL =", imageUrl);
console.log("REQ BODY =", req.body);
   console.log(
  `[Portfolio] Generating | Template: ${template}`
);

    // Step 1: Extract structured portfolio data from resume via AI
  const portfolioData =
await generatePortfolioData(
  req.body,
  colorScheme
);
console.log("FILE =", req.file);

if (req.file && req.file.filename) {
  portfolioData.personal.image =
req.file.path;
}

console.log(
  "PROFILE IMAGE =",
  portfolioData.personal.image
);

    // Step 2: Render selected template with data
    const renderedHTML = await renderPortfolioHTML(portfolioData, template);
  await Portfolio.create({
  user: req.user._id,
  title: `${portfolioData.personal.name} Portfolio`,
  template,
  portfolioData,
});
    // Step 3: Persist the generated HTML for later preview/export
    const outputDir = path.join(__dirname, "../generated-portfolios");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const fileName = `portfolio_${portfolioData.meta.portfolioId}.html`;
    const filePath = path.join(outputDir, fileName);
    fs.writeFileSync(filePath, renderedHTML, "utf8");

    
     console.log(
  
  `[Portfolio] Generating | Template: ${template}`
);

    return success(
      res,
      {
        portfolioData,
        renderedHTML,
        portfolioId: portfolioData.meta.portfolioId,
        template,
        previewUrl: `/api/portfolio/preview/${portfolioData.meta.portfolioId}`,
        exportUrl: `/api/portfolio/export`,
      },
      "Portfolio generated successfully"
    );
  } catch (err) {
    console.error("[Portfolio] Generate error:", err);
    if (err.message?.includes("malformed JSON")) {
      return failure(res, "AI returned unexpected format. Please retry.", 502);
    }
    return failure(res, "Failed to generate portfolio. Please try again.", 500);
  }
};

// ──────────────────────────────────────────────
// POST /api/portfolio/export
// ──────────────────────────────────────────────
/**
 * exportPortfolio
 * Packages the portfolio into a downloadable ZIP:
 *   index.html + assets/ folder
 *
 * @route  POST /api/portfolio/export
 * @body   { portfolioData, template }
 */
const exportPortfolio = async (req, res) => {
  try {

    const {
  portfolioData,
  template = "cyberpunk",
  format
} = req.body;

if (!portfolioData) {
  return res.status(400).json({
    success: false,
    message: "No portfolio data received"
  });
}

const html =
  await renderPortfolioHTML(
    portfolioData,
    template
  );

    // HTML Export
    if (format === "html") {

      res.setHeader(
        "Content-Type",
        "text/html"
      );

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=portfolio.html"
      );

      return res.send(html);
    }
    if (format === "pdf") {

  const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"]
});

  const page = await browser.newPage();

  await page.setContent(html, {
    waitUntil: "networkidle0"
  });

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true
  });

  await browser.close();

  res.setHeader(
    "Content-Type",
    "application/pdf"
  );

  return res.send(pdf);
}
    // ZIP Export
    if (format === "zip") {

  res.attachment("portfolio.zip");

  const archive = archiver("zip");

  archive.pipe(res);

  archive.append(html, {
    name: "index.html"
  });

  archive.finalize();

  return;
}
return res.status(400).json({
  success: false,
  message: "Invalid export format"
});

} catch (err) {
  console.error("[Portfolio] Export error:", err);

  return res.status(500).json({
    success: false,
    message: "Export failed"
  });
}
};
// ──────────────────────────────────────────────
// GET /api/portfolio/templates
// ──────────────────────────────────────────────
/**
 * listTemplates
 * Returns all available portfolio templates with metadata.
 *
 * @route GET /api/portfolio/templates
 */
const listTemplates = async (req, res) => {
  try {
    return success(res, TEMPLATE_METADATA, "Templates retrieved");
  } catch (err) {
    return failure(res, "Failed to retrieve templates.", 500);
  }
};

// ──────────────────────────────────────────────
// GET /api/portfolio/preview/:portfolioId
// ──────────────────────────────────────────────
/**
 * getGeneratedPortfolio
 * Streams back a previously generated portfolio HTML file.
 *
 * @route GET /api/portfolio/preview/:portfolioId
 */
const getGeneratedPortfolio = async (req, res) => {
  try {
    const { portfolioId } = req.params;

    // Sanitize: only allow UUID-like IDs, prevent path traversal
    if (!/^[a-f0-9-]{36}$/.test(portfolioId)) {
      return failure(res, "Invalid portfolio ID.", 400);
    }

    const filePath = path.join(
      __dirname,
      "../generated-portfolios",
      `portfolio_${portfolioId}.html`
    );

    if (!fs.existsSync(filePath)) {
      return failure(res, "Portfolio not found.", 404);
    }

    res.setHeader("Content-Type", "text/html");
    return res.status(200).sendFile(filePath);
  } catch (err) {
    console.error("[Portfolio] Preview error:", err.message);
    return failure(res, "Failed to load portfolio preview.", 500);
  }
};

module.exports = {
  generatePortfolio,
  exportPortfolio,
  listTemplates,
  getGeneratedPortfolio,
};