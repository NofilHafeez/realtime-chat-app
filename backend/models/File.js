const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
  {
    fileUrl: { type: String, required: true },   // Cloudinary URL
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Uploader
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" }, // Optional: If the file is sent in a group chat
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    uploadedAt: { type: Date, default: Date.now },
    folder : {
      type: mongoose.Schema.Types.ObjectId, ref: "Folder"
    }
  },
  { timestamps: true }
);

const File = mongoose.model('File', fileSchema);

module.exports = File;
