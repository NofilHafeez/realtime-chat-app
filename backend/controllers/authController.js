const userModel = require('../models/User');
const { generateToken } = require('../utils/generateToken');
const bcrypt = require('bcryptjs');

// For Registration
module.exports.registerUser = async (req, res) => {
    try {
        let { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ flash: ["All fields are required"] });
        }

        let existedUser = await userModel.findOne({ email });

        // Check if user already exists
        if (existedUser) {
            return res.status(400).json({ flash: ["Account already exists"] });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const createdUser = await userModel.create({ name, email, password: hashedPassword });

        // Generate JWT token
        let token = generateToken(createdUser);

        // Set secure cookie with token
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None', 
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days Expiry
        });

        // Send response
        res.status(201).json({ success: ["Registration Successful!"] });

    } catch (err) {
        res.status(500).json({ flash: ["Server error, please try again later"] });
    }
};



// Login User
module.exports.loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;

         // Validate input
         if (!email || !password) {
            return  res.status(400).json({ flash: ["All fields are required"] });
        }

        //  Get User
        let user = await userModel.findOne({ email });

        // Check User
        if (!user) {
            return  res.status(400).json({ flash: ["Email or password incorrect"] });
        };


        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return  res.status(400).json({ flash: ["Email or password incorrect"] });
        }
  
        
        // Generate JWT token
        let token = generateToken(user);

        // Set secure cookie with token
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,  // Secure in production
            sameSite: "Lax", // Prevents CSRF issues
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days Expiry // Required for cross-origin cookies
        });
        

        res.status(201).json({ success: ["login Successful!"] });

    } catch (err) {
        console.log(err.message)
        res.status(500).json({ flash: ["Server error, please try again later"] });
    }
}

// LogOut User
module.exports.logoutUser = async (req, res) => {
    try {
        // Clear the cookie
        res.cookie('token', '', { httpOnly: true, secure: true, sameSite: 'none', expires: new Date(0) });

        // Send response
        res.status(201).json({ success: ["Logout Successful!"] });
    } catch (err) {
        res.status(500).json({ flash: ["Server error, please try again later"] });
    }
};
