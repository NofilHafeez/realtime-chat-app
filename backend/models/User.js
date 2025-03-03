const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[a-zA-Z]{2,})$/,
        'Please enter a valid email',
      ],
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "https://yourdefaultimage.com/avatar.png",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    onlineStatus: {
      type: String,
      enum: ["online", "offline", "away"],
      default: "offline",
    },
    folders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
      }
    ],
  },
  { timestamps: true }
);


const User = mongoose.model('User', userSchema);

module.exports = User;
