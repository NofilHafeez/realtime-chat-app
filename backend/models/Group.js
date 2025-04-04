const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  groupName: {type: String, required: true},
  admin: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  }, 
  messages: [{type: mongoose.Schema.Types.ObjectId, ref: "Message"}],
  members: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
  isMember: {type: Boolean, default: false},
  createdAt: { type: Date, default: Date.now },
});

const Group = mongoose.model("Group", groupSchema);
module.exports = Group;