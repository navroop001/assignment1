const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String,required: true,},
  age: Number,
  email: { type: String,required: true,unique: true, },
  password: {type: String,required: true, },
   profilePic: {
    type: String,
    default: "", // you can also set a default image URL here
  },
  friends: [ {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  friendRequests: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  sentRequests: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
