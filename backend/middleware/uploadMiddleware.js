const cloudinary = require("../config/cloudinary");
const {
  CloudinaryStorage
} = require("multer-storage-cloudinary");
const multer = require("multer");
// Resume storage

 const path = require("path");

const resumeStorage =
  multer.diskStorage({

    destination: function (
      req,
      file,
      cb
    ) {

      cb(null, "uploads/");

    },

    filename: function (
      req,
      file,
      cb
    ) {

      cb(
        null,
        Date.now() +
        path.extname(file.originalname)
      );

    },

});
// Avatar storage

 
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
 
const avatarStorage =
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "resumeiq-avatars",
      allowed_formats: [
        "jpg",
        "jpeg",
        "png",
        "webp"
      ],
    },
  });

const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
});
 
 
module.exports = {
  uploadResume,
  uploadAvatar
};
 