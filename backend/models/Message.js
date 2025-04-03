const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" }, // Optional for groups
  text: { type: String }, // Optional for text messages
  file: { type: String }, // Reference to File model
  createdAt: { type: Date, default: Date.now },
});
  
const Message = mongoose.model("Message", messageSchema);

module.exports = Message;