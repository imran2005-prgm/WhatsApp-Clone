const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow connections from any IP (for local network access)
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve uploaded files

const authRoute = require('./routes/auth');
const messageRoute = require('./routes/messages');
const userRoute = require('./routes/users');
const uploadRoute = require('./routes/upload');

app.use('/api/auth', authRoute);
app.use('/api/messages', messageRoute);
app.use('/api/users', userRoute);
app.use('/api/upload', uploadRoute);

// Database Connection
if (process.env.MONGO_URI && process.env.MONGO_URI.trim() !== "") {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => {
      console.log("MongoDB Connection Error:", err.message);
      console.log("Running in demo mode without database");
    });
} else {
  console.log("⚠️  MongoDB not configured - Running in demo mode");
}

// Socket.io
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", (userId) => {
    socket.join(userId);
    console.log(`User with ID: ${userId} joined room: ${userId}`);
  });

  socket.on("send_message", (data) => {
    // data: { sender, receiver, text, fileUrl, type, timestamp }
    socket.to(data.receiver).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Network access: http://YOUR_IP:${PORT}`);
});
