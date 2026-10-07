/**
 * upload.js — Multer memory storage + Cloudinary upload helper
 * Usage: router.post("/reports", protect, upload.single("image"), controller)
 */
const multer     = require("multer");
const cloudinary = require("../config/cloudinary");
const { createError } = require("./errorHandler");

// Store file in memory buffer (never touches disk)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(createError("Only image files are allowed", 400), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

/**
 * uploadToCloudinary — upload a buffer to Cloudinary and return the URL
 * @param {Buffer} buffer  - file buffer from multer
 * @param {string} folder  - Cloudinary folder name
 * @returns {{ url, publicId }}
 */
const uploadToCloudinary = (buffer, folder = "transporthub/reports") =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image", quality: "auto" },
      (err, result) => {
        if (err) return reject(err);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });

module.exports = { upload, uploadToCloudinary };
