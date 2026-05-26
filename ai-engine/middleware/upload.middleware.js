const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const { AppError } = require("../utils/errorHandler");
const { logger } = require("../utils/logger");
const { STATUS } = require("../constants/statusCodes");

const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || "./uploads");
const MAX_SIZE_MB = parseInt(process.env.MAX_FILE_SIZE_MB) || 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const ALLOWED_EXTENSIONS = new Set([".pdf", ".doc", ".docx"]);

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  logger.info(`Upload directory created: ${UPLOAD_DIR}`);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userDir = req.user?.id
      ? path.join(UPLOAD_DIR, req.user.id.toString())
      : UPLOAD_DIR;

    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uid = crypto.randomBytes(16).toString("hex");
    const timestamp = Date.now();
    cb(null, `resume-${timestamp}-${uid}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    return cb(
      new AppError(
        `Invalid file type "${file.mimetype}". Only PDF, DOC, and DOCX are allowed.`,
        STATUS.BAD_REQUEST,
        "INVALID_FILE_TYPE"
      ),
      false
    );
  }

  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return cb(
      new AppError(
        `Invalid file extension "${ext}". Allowed: .pdf, .doc, .docx`,
        STATUS.BAD_REQUEST,
        "INVALID_EXTENSION"
      ),
      false
    );
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_SIZE_BYTES,
    files: 1,
    fields: 10,
  },
});

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    const messages = {
      LIMIT_FILE_SIZE: `File too large. Maximum allowed size is ${MAX_SIZE_MB}MB.`,
      LIMIT_FILE_COUNT: "Too many files. Only 1 file is allowed per request.",
      LIMIT_UNEXPECTED_FILE: "Unexpected file field received.",
      LIMIT_FIELD_COUNT: "Too many form fields.",
    };
    const message = messages[err.code] || `Upload error: ${err.message}`;
    return res.status(STATUS.BAD_REQUEST).json({ success: false, message, code: err.code });
  }

  if (err?.isOperational) {
    return res.status(err.statusCode).json({ success: false, message: err.message, code: err.code });
  }

  next(err);
};

const cleanupFile = (filePath) => {
  if (!filePath) return;
  fs.unlink(filePath, (err) => {
    if (err && err.code !== "ENOENT") {
      logger.warn(`Failed to delete file: ${filePath} — ${err.message}`);
    }
  });
};

const cleanupOnError = (req, res, next) => {
  res.on("finish", () => {
    if (res.statusCode >= 400 && req.file?.path) {
      cleanupFile(req.file.path);
    }
  });
  next();
};

module.exports = {
  upload,
  handleMulterError,
  cleanupFile,
  cleanupOnError,
  UPLOAD_DIR,
  MAX_SIZE_BYTES,
};