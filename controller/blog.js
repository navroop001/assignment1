const Blog = require('../models/Blog');
const mongoose = require('mongoose');
const createBlog = async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title || !content || !author) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const blog = new Blog({ title, content, author, imageUrl });
    await blog.save();

    res.status(201).json(blog);
  } catch (err) {
    console.error("Error creating blog:", err);
    res.status(500).json({ message: "Failed to create blog" });
    console.log("error inside cfeate blog",err);
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
   
    res.json(blogs);
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
};



const toggleLike = async (req, res) => {
  try {
    const blogId = req.params.id;
    const { userId } = req.body;
console.log("params ", req.params)
    // Validate blog ID
    // if (!mongoose.Types.ObjectId.isValid(blogId)) {
    //   return res.status(400).json({ message: "Invalid blog ID" });
    // }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const alreadyLiked = blog.likes.includes(userId);

    if (alreadyLiked) {
      blog.likes = blog.likes.filter(id => id !== userId);
    } else {
      blog.likes.push(userId);
    }

    await blog.save();

    res.status(200).json({
      liked: !alreadyLiked,
      likesCount: blog.likes.length
    });
  } catch (err) {
    console.error("Error toggling like:", err);
    res.status(500).json({ message: "Failed to toggle like" });
  }
};
const getLikesForBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.query.userId;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const likesCount = blog.likes.length;
    const liked = userId ? blog.likes.includes(userId) : false;

    res.status(200).json({
      likesCount,
      liked,
    });
  } catch (err) {
    console.error("Error getting likes:", err);
    res.status(500).json({ message: "Failed to fetch likes" });
  }
};

const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json(blog);
  } catch (err) {
    console.error('Error fetching blog:', err);
    res.status(500).json({ message: 'Failed to fetch blog' });
  }
};



module.exports = {
  createBlog,
  getAllBlogs,
  toggleLike,
  getLikesForBlog,
  getBlogById,
};
