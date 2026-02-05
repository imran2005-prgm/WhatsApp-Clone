const Conversation = require('../models/Conversation');
const User = require('../models/User');

// Create a new conversation (1-1 or Group)
exports.createConversation = async (req, res) => {
    try {
        const { senderId, receiverId, isGroup, groupName, members } = req.body;

        if (isGroup) {
            // Group Chat Creation
            // members should be an array of user IDs excluding sender (or including? assuming excluding based on typical UI)
            // Let's assume 'members' passed from UI includes EVERYONE EXCEPT Current User, or we make sure to add senderId.
            // Safe bet: ensure senderId is in the list.
            
            const uniqueMembers = [...new Set([...members, senderId])];

            const newConversation = new Conversation({
                members: uniqueMembers,
                isGroup: true,
                name: groupName,
                admins: [senderId] // Creator is admin
            });

            const savedConversation = await newConversation.save();
            res.status(200).json(savedConversation);

        } else {
            // 1-to-1 Chat Creation
            // Check if convo exists
            const existingConversation = await Conversation.findOne({
                isGroup: false,
                members: { $all: [senderId, receiverId] }
            });

            if (existingConversation) {
                return res.status(200).json(existingConversation);
            }

            const newConversation = new Conversation({
                members: [senderId, receiverId]
            });

            const savedConversation = await newConversation.save();
            res.status(200).json(savedConversation);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get conversations for a user
exports.getConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({
            members: { $in: [req.params.userId] }
        })
        .populate('members', 'username avatar') // Populate member details
        .sort({ updatedAt: -1 });
        
        res.status(200).json(conversations);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Admin: Add Member
exports.addMember = async (req, res) => {
    try {
        const { conversationId, memberId, adminId } = req.body;
        
        const conversation = await Conversation.findById(conversationId);
        
        if (!conversation.isGroup) return res.status(400).json("Not a group");
        if (!conversation.admins.includes(adminId)) return res.status(403).json("Only admins can add members");
        
        if (!conversation.members.includes(memberId)) {
            await conversation.updateOne({ $push: { members: memberId } });
            res.status(200).json("Member added");
        } else {
            res.status(400).json("User already in group");
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// Admin: Make Admin
exports.makeAdmin = async (req, res) => {
    try {
        const { conversationId, memberId, adminId } = req.body;
        
        const conversation = await Conversation.findById(conversationId);
        
        if (!conversation.isGroup) return res.status(400).json("Not a group");
        if (!conversation.admins.includes(adminId)) return res.status(403).json("Only admins can promote members");

        if (!conversation.admins.includes(memberId)) {
            await conversation.updateOne({ $push: { admins: memberId } });
            res.status(200).json("User promoted to admin");
        } else {
            res.status(400).json("User is already admin");
        }
    } catch (err) {
        res.status(500).json(err);
    }
};
