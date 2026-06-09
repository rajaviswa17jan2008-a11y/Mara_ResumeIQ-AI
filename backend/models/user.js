const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
 
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Invalid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    avatar: {
      public_id: { type: String, default: null },
      url: {
  type: String,
  default: "",
},
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      code: { type: String, select: false },
      expiresAt: { type: Date, select: false },
    },
    linkedin: { type: String, default: "" },
    github: { type: String, default: "" },
    website: { type: String, default: "" },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    bio: { type: String, default: "", maxlength: 500 },
    skills: [{ type: String }],
    jobTitle: {
  type: String,
  default: ""
},
    targetRole: { type: String, default: "" },
    experience: { type: String, default: "" },
    education: { type: String, default: "" },
    resumeCount: { type: Number, default: 0 },
    analysisCount: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now },
    notifications: {
      email: { type: Boolean, default: true },
      browser: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false },
    },
    theme: { type: String, enum: ["dark", "light"], default: "dark" },
    language: { type: String, default: "en" },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpire: { type: Date, select: false },
    passwordChangedAt: { type: Date },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    googleId: { type: String },
    githubId: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
 
// Virtual: resumes
userSchema.virtual("resumes", {
  ref: "Resume",
  localField: "_id",
  foreignField: "user",
});
 
// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  if (!this.isNew) this.passwordChangedAt = Date.now() - 1000;
  next();
});
 
// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
 
// Generate password reset token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 10 minutes
  return resetToken;
};
 
// Generate OTP
userSchema.methods.generateOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otp = {
    code: otp,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
  };
  return otp;
};
 
// Check if account is locked
userSchema.methods.isLocked = function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};
 
// Update last active
userSchema.methods.updateLastActive = async function () {
  this.lastActive = Date.now();
  await this.save({ validateBeforeSave: false });
};
 
module.exports = mongoose.model("User", userSchema);
 