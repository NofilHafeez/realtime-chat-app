const express = require('express');
const router = express.Router();
const authenticateUser = require('../middlewares/authMiddleware');
const uploadSingle = require('../middlewares/uploadMiddleware');
const messageModel = require('../models/Message');
const groupModel = require('../models/Group')

// Basic route
router.get('/', (req, res) => res.send('file routes working'));

router.get('/group-messages/:id', authenticateUser, async (req, res) => {
    try {
        const groupId = req.params.id
        let messages = await messageModel.find({groupId}).sort({ createdAt: 1 }).populate("senderId", "name");
        if (!messages) {
            return res.status(404).json({ message: "messages not found" });
        }
    
        res.status(200).json({ messages });
    } catch (error) {
        console.error("Error fetching messages:", error.message);
        res.status(500).json({ error: "Server error, please try again later" });
    }
});

router.post('/send-message/:id', authenticateUser, async (req, res) => {
    try {
        const {groupId, text, senderId, file} = req.body;
        console.log(file);
        
        const group =  await groupModel.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        const message = await messageModel.create({senderId: senderId._id, groupId, text, file})

        res.status(200).json({ message: "message uploaded successfully", message });
    } catch (error) {
        console.error("Error uploading message:", error.message);
        res.status(500).json({ error: "Error uploading message, please try again later" });
    }
});

module.exports = router;
