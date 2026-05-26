const express = require("express");
const router = express.Router();
const {
  uploadResume, getResumes, getResume,
  deleteResume, updateResume, getResumeStatus,
} = require("../controllers/resumeController");
const { protect } = require("../middleware/auth.middleware");
const { uploadResume: uploadMiddleware } = require("../middleware/uploadMiddleware");
 
router.use(protect);
 
router.post("/upload", uploadMiddleware.single("resume"), uploadResume);
router.get("/", getResumes);
router.get("/:id", getResume);
router.put("/:id", updateResume);
router.delete("/:id", deleteResume);
router.get("/:id/status", getResumeStatus);
router.delete(
  "/delete/:id",
  deleteResume
);
 
module.exports = router;
 