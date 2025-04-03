const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage setup for images, PDFs, and videos
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let resourceType = "image"; // Default to images

    if (file.mimetype === "application/pdf") {
      resourceType = "raw"; // For PDFs
    } else if (file.mimetype.startsWith("video/")) {
      resourceType = "video"; // For videos
    }

    return {
      folder: "files", // Cloudinary folder
      format: file.mimetype.split("/")[1], // Extract format from mimetype
      resource_type: resourceType,
    };
  },
});

const upload = multer({ storage });

module.exports = { cloudinary, upload };
