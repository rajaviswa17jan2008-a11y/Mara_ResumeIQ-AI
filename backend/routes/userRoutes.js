const express = require("express");
const router = express.Router();
const {
  getProfile, updateProfile, uploadAvatar, changePassword,
  getUserStats, deleteAccount, getAllUsers, getAdminAnalytics,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth.middleware");
const { uploadAvatar: avatarUpload } = require("../middleware/uploadMiddleware");
 
router.use(protect);
 
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.put("/avatar", avatarUpload.single("avatar"), uploadAvatar);
router.put("/change-password", changePassword);
router.get("/stats", getUserStats);
router.delete("/account", deleteAccount);
 
// Admin routes
router.get("/admin/all", authorize("admin"), getAllUsers);
router.get("/admin/analytics", authorize("admin"), getAdminAnalytics);
 
module.exports = router;
 