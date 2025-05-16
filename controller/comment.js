const Comment = require("../models/Comment");

const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ postId });
    res.json(comments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ message: "Error fetching comments" });
  }
};

const postComment = async (req, res) => {
  try {
    const { name, text } = req.body;
    
    const { postId } = req.params;

    if (!postId || !name || !text) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const newComment = new Comment({ postId, name, text });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    console.error("Error saving comment:", err);
    res.status(500).json({ message: "Error saving comment" });
  }
};

module.exports = { getComments, postComment };
