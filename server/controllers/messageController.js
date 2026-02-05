const Message = require('../models/Message');
const demoData = require('../demoData');

exports.addMessage = async (req, res) => {
  const newMessage = new Message(req.body);
  try {
    // Try MongoDB first
    try {
      const savedMessage = await newMessage.save();
      res.status(200).json(savedMessage);
    } catch (mongoErr) {
      // Fallback to demo mode
      const msg = {
        _id: Date.now().toString(),
        ...req.body,
        createdAt: new Date()
      };
      demoData.messages.push(msg);
      res.status(200).json(msg);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getMessages = async (req, res) => {
  try {
    // Get messages between two users or in a conversation
    // Ideally we filter by sender and receiver
    const { senderId, receiverId } = req.params;
    
    // Try MongoDB first
    try {
      const messages = await Message.find({
        $or: [
          { sender: senderId, receiver: receiverId },
          { sender: receiverId, receiver: senderId }
        ]
      });
      res.status(200).json(messages);
    } catch (mongoErr) {
      // Fallback to demo mode
      const messages = demoData.messages.filter(m =>
        (m.sender === senderId && m.receiver === receiverId) ||
        (m.sender === receiverId && m.receiver === senderId)
      );
      res.status(200).json(messages);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
