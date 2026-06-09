/**
 * Portfolio Generator Routes
 * Registers all endpoints for AI Portfolio Generation feature.
 * Place at: backend/routes/portfolio.routes.js
 *
 * Mount in app.js:
 *   const portfolioRoutes = require('./routes/portfolio.routes');
 *   app.use('/api/portfolio', portfolioRoutes);
 */
const { uploadAvatar } = require("../middleware/uploadMiddleware");
const express = require("express");
const router = express.Router();

const {
  generatePortfolio,
  exportPortfolio,
  listTemplates,
  getGeneratedPortfolio,
} = require("../controllers/portfolio.controller");

const {
  validatePortfolioGeneration,
  validatePortfolioExport,
  sanitizeBody,
} = require("../middleware/validate.middleware");
const {
  protect
} = require(
  "../middleware/auth.middleware"
);

// ──────────────────────────────────────────────
// POST /api/portfolio/generate
// Main endpoint: extracts data from resume + generates portfolio
// Body: { resumeText, template?, colorScheme? }
// ──────────────────────────────────────────────
router.post(
  "/generate",
  protect,
  uploadAvatar.single("profileImage"),

  (req, res, next) => {
    console.log("FILE =", req.file);
    console.log("BODY =", req.body);
    next();
  },

  //sanitizeBody,
  validatePortfolioGeneration,
  generatePortfolio
);

router.post(
  "/export",
  //sanitizeBody,
  validatePortfolioExport,
  exportPortfolio
);

// ──────────────────────────────────────────────
// GET /api/portfolio/templates
// Returns list of available templates with metadata
// ──────────────────────────────────────────────
router.get("/templates", listTemplates);

// ──────────────────────────────────────────────
// GET /api/portfolio/preview/:portfolioId
// Returns a specific previously-generated portfolio
// ──────────────────────────────────────────────
router.get("/preview/:portfolioId", getGeneratedPortfolio);

module.exports = router  