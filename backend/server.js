const dotenv = require("dotenv");
dotenv.config();
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

const __dirname = path.resolve();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:5173", // Allow frontend
        methods: ["GET", "POST"], // Allowed methods
        credentials: true // Allow authentication headers
    }
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ 
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true // Allow cookies
}));

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

app.use("/api/auth", authRouter);
app.use("/api/group", groupRouter);
app.use("/api/folder", folderRouter);
app.use("/api/file", fileRouter);
app.use("/api/message", messageRouter);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname,"../frontend", "dist", "index.html"))
    })
}

connectDB();

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});

module.exports = { app, server, io };
