const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema(
  {
    name:{
        type: String,
        required: true,
      },
    createdBy: [
        {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',   
        }
    ],
    files: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
      }
    ],
  },
  { timestamps: true }
);


const Folder = mongoose.model('Folder', folderSchema);

module.exports = Folder;
