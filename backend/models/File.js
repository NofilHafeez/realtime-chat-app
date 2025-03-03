const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },  // Original file name
    fileUrl: { type: String, required: true },   // Cloudinary URL
    fileType: { type: String, required: true },  // e.g., "image/png", "video/mp4"
    size: { type: Number, required: true },      // File size in bytes
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Uploader
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" }, // Optional: If the file is sent in a group chat
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const File = mongoose.model('File', fileSchema);

module.exports = File;
