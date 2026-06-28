const crypto = require("crypto");
const User = require("../models/user");
const { asyncHandler } = require("../middleware/errorMiddleware");
const {
  CLIENT_URL,
  JWT_SECRET

} = require("../config/env");
 
// Nodemailer transporter
 
 
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
 return res.status(400).json({
  success: false,
  message: "Email already registered. Please login."
});
}
 
  const user = await User.create({ name, email, password });
  user.isVerified = true;
await user.save({ validateBeforeSave: false });
 
  res.status(201).json({
    success: true,
    message: "Account created successfully🎉! Please login.",
    data: { userId: user._id, email: user.email },
  });
});
 
// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
 
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
 
});
 
// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public

 
// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public

 
module.exports = {
 register,
 login,
 logout,
 getMe,
 forgotPassword,

};