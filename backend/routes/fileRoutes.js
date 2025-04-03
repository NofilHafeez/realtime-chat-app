const express = require('express');
const router = express.Router();
const authenticateUser = require('../middlewares/authMiddleware');
const fileModel = require('../models/File');
const uploadSingle = require('../middlewares/uploadMiddleware');
const folderModel = require('../models/Folder');


// Basic route
router.get('/', (req, res) => res.send('file routes working'));

router.get('/get-files/:id', authenticateUser, async (req, res) => {
    try {
        const folderId = req.params.id;
        
        // Find all files in the folder
        let folder = await folderModel.findById(folderId).populate("files", "fileUrl");

        res.status(200).json({ files: folder.files });
    } catch (error) {
        console.error("Error fetching files:", error.message);
        res.status(500).json({ error: "Server error, please try again later" });
    }
});

router.post('/upload-file', authenticateUser, uploadSingle, async (req, res) => {
    try {
        const userId = req.user._id;
        const { folderId } = req.body;  // Use a more descriptive variable name

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const folder = await folderModel.findById(folderId);
        if (!folder) {
            return res.status(404).json({ message: "Folder not found" });
        }


        // Create a new file entry
        const file = await fileModel.create({
            fileUrl: req.file.path,
            uploadedBy: userId,
            folder: folderId
        });

        // Update the folder to add the new file reference
        await folderModel.findByIdAndUpdate(folderId, { 
            $push: { files: file._id } 
        });

        res.status(200).json({ message: "File uploaded successfully", fileUrl: file.fileUrl, folder:file.folder });

    } catch (error) {
        console.error("Error uploading file:", error.message);
        res.status(500).json({ error: "Error uploading file, please try again later" });
    }
});


router.delete('/delete-file', authenticateUser, async (req, res) => {
    try {
        const {fileId} = req.body;
        const userId = req.user._id;

        const file = await fileModel.findOneAndDelete({ _id: fileId, uploadedBy: userId });
        
        if (!file) {
            return res.status(404).json({ message: "File not found or already deleted" });
        }

        res.status(200).json({ message: "file deleted successfully", file });
    } catch (error) {
        console.error("Error deleted file:", error.message);
        res.status(500).json({ error: "Error deleted file, please try again later" });
    }
});

module.exports = router;
