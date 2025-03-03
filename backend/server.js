const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const connectDB = require('./config/db');
const authRouter = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(cors({ 
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true // Allow cookies
}));

  
app.use("/api/auth", authRouter);

connectDB();

app.listen(5000, () => {
    console.log('Server is running on port 3000');
});

