const User = require("../models/user");
const Resume = require("../models/resume");
const Analysis = require("../models/Analysis");
const { asyncHandler } = require("../middleware/errorMiddleware");
const { deleteFromCloudinary } = require("../middleware/uploadMiddleware");
 
// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.status(200).json({

  success: true,

  user

});
});
 
// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
console.log(
  "REQ BODY:",
  req.body
);
  const allowedFields = [
  "name",
  "email",
  "bio",
  "phone",
  "location",
  "linkedin",
  "github",
  "website",
  "jobTitle",
  "skills",
];

  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

const user = await User.findByIdAndUpdate(
  req.user._id,
  updates,
  {
    new: true,
    runValidators: true,
  }
).select("-password");
console.log(
  "UPDATED DB USER:",
  user
);
  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });

});
 
// @desc    Upload avatar
// @route   PUT /api/users/avatar
// @access  Private
const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: "Please upload an image." });
 
  const user = await User.findById(req.user._id);
 
  // Delete old avatar from Cloudinary
  //if (user.avatar?.public_id) {
    //await deleteFromCloudinary(user.avatar.public_id, "image");
  //}
 
  user.avatar = {
  public_id: req.file.filename,
  url: req.file.path,
};
  await user.save({ validateBeforeSave: false });
  console.log(
  "AVATAR SAVED:",
  user.avatar
);
 
  res.status(200).json({ success: true, message: "Avatar updated.", data: { avatar: user.avatar } });
});
 
// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
const changePassword =
asyncHandler(async (
  req,
  res
) => {

  const {
    currentPassword,
    newPassword
  } = req.body;

  console.log(
    "REQ USER:",
    req.user
  );

  const user = await User
    .findById(req.user._id)
    .select("+password");

  if (!user) {

    return res.status(404).json({

      success: false,

      message:
        "User not found"

    });

  }

  const isMatch =
    await user.comparePassword(
      currentPassword
    );

  if (!isMatch) {

    return res.status(401).json({

      success: false,

      message:
        "Current password is incorrect."

    });

  }

  user.password = newPassword;

  await user.save();

  res.status(200).json({

    success: true,

    message:
      "Password changed successfully."

  });

});
 
// @desc    Get user dashboard stats
// @route   GET /api/users/stats
// @access  Private
const getUserStats = asyncHandler(async (req, res) => {
  const [resumeCount, analysisCount, latestAnalysis] = await Promise.all([
    Resume.countDocuments({ user: req.user._id, isActive: true }),
    Analysis.countDocuments({ user: req.user._id, status: "completed" }),
    Analysis.findOne({ user: req.user._id, status: "completed" })
      .sort({ createdAt: -1 })
      .select("atsScore scores createdAt"),
  ]);
 
  res.status(200).json({
    success: true,
    data: {
      resumeCount,
      analysisCount,
      latestATSScore: latestAnalysis?.atsScore || 0,
      latestAnalysisDate: latestAnalysis?.createdAt || null,
    },
  });
});
 
// @desc    Delete account
// @route   DELETE /api/users/account
// @access  Private
const deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.user._id;
 
  // Delete all resumes from cloudinary
  const resumes = await Resume.find({ user: userId });
  await Promise.all(resumes.map((r) => deleteFromCloudinary(r.cloudinary.public_id, "raw")));
 
  // Delete all data
  await Promise.all([
    Resume.deleteMany({ user: userId }),
    Analysis.deleteMany({ user: userId }),
    User.findByIdAndDelete(userId),
  ]);
 
  res.cookie("token", "none", { expires: new Date(Date.now() + 5 * 1000), httpOnly: true });
  res.status(200).json({ success: true, message: "Account deleted successfully." });
});
 
// @desc    Get all users (admin)
// @route   GET /api/users/admin/all
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
 
  const users = await User.find().sort({ createdAt: -1 }).skip(skip).limit(limit).select("-password");
  const total = await User.countDocuments();
 
  res.status(200).json({
    success: true,
    data: { users, pagination: { page, limit, total, pages: Math.ceil(total / limit) } },
  });
});
 
// @desc    Admin analytics
// @route   GET /api/users/admin/analytics
// @access  Private/Admin
const getAdminAnalytics = asyncHandler(async (req, res) => {
  const [totalUsers, totalResumes, totalAnalyses, recentUsers] = await Promise.all([
    User.countDocuments(),
    Resume.countDocuments(),
    Analysis.countDocuments({ status: "completed" }),
    User.find().sort({ createdAt: -1 }).limit(10).select("name email createdAt resumeCount analysisCount"),
  ]);
 
  const avgATSResult = await Analysis.aggregate([
    { $match: { status: "completed" } },
    { $group: { _id: null, avgScore: { $avg: "$atsScore" } } },
  ]);
 
  const avgATSScore = avgATSResult[0]?.avgScore ? Math.round(avgATSResult[0].avgScore) : 0;
 
  // Monthly registrations (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
 
  const monthlyUsers = await User.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    { $group: { _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } }, count: { $sum: 1 } } },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);
 
  res.status(200).json({
    success: true,
    data: { totalUsers, totalResumes, totalAnalyses, avgATSScore, recentUsers, monthlyUsers },
  });
});
 
module.exports = { getProfile, updateProfile, uploadAvatar, changePassword, getUserStats, deleteAccount, getAllUsers, getAdminAnalytics };
 