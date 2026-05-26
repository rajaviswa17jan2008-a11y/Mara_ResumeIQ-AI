require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");


const errorHandler = require("./utils/errorHandler");
const requestLogger = require("./utils/logger");
const rateLimiter = require("./config/rateLimiter");
const uploadDir = require("./config/upload");

const resumeRoutes = require("./routes/resume.routes");
const analysisRoutes = require("./routes/analysis.routes");
const skillRoutes = require("./routes/skill.routes");
const jobRoutes = require("./routes/job.routes");
const chatbotRoutes = require("./routes/chatbot.routes");
const interviewRoutes = require("./routes/interview.routes");



// Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: process.env.FRONTEND_URL || "*", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("combined", { stream: { write: (msg) => requestLogger.info(msg.trim()) } }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rate limiting
app.use("/api/", rateLimiter);

// Routes
app.use("/api/resume", resumeRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/interview", interviewRoutes);

// Health check
app.get("/health", (req, res) => res.json({ status: "ok", service: "ResumeIQ AI Engine", version: "1.0.0" }));

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🤖 AI Engine running on port ${PORT}`));

module.exports = app;