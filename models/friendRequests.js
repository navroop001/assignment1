const mongoose = require("mongoose");
const friendRequestSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isAccepted: {
    type: Boolean,
    default: null, // null = pending, true = accepted, false = rejected
  },
}, { timestamps: true });

module.exports = mongoose.model("FriendRequest", friendRequestSchema);
