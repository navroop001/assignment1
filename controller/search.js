const User=require("../models/user.model")
exports.searchUsers = async (req, res) => {
  const query = req.query.q;
  const currentUserId = req.query.currentUserId; 

  try {
    const filter = {
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } }
      ]
    };

    if (currentUserId) {
      filter._id = { $ne: currentUserId }; 
    }

    const users = await User.find(filter).select("name email _id");

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Search failed", error: err.message });
  }
};