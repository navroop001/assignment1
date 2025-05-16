const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createBlog, getAllBlogs, toggleLike,getLikesForBlog,getBlogById } = require('../controller/blog');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });


router.post('/', upload.single('image'), createBlog);
router.get('/', getAllBlogs);
router.post('/:id/like', toggleLike);
router.get('/:id/likes', getLikesForBlog);
router.get('/:id', getBlogById);
module.exports = router;
