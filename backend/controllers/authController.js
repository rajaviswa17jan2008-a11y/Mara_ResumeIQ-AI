const crypto = require("crypto");
const User = require("../models/user");
const sendTokenResponse =
require("../utils/generateToken");
const { asyncHandler } = require("../middleware/errorMiddleware");
const nodemailer = require("nodemailer");
const {

  SMTP_HOST,
  SMTP_PORT,
  SMTP_EMAIL,
  SMTP_PASSWORD,
  FROM_EMAIL,
  FROM_NAME,
  CLIENT_URL,
  JWT_SECRET

} = require("../config/env");
 
// Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false,
  auth: { user: SMTP_EMAIL, pass: SMTP_PASSWORD },
});
 
const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({ from: `"${FROM_NAME}" <${FROM_EMAIL}>`, to, subject, html });
};
 
// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
   console.log("REGISTER BODY =", req.body);
  const { name, email, password } = req.body;
 
  if (!name || !email || !password) {
    console.log("MISSING DATA");
    return res.status(400).json({ success: false, message: "Please provide name, email, and password." });
  }
 
    const existingUser = await User.findOne({ email });

if (existingUser) {

  // User already verified
  if (existingUser.isVerified) {
    return res.status(400).json({
      success: false,
      message: "Email already registered. Please login."
    });
  }

  // User not verified yet
  const otp = existingUser.generateOTP();

  await existingUser.save({
    validateBeforeSave: false
  });

  await sendEmail({
    to: existingUser.email,
    subject: "🚀 Verify your ResumeIQ account",
    html: `
      <h2>Your OTP is:</h2>
      <h1>${otp}</h1>
    `
  });

  return res.status(200).json({
    success: true,
    message: "OTP resent successfully.",
    data: {
      userId: existingUser._id,
      email: existingUser.email
    }
  });
}
 
  const user = await User.create({ name, email, password });
  const otp = user.generateOTP();
  await user.save({ validateBeforeSave: false });
 
  try {
    await sendEmail({
      to: email,
      subject: "🚀 Verify your ResumeIQ account",
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a1a; color: white; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 40px 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">ResumeIQ AI</h1>
            <p style="margin: 8px 0 0; opacity: 0.9;">Your AI-powered career companion</p>
          </div>
          <div style="padding: 40px 30px;">
            <h2 style="color: #a78bfa;">Welcome, ${name}! 🎉</h2>
            <p style="color: #cbd5e1;">Use the OTP below to verify your email address:</p>
            <div style="background: #1e1b4b; border: 2px solid #6366f1; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
              <span style="font-size: 40px; font-weight: bold; letter-spacing: 12px; color: #818cf8;">${otp}</span>
            </div>
            <p style="color: #94a3b8; font-size: 14px;">This OTP expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
          </div>
        </div>
      `,
    });
  } catch (emailError) {
    console.error("Email send error:", emailError.message);
  }
 
  res.status(201).json({
    success: true,
    message: "Registration successful! Please verify your email.",
    data: { userId: user._id, email: user.email },
  });
});
 
// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = asyncHandler(async (req, res) => {
  const { userId, otp } = req.body;
 console.log("USER ID =", userId);
  console.log("OTP FROM FRONTEND =", otp);

  const user = await User.findById(userId)
    .select("+otp.code +otp.expiresAt");
     console.log("OTP FROM DB =", user?.otp?.code);
 

  if (!user) return res.status(404).json({ success: false, message: "User not found." });
 
  if (!user.otp?.code || String(user.otp.code) !== String(otp)) {
    return res.status(400).json({ success: false, message: "Invalid OTP." });
  }
 
  if (user.otp.expiresAt < Date.now()) {
    return res.status(400).json({ success: false, message: "OTP has expired. Request a new one." });
  }
 
  user.isVerified = true;
  user.otp = undefined;
  await user.save({ validateBeforeSave: false });
 
  sendTokenResponse(user, 200, res, "Email verified successfully! Welcome to ResumeIQ.");
});
 
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  console.log("LOGIN START");
  const { email, password } = req.body;
 
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Please provide email and password." });
  }
 
  const user = await User.findOne({ email }).select("+password");
  console.log(
  "USER:",
  user?.email
);
  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid credentials." });
  }
 
  if (user.isLocked()) {
    const remainingMs = user.lockUntil - Date.now();
    const remainingMins = Math.ceil(remainingMs / 60000);
    return res.status(403).json({ success: false, message: `Account locked. Try again in ${remainingMins} minutes.` });
  }
 
  console.log(
  "LOGIN PASSWORD =",
  password
);

console.log(
  "DB HASH =",
  user.password
);

const isMatch =
  await user.comparePassword(
    password
  );
  console.log(
  "PASSWORD MATCH:",
  isMatch
);
  if (!isMatch) {
    user.loginAttempts += 1;
    if (user.loginAttempts >= 5) {
      user.lockUntil = Date.now() + 15 * 60 * 1000; // 15 min lock
      user.loginAttempts = 0;
    }
    await user.save({ validateBeforeSave: false });
    return res.status(401).json({ success: false, message: "Invalid credentials." });
  }
 
  if (!user.isVerified) {
    console.log(
  "IS VERIFIED =",
  user.isVerified
);
    return res.status(403).json({ success: false, message: "Please verify your email before logging in." });
  }
 
  user.loginAttempts = 0;
  user.lockUntil = undefined;
  user.lastActive = Date.now();
  await user.save({ validateBeforeSave: false });
  console.log(
  "LOGIN SUCCESS"
);
 
  const jwt =
require("jsonwebtoken");

const token = jwt.sign(

  {
    id: user._id
  },

  JWT_SECRET,

  {
    expiresIn: "7d"
  }

);

res.status(200).json({

  success: true,

  token,

  user,

  message:
    "Login successful!"

});
});
 
// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "none", { expires: new Date(Date.now() + 5 * 1000), httpOnly: true });
  res.status(200).json({ success: true, message: "Logged out successfully." });
});
 
// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({ success: true, data: { user } });
});
 
// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  console.log("FORGOT EMAIL =", req.body.email);
console.log("CLIENT_URL =", CLIENT_URL);
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(200).json({ success: true, message: "If that email is registered, a reset link has been sent." });
  }
 
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
 
  const resetUrl = `${CLIENT_URL}/reset-password/${resetToken}`;
 console.log("RESET URL =", resetUrl);
  try {
    await sendEmail({
      to: user.email,
      subject: "🔐 Reset your ResumeIQ password",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a1a; color: white; padding: 40px; border-radius: 16px;">
          <h2 style="color: #818cf8;">Password Reset Request</h2>
          <p>Click the button below to reset your password. This link expires in 10 minutes.</p>
          <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; margin: 20px 0; font-weight: bold;">Reset Password</a>
          <p style="color: #94a3b8; font-size: 13px;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });
    res.status(200).json({ success: true, message: "Password reset link sent to your email." });
  } catch (error) {

  console.error("EMAIL ERROR:", error);

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save({
    validateBeforeSave: false
  });

  return res.status(500).json({
    success: false,
    message: error.message
  });

}
});
 
// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");
 
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select("+resetPasswordToken +resetPasswordExpire");
 
  if (!user) {
    return res.status(400).json({ success: false, message: "Invalid or expired reset token." });
  }
 
  console.log(
  "NEW PASSWORD =",
  req.body.password
);

user.password = req.body.password;

user.resetPasswordToken = undefined;
user.resetPasswordExpire = undefined;

await user.save();

console.log(
  "PASSWORD SAVED"
);
 
  res.status(200).json({
  success: true,
  message:
    "Password reset successful. Please login with your new password."
});
});
 
// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOTP = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body.userId);
  if (!user) return res.status(404).json({ success: false, message: "User not found." });
  if (user.isVerified) return res.status(400).json({ success: false, message: "Email already verified." });
 
  const otp = user.generateOTP();
  await user.save({ validateBeforeSave: false });
 
  await sendEmail({
    to: user.email,
    subject: "🔑 New OTP - ResumeIQ",
    html: `<div style="font-family: sans-serif; background: #0a0a1a; color: white; padding: 30px; border-radius: 12px;"><h3>Your new OTP:</h3><div style="font-size: 36px; font-weight: bold; color: #818cf8; letter-spacing: 10px;">${otp}</div><p style="color: #94a3b8;">Expires in 10 minutes.</p></div>`,
  });
 
  res.status(200).json({ success: true, message: "New OTP sent to your email." });
});
 
module.exports = { register, verifyOTP, login, logout, getMe, forgotPassword, resetPassword, resendOTP };