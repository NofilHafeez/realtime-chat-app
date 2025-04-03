const multer = require("multer");
const { upload } = require("../utils/cloudinary");

// ✅ Middleware for single file upload (accepts ANY file type)
const uploadSingle = (req, res, next) => {
  // Remove file type restrictions
  const anyFileUpload = upload.single("file"); // Changed field name to "file" for generic use
  
  anyFileUpload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ 
        message: "File upload failed", 
        error: err.message 
      });
    }
    next();
  });
};

module.exports = uploadSingle;