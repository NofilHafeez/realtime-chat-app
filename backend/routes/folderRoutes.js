const express = require('express');
const router = express.Router();
const authenticateUser = require('../middlewares/authMiddleware');          
const folderModel = require('../models/Folder');



// Basic route
router.get('/', (req, res) => res.send('folder routes working'));

router.get('/get-folders', authenticateUser, async (req, res) => {
    try {
        let loggedInUser = req.user;

        let folders = await folderModel.find({createdBy: loggedInUser._id});

        if (!folders.length) {
            return res.status(404).json({ message: "folder not found" });
        }

        res.status(200).json({ folders });

    } catch (error) {
        console.error("Error fetching folder:", error.message);
        res.status(500).json({ error: "Server error, please try again later" });
    }
}); 

router.post('/create-folder', authenticateUser, async (req, res) => {
    try {
        const {folderName} = req.body;
        const userId = req.user._id;

        const folder = await folderModel.create({ folderName, createdBy: userId })

        res.status(201).json({ message: "Folder created successfully", folder });
    } catch (error) {
        console.error("Error creating folder:", error.message);
        res.status(500).json({ error: "Error creating folder, please try again later" });
    }
})

router.delete('/delete-folder/:id', authenticateUser, async (req, res) => {
    try {
        const folderId = req.params.id;
        const userId = req.user._id;

        const deletedFolder = await folderModel.findOneAndDelete({createdBy: userId, _id:folderId})
        
        if (!deletedFolder) {
            return res.status(404).json({ message: "Folder not found or already deleted" });
        }

        res.status(200).json({ message: "Folder deleted successfully" });
    } catch (error) {
        console.error("Error deleting folder:", error.message);
        res.status(500).json({ error: "Error deleting folder, please try again later" });
    }
})

router.post('/rename-folder/:id', authenticateUser, async (req, res) => {
    try {
        const {folderName} = req.body;
        const folderId = req.params.id;
        
        const updatedFolder = await folderModel.findOneAndUpdate(
            { _id: folderId },
            { folderName }
        );        
        
        if (!updatedFolder) {
            return res.status(404).json({ message: "Folder not found" });
        }

        res.status(200).json({ message: "Folder renamed successfully", updatedFolder });
    } catch (error) {
        console.error("Error updating folder:", error.message);
        res.status(500).json({ error: "Error updating folder, please try again later" });
    }
})


module.exports = router;
