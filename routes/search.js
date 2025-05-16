const express=require("express");
const router=express.Router();
const {searchUsers}=require("../controller/search");
router.get("/search-users", searchUsers);
module.exports=router;