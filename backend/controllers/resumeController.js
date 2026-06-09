const Resume = require("../models/resume");
const User = require("../models/user");
const { asyncHandler } = require("../middleware/errorMiddleware");
const { parseResumeFromURL } = require("../services/resumeParser.service");
const { deleteFromCloudinary } = require("../middleware/uploadMiddleware");
const {

  generateResumeFeedback,

} = require(
  "../services/aiResumeAnalysis.service"
);

const {

  extractSkillsFromText

} = require(
  "../services/skillExtractor.service"
);
 
// @desc    Upload resume
// @route   POST /api/resumes/upload
// @access  Private
const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Please upload a PDF or DOCX file." });
  }
 
  const { title } = req.body;
  const oldResumes = await Resume.find({
  user: req.user._id
});
await Resume.deleteMany({
  user: req.user._id
});


  const file = req.file;
 
  // Determine file type
  const fileType = file.mimetype.includes("pdf") ? "pdf" : "docx";
  // Create resume record
  const resume = await Resume.create({
    user: req.user._id,
    fileName: file.originalname,
    fileType,
    fileSize: file.size,
    cloudinary: {
      public_id: file.filename || file.public_id,
      url: file.path,
    },
    title: title || file.originalname.replace(/\.[^/.]+$/, ""),
    status: "uploaded",
  });
 
  await User.findByIdAndUpdate(
  req.user._id,
  {
    resumeCount: 1
  }
);
 
  // Parse resume asynchronously
 const {
  rawText,
  parsedData
} = await parseResumeFromURL(
  file.path,
  fileType
);

const skills =

  extractSkillsFromText(
    rawText
  );

const feedback =

  await generateResumeFeedback(
    rawText,
    "Software Engineer",
    skills.all
  );



resume.rawText = rawText;

resume.parsedData = {

  ...parsedData,

  atsScore:
    feedback.feedback
      ?.atsScore || 0,

  feedback:
    feedback.feedback || {},

  skills:
    skills.all || [],

  recommendations: [],

};
const recommendations =

  feedback?.recommendations || [];

resume.status = "parsed";

await resume.save();
res.status(201).json({

  success: true,

  resume: {

  rawText,

  atsScore:
  feedback?.feedback?.atsScore || 0,

feedback:
  feedback?.feedback || {},

  skills:
    skills.all || [],

  recommendations:
    recommendations || [],

  jobs: [],

  targetRole:
    "Software Engineer"

}
});
 
});

 
 
// @desc    Get all resumes for user
// @route   GET /api/resumes
// @access  Private
const getResumes = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
 
  const resumes = await Resume.find({ user: req.user._id, isActive: true })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select("-rawText");
 
  const total = await Resume.countDocuments({ user: req.user._id, isActive: true });
 
  res.status(200).json({
    success: true,
    data: {
      resumes,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    },
  });
});
 
// @desc    Get single resume
// @route   GET /api/resumes/:id
// @access  Private
const getResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
  if (!resume) {
    return res.status(404).json({ success: false, message: "Resume not found." });
  }
  res.status(200).json({ success: true, data: {
  resume,
  
},} );
});
 
// @desc    Delete resume
// @route   DELETE /api/resumes/:id
// @access  Private
const deleteResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
  if (!resume) {
    return res.status(404).json({ success: false, message: "Resume not found." });
  }
 
  // Delete from Cloudinary
  await deleteFromCloudinary(resume.cloudinary.public_id, "raw");
 
  // Soft delete
  resume.isActive = false;
  await resume.save();
  await User.findByIdAndUpdate(req.user._id, { $inc: { resumeCount: -1 } });
 
  res.status(200).json({ success: true, message: "Resume deleted successfully." });
});
 
// @desc    Update resume title/tags
// @route   PUT /api/resumes/:id
// @access  Private
const updateResume = asyncHandler(async (req, res) => {
  const { title, tags } = req.body;
  const resume = await Resume.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { title, tags },
    { new: true, runValidators: true }
  );
  if (!resume) return res.status(404).json({ success: false, message: "Resume not found." });
  res.status(200).json({ success: true, data: { resume } });
});
 
// @desc    Get resume parsing status
// @route   GET /api/resumes/:id/status
// @access  Private
const getResumeStatus = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id }).select("status parsedData");
  if (!resume) return res.status(404).json({ success: false, message: "Resume not found." });
  res.status(200).json({ success: true, data: { status: resume.status, hasParsedData: !!resume.parsedData?.name } });
});
 
module.exports = { uploadResume, getResumes, getResume, deleteResume, updateResume, getResumeStatus };
 