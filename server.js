const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./index');
const path = require('path');
const socketIO = require('socket.io');
const Message = require('./models/Message');
const PrivateChat=require("./models/PrivateChat");
const jwt = require('jsonwebtoken');
const uploadRoute = require("./routes/upload");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
// app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}));

app.use("/api/save-file", uploadRoute);

app.use('/api', routes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post("/user/generateToken", (req, res) => {
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  let data = {
      time: Date(),
      userId: 12,
  }

  const token = jwt.sign(data, jwtSecretKey);

  res.send(token);
});
app.get("/user/validateToken", (req, res) => {
  const tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
  const jwtSecretKey = process.env.JWT_SECRET_KEY;

  try {
    const token = req.header(tokenHeaderKey)?.replace("Bearer ", "");

    if (!token) {
      return res.status(403).send("No token provided.");
    }
   console.log(token);
    const verified = jwt.verify(token, jwtSecretKey);

    return res.status(200).send({
      success: true,
      message: "Token successfully verified.",
      data: verified,
    });
  } catch (error) {
    return res.status(401).send({
      success: false,
      message: "Invalid or expired token.",
      error: error.message,
    });
  }
});

mongoose.connect("mongodb://localhost:27017/cars?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB successfully"))
.catch(err => console.error("MongoDB connection error:", err));


app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});


io.on("connection", (socket) => {
  
  socket.on("joinRoom", async ({ roomId, username }) => {
    try {
      socket.join(roomId);
      console.log(`${username} joined room: ${roomId}`);
      const messages = await Message.find({ roomId }).sort({ timestamp: 1 });
      socket.emit("loadMessages", messages); 

      socket.to(roomId).emit("userJoined", `${username} `);
    } catch (err) {
      console.error("Error loading messages:", err.message);
    }
  });

 
  socket.on("sendMessage", async ({ roomId, message, username }) => {
    try {
      const newMsg = new Message({ roomId, message, username });
      await newMsg.save();

      io.to(roomId).emit("receiveMessage", {
        username,
        message,
        timestamp: newMsg.timestamp, 
      });
    } catch (err) {
      console.error("Error saving message:", err.message);
    }
  });
 
  socket.on("typing", ({ roomId, username }) => {
  socket.to(roomId).emit("userTyping", `${username} is typing...`);
});
  
  
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


