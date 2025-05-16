// models/Comment.js
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  postId: Number,
  name: String,
  text: String,
}, { timestamps: true });

module.exports = mongoose.model("Comment", commentSchema);
