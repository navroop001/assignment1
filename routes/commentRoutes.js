// routes/commentRoutes.js
const express = require("express");
const router = express.Router();
const { getComments, postComment } = require("../controller/comment");

router.get("/:postId", getComments);      
router.post("/:postId", postComment);      

module.exports = router;
