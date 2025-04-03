const userModel = require('../models/User');
const groupModel = require('../models/Group');


module.exports.createGroup = async (req, res) => {
  try {
      const { groupName } = req.body;
      const loggedInUser = req.user;

      if (!groupName) {
          return res.status(400).json({ error: "All fields are required" });
      }

      let existedGroup = await groupModel.findOne({ groupName });

      if (existedGroup) {
          return res.status(400).json({ error: "This group name already exists" });
      }

      const createdGroup = await groupModel.create({ 
          groupName,
          admin: loggedInUser._id,
          members: [loggedInUser._id]
      });

      res.status(201).json({
          success: "Group created successfully!",
          group: createdGroup
      });

  } catch (err) {
      res.status(500).json({ error: "Error creating group, please try again later", details: err.message });
  }
};

module.exports.deleteGroup = async (req, res) => {
  try {
      const groupId = req.params.id;

      const group = await groupModel.findOneAndDelete({_id: groupId});

      
        res.status(201).json({ success: ["delete Successful!"] });
  } catch (err) {
      res.status(500).json({ flash: ["Error Deleting Group, please try again later"] });
  }
};

module.exports.removeMember = async (req, res) => {
    try {
        const { groupId, memberId } = req.body;
    
        await groupModel.findByIdAndUpdate(groupId, {
          $pull: { members: memberId },
        });
    
        res.status(200).json({ success: true, message: "Member removed" });
      } catch (error) {
        res.status(500).json({ success: false, message: "Error removing member" });
      }
};

module.exports.renameGroup = async (req, res) => {
  try {
      const {  newGroupName  } = req.body;
      const groupId = req.params.id;

      if (!groupId || !newGroupName ) {
          return res.status(400).json({ success: false, message: "All fields are required" });
      }

      const updatedGroup = await groupModel.findByIdAndUpdate(
          groupId, 
          {  groupName: newGroupName  }, 
          { new: true } 
      );

      if (!updatedGroup) {
          return res.status(404).json({ success: false, message: "Group not found" });
      }

      res.status(200).json({ success: true, message: "Group renamed", group: updatedGroup.groupName });
  } catch (error) {
      console.error("Error renaming group:", error);
      res.status(500).json({ success: false, message: "Error renaming group" });
  }
};

  module.exports.joinGroup = async (req, res) => {
    try {
      const groupId = req.params.id;
      const loggedInUser  = req.user._id;
  
      // Check if loggedInUser exists
      if (!loggedInUser) {
        return res.status(400).json({ success: false, message: "User ID is required" });
      }
  
      // Update group and return the updated document
      const group = await groupModel.findByIdAndUpdate(
        groupId,
        { $addToSet: { members: loggedInUser } }, // Ensures no duplicates
        { new: true } // Return the updated group
      );
  
      if (!group) {
        return res.status(404).json({ success: false, message: "Group not found" });
      }
  
      res.status(200).json({ success: true, message: "Joined group", group: group.members });
    } catch (error) {
      console.error("Error joining group:", error);
      res.status(500).json({ success: false, message: "Error joining group" });
    }
  };
  
module.exports.leaveGroup = async (req, res) => {
    try {
      const groupId = req.params.id;
      const loggedInUser = req.user._id;

      const group = await groupModel.findById(groupId);
  
      if (!group) return res.status(404).json({ message: "Group not found" });
  
      if (group.admin.toString() === loggedInUser) {
        return res.status(400).json({ message: "Admin cannot leave the group" });
      }
  
      await groupModel.findByIdAndUpdate(groupId, {
        $pull: { members: loggedInUser },
      });
  
      res.status(200).json({ success: true, message: "Left group" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error leaving group" });
    }
  };

module.exports.removeMember = async (req, res) => {
    try {
      const removeUserId = req.params.id;
      const {groupId} = req.body;
      const loggedInUser = req.user._id;

      const group = await groupModel.findById(groupId);
  
      if (!group) return res.status(404).json({ message: "Group not found" });
  
      if (group.admin.toString() !== loggedInUser.toString()) {
        return res.status(403).json({ message: "Only the admin can remove members" });
    }

    if (!group.members.includes(removeUserId)) {
        return res.status(400).json({ message: "User is not a member of this group" });
    }
      await groupModel.findByIdAndUpdate(groupId, {
        $pull: { members: removeUserId },
      });
  
      res.status(200).json({ success: true, message: "removed from group" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error removing from the group" });
    }
  };  