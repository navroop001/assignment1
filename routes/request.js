const express=require("express");
const router=express.Router();
const {sendFriendRequest,acceptFriendRequest,getAllPendingRequests}=require("../controller/request");
router.post("/friend-request/:id", sendFriendRequest);
router.post("/accept-request/:id", acceptFriendRequest); 
router.get("/all-requests/:id", getAllPendingRequests);
module.exports=router;


