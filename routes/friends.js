const express = require("express");
const router = express.Router();
const userController = require("../controller/friendController");

router.get("/friends/:userId", userController.getFriends);

module.exports = router;
