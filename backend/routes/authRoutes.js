const express = require("express");
const router = express.Router();
const {
  register, verifyOTP, login, logout, getMe,
  forgotPassword, resetPassword, resendOTP,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth.middleware");
 
router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resetToken", resetPassword);
router.post("/resend-otp", resendOTP);
 
module.exports = router;
 