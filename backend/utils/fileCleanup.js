const fs = require("fs");
const path = require("path");
const logger = require("./logger");

const UPLOAD_DIR = path.join(__dirname, "../uploads");
const MAX_AGE_MS = 60 * 60 * 1000; // 1 hour

function deleteFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      logger.info(`Deleted file: ${filePath}`);
    }
  } catch (err) {
    logger.error(`Failed to delete file ${filePath}: ${err.message}`);
  }
}

function cleanOldUploads() {
  try {
    if (!fs.existsSync(UPLOAD_DIR)) return;
    const files = fs.readdirSync(UPLOAD_DIR);
    const now = Date.now();
    let deleted = 0;
    for (const file of files) {
      const filePath = path.join(UPLOAD_DIR, file);
      const stat = fs.statSync(filePath);
      if (now - stat.mtimeMs > MAX_AGE_MS) {
        fs.unlinkSync(filePath);
        deleted++;
      }
    }
    if (deleted > 0) logger.info(`Cleaned ${deleted} old upload(s)`);
  } catch (err) {
    logger.error("Upload cleanup error:", err.message);
  }
}

function scheduleCleanup(intervalMs = 30 * 60 * 1000) {
  setInterval(cleanOldUploads, intervalMs);
  logger.info("Upload cleanup scheduler started");
}

module.exports = { deleteFile, cleanOldUploads, scheduleCleanup };