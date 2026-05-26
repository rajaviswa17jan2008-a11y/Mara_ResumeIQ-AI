const express = require("express");
const router = express.Router();
const {
  analyzeResume, getAnalysis, getAnalyses, careerChat,
  getChats, generateInterview, getJobRecommendations,
  getSkillRecommendations, getUserAnalytics,
} = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");
 
//router.use(protect);
 
router.post("/analyze/:resumeId", analyzeResume);
router.get("/analysis/:id", getAnalysis);
router.get("/analyses", getAnalyses);
router.post("/chat", careerChat);
router.get("/chats", getChats);
router.post("/interview/:resumeId", generateInterview);
router.post("/jobs/:resumeId", getJobRecommendations);
router.get("/skills/:resumeId", getSkillRecommendations);
router.get("/analytics", getUserAnalytics);
 
module.exports = router;
 