const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = require("../config/env");
 
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});
 
// Resume storage
const resumeStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "resumeiq/resumes",
    resource_type: "raw",

    public_id: (req, file) => {
      const userId = req.user?._id || "anonymous";
      const timestamp = Date.now();

      const originalName = file.originalname
        .replace(/\.[^/.]+$/, "")
        .replace(/\s+/g, "_");

      return `${userId}_${originalName}_${timestamp}`;
    },
  },
});
 
// Avatar storage
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "resumeiq/avatars",
    resource_type: "image",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 400, height: 400, crop: "fill", quality: "auto" }],
    public_id: (req, file) => `avatar_${req.user._id}_${Date.now()}`,
  },
});
 
const fileFilter = (allowedTypes) => (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed: ${allowedTypes.join(", ")}`), false);
  }
};
 
const uploadResume = multer({
  storage: resumeStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: fileFilter([
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
  ]),
});
 
const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter(["image/jpeg", "image/png", "image/jpg", "image/webp"]),
});
 
const deleteFromCloudinary = async (publicId, resourceType = "raw") => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error("Cloudinary delete error:", error.message);
  }
};
 
module.exports = { uploadResume, uploadAvatar, deleteFromCloudinary, cloudinary };
 