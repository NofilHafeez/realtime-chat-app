const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const { Server } = require("socket.io");
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// Middleware
app.use(cors());
app.use(express.json());

// Socket.io Events
io.on("connection", (socket) => {
  console.log("🔗 User connected:", socket.id);

  socket.on("joinGroup", (groupId) => {
    socket.join(groupId);
    console.log(`📢 User joined group: ${groupId}`);
  });

  socket.on("sendMessage", ({ groupId, senderId, text }) => {
    io.to(groupId).emit("receiveMessage", { senderId, text });
    console.log(`📩 Message sent to ${groupId}:`, text);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

connectDB();


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

