const FriendRequest = require("../models/friendRequests");
const User = require("../models/user.model");
const upload=require("../middleware/upload")
const mongoose = require('mongoose');
exports.sendFriendRequest = async (req, res) => {
  const { senderId } = req.body;
  const receiverId = req.params.id;


  if (senderId === receiverId) {
    return res.status(400).json({ message: "Cannot send request to yourself" });
  }

  try {
    // Check if request already exists
    const existingRequest = await FriendRequest.findOne({ senderId, receiverId, isAccepted: null });
    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    const newRequest = new FriendRequest({ senderId, receiverId });
    await newRequest.save();
    res.status(200).json({ message: "Friend request sent" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.acceptFriendRequest = async (req, res) => {
  const receiverId = req.body.recieverId;
  const senderId = req.params.id;
  

  try {
    const request = await FriendRequest.findOne({ senderId, receiverId, isAccepted: { $in: [null, false] }});

    if (!request) {
      return res.status(404).json({ message: "No pending friend request found" });
    }

    request.isAccepted = true;
    await request.save();

    // Optionally update User's `friends` list
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);
    sender.friends.push(receiverId);
    receiver.friends.push(senderId);
    await sender.save();
    await receiver.save();

    res.status(200).json({ message: "Friend request accepted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
exports.rejectFriendRequest = async (req, res) => {
  const receiverId = req.body.recieverId;
  const senderId = req.params.id;

  try {
    const request = await FriendRequest.findOne({ senderId, receiverId, isAccepted: null });

    if (!request) {
      return res.status(404).json({ message: "No pending request" });
    }

    request.isAccepted = false;
    await request.save();

    res.status(200).json({ message: "Friend request rejected" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



exports.getAllPendingRequests = async (req, res) => {
  const receiverId = req.params.id;

  try {
    const requests = await FriendRequest.aggregate([
      { $match: { receiverId: new mongoose.Types.ObjectId(receiverId), isAccepted: null } },
      {
        $lookup: {
          from: "users",
          localField: "senderId",
          foreignField: "_id",
          as: "sender",
        },
      },
      { $unwind: "$sender" },
      {
        $project: {
          _id: 1,
          senderId: 1,
          receiverId: 1,
          isAccepted: 1,
          senderName: "$sender.name",
          senderEmail: "$sender.email",
          senderImage: "$sender.profilePic", // ✅ Include sender's image
        },
      },
    ]);

    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: "Error fetching requests", error: err.message });
  }
};




 