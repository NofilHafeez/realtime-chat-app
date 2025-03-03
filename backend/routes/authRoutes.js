const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    logoutUser, 
    //forgotPasswordHandler, 
    //resetPasswordHandler, 
    //verifyEmailHandler, 
} = require('../controllers/authController');
const authenticateUser = require('../middlewares/authMiddleware');
const userModel = require('../models/User');


// Basic route
router.get('/', (req, res) => res.send('Auth routes working'));

router.get('/get-user', authenticateUser, async (req, res) => {
    try {
        let loggedInUser = req.user.email;

        // Fetch user correctly
        let user = await userModel.findOne({ email: loggedInUser });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user });

    } catch (error) {
        console.error("Error fetching user:", error.message);
        res.status(500).json({ error: "Server error, please try again later" });
    }
});


// User Registration
router.post('/register', registerUser);

// User Login
router.post('/login', loginUser);

// User Logout (protected)
router.post('/logout', logoutUser);

// Forgot Password
//router.post('/forgot-password', forgotPasswordHandler);

// Reset Password
//router.post('/reset-password', resetPasswordHandler);

// Email Verification
//router.get('/verify-email/:token', verifyEmailHandler);


module.exports = router;
