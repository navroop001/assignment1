const express = require("express");
const router = express.Router();

// Controllers
const register = require("../../controller/register");
const login = require("../../controller/login");
const blogRoutes = require("../BlogRoute");
const commentRoutes = require("../commentRoutes");


// Friend Request controller (the new one)
const {sendFriendRequest,acceptFriendRequest,rejectFriendRequest,getAllPendingRequests,} = require("../../controller/request");
const {searchUsers}=require("../../controller/search")

// Auth routes
router.post("/register", register);
router.post("/login", login);

// Blog and Comment routes
router.use("/comment", commentRoutes);
router.use("/blog", blogRoutes);

// Friend request system
router.post("/friend-request/:id", sendFriendRequest);
router.post("/accept-request/:id", acceptFriendRequest);
router.post("/reject-request/:id", rejectFriendRequest);
router.get("/search-users", searchUsers);
router.get("/all-requests/:id", getAllPendingRequests); // ✅ fix this


module.exports = router;
