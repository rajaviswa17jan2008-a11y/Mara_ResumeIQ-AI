const express = require("express");
const router = express.Router();
const {
  uploadResume, getResumes, getResume,
  deleteResume, updateResume, getResumeStatus,
} = require("../controllers/resumeController");
const { protect } = require("../middleware/auth.middleware");
const { uploadResume: uploadMiddleware } = require("../middleware/uploadMiddleware");
 const {
  analyzeResume,
} = require("../controllers/resumeImprovement.controller");
router.use(protect);
 
router.post("/upload", uploadMiddleware.single("resume"), uploadResume);
router.get("/list", getResumes);
router.get("/:id", getResume);
router.put("/:id", updateResume);
router.delete("/:id", deleteResume);
router.get("/:id/status", getResumeStatus);
router.delete(
  "/delete/:id",
  deleteResume
);
router.post(
  "/analyze",
  uploadMiddleware.single("resume"),
  analyzeResume
);
 
module.exports = router;
 