require("dotenv").config(); 
const express = require("express");
const cors = require("cors");
const connectDB = require('./config/db');
const authRouter = require('./routes/authRoutes');
const groupRouter = require('./routes/groupRoutes');
const folderRouter = require('./routes/folderRoutes');
const fileRouter = require('./routes/fileRoutes');
const messageRouter = require('./routes/messageRoutes');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();
const http = require("http");
const socketIo = require("socket.io");


const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://realtime-chat-app-frontend1.vercel.app"
      ],
      methods: ["GET", "POST"]
    }
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: [ "http://localhost:5173",
              "https://realtime-chat-app-frontend1.vercel.app" 
        ], // ✅ Use a single origin
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", (req, res) => {
    res.header("Access-Control-Allow-Origin", "https://realtime-chat-app-frontend1.vercel.app");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    res.sendStatus(204); // ✅ No JSON, just status 204 (No Content)
});



io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Join a group chat room
    socket.on("joinGroup", ({ groupId, userId }) => {
        socket.join(groupId);
        console.log(`User ${userId} joined group: ${groupId}`);
        io.to(groupId).emit("joinedGroup", { groupId, userId });
    });

    // Handle sending messages
    socket.on("sendMessage", ({ groupId, text, file, senderId }) => {
        const messageData = { text, senderId, groupId, file };
        io.to(groupId).emit("message", messageData);  // ✅ Send full object
    });

    socket.on("createGroupSocket", async ({ groupName, userId }) => {
        console.log(`Group created: ${groupName} by ${userId}`);
    
        // Create a new group object
        const newGroup = {
            _id: new Date().getTime(), // Temporary unique ID
            name: groupName,
            admin: userId,
            members: [{ userId }], 
            isMember: false,// Only the creator is added
        };
    
        // Broadcast the group creation to all clients
        io.emit("G-created", newGroup);
    });
  
  
    // When a user disconnects
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

app.get('/', (req, res) => res.send('routes working'));

app.use("/api/auth", authRouter);
app.use("/api/group", groupRouter);
app.use("/api/folder", folderRouter);
app.use("/api/file", fileRouter);
app.use("/api/message", messageRouter);

const startServer = async () => {
    try {
        await connectDB(); // ✅ Ensure DB is connected before starting server
        server.listen(process.env.PORT || 3000, () => {
            console.log(`Server is running on port ${process.env.PORT || 3000}`);
        });
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1); // Exit process if DB fails
    }
};

startServer();

module.exports = { app, server, io };
