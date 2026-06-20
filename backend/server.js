require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const connectDB = require("./config/db");

const { errorHandler } = require("./utils/errorHandler");
const logger = require("./utils/logger");
const { globalLimiter } = require("./middleware/rateLimiter.middleware");
const { scheduleCleanup } = require("./utils/fileCleanup");

// Route imports
const userRoutes =
require("./routes/userRoutes");
const authRoutes =
require("./routes/authRoutes");
const resumeRoutes = require("./routes/resume.routes");
const analysisRoutes = require("./routes/analysis.routes");
const skillRoutes = require("./routes/skill.routes");
const jobRoutes = require("./routes/job.routes");
const chatbotRoutes = require("./routes/chatbot.routes");
const interviewRoutes = require("./routes/interview.routes");
const profileRoutes = require("./routes/profile.routes");
const portfolioRoutes =
  require("./routes/portfolio.routes");
const app = express();

// ─── Security ──────────────────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      const allowed = (process.env.FRONTEND_URL || "https://mararesume-iq-ai.vercel.app").split(",");
      if (!origin || allowed.includes(origin) || process.env.NODE_ENV === "development") {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-internal-secret"],
  })
);

// ─── Body Parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─── Logging ───────────────────────────────────────────────────────────────────
app.use(
  morgan("dev", {
    skip: (req) => req.path === "/health",
  })
);

// ─── Static Files ──────────────────────────────────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── Global Rate Limiter ────────────────────────────────────────────────────────
app.use("/api/", globalLimiter);

// ─── Health Check ──────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "ResumeIQ AI Engine",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || "development",
    providers: {
  openrouter:
    !!process.env.OPENROUTER_API_KEY,
},
  });
});

// ─── API Routes ────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use(
  "/api/users",
  userRoutes
);
app.use("/api/resume", resumeRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/profile", profileRoutes);
app.use(
  "/api/interview",

  require(
    "./routes/interview.routes"
  )
);
app.use(
  "/api/portfolio",
  portfolioRoutes
);

// ─── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.path}` });
});
// ─── Global Error Handler ──────────────────────────────────────────────────────
app.use(errorHandler);
connectDB();

// ─── Start Server ──────────────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT) || 5001;
const server = app.listen(PORT, () => {
  logger.info(`🤖 ResumeIQ AI Engine running on port ${PORT} [${process.env.NODE_ENV || "development"}]`);
  logger.info(
  `🔮 OpenRouter: ${
    process.env.OPENROUTER_API_KEY
      ? "✓ Connected"
      : "✗ Not configured"
  }`
);
  scheduleCleanup(30 * 60 * 1000);
});

// ─── Graceful Shutdown ─────────────────────────────────────────────────────────
process.on("SIGTERM", () => {
  logger.info("SIGTERM received — shutting down gracefully");
  server.close(() => {
    logger.info("Server closed");
    process.exit(0);
  });
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
  process.exit(1);
});

module.exports = app;