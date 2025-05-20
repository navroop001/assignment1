const FriendRequest = require("../models/friendRequests");
const User = require("../models/user.model");

exports.getFriends = async (req, res) => {
  try {
    const { userId } = req.params;

    const acceptedRequests = await FriendRequest.find({
      isAccepted: true,
      $or: [
        { senderId: userId },
        { receiverId: userId },
      ]
    });
     //console.log("Accepted friends",acceptedRequests);
     //console.log("Logged in userId:", userId);
acceptedRequests.forEach((req, i) => {
 // console.log(`Request ${i + 1}: senderId = ${req.senderId}, receiverId = ${req.receiverId}`);
});

 const friendIds = [
  ...new Set(
    acceptedRequests.map(req => {
      const sender = req.senderId.toString();
      const receiver = req.receiverId.toString();
      return sender === userId ? receiver : sender;
    })
  )
];

const friends = await User.find({ _id: { $in: friendIds } }).select("_id name email");



res.json(friends);

    console.log("friends",friends);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
