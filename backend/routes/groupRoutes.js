const express = require('express');
const router = express.Router();
const {createGroup, deleteGroup, removeMember, leaveGroup, joinGroup, renameGroup} = require('../controllers/groupController')
const authenticateUser = require('../middlewares/authMiddleware');
const userModel = require('../models/User');
const groupModel = require('../models/Group');

// Basic route
router.get('/', (req, res) => res.send('Group routes working'));

router.get('/all-groups', authenticateUser, async (req, res) => {
    try {
        const userId = req.user._id;
        let groups = await groupModel.find({})
        if (!groups) {
            return res.status(404).json({ message: "Groups not found" });
        }
        const groupsWithMembership = groups.map(group => ({
            ...group.toObject(),
            isMember: group.members.some(member => member._id.toString() === userId.toString())
        }));
        res.status(200).json({ groupsWithMembership });
    } catch (error) {
        console.error("Error fetching Groups:", error.message);
        res.status(500).json({ error: "Server error, please try again later" });
    }
});

router.post('/create-group', authenticateUser, createGroup)

// middleware to check for admin
const isAdmin = async (req, res, next) => {
    const  groupId  = req.params.id;
    loggedInUser = req.user;

    const group = await groupModel.findById(groupId)
    if (!group) return res.status(404).json({ message: "Group not found" });
  
      if (group.admin.toString() !== loggedInUser._id.toString()) {
        return res.status(403).json({ message: "Only the admin can perform this action" });
    }

    next();
}

router.delete('/delete-group/:id', authenticateUser, isAdmin, deleteGroup)

router.post('/join-group/:id', authenticateUser, joinGroup)

router.post('/leave-group/:id', authenticateUser, leaveGroup)

router.put('/rename-group/:id', authenticateUser, renameGroup)

router.post('/remove-member/:id', authenticateUser, removeMember)

router.get('/get-members/:id', authenticateUser, async (req, res) => {
    try {
        const groupId = req.params.id;

        const group = await groupModel.findById(groupId).populate('members');

        if (!group) {
            throw new Error('Group not found', groupId);
        }

        // Extract the members array
          const members = group.members.filter(member => member._id.toString());

        res.status(200).json({ members });
    } catch (error) {
        console.error("Error fetching members:", error.message);
        res.status(500).json({ error: "Server error, please try again later" });
    }
})







module.exports = router;
