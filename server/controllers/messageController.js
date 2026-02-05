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
    const { conversationId } = req.params;
    
    // Try MongoDB first
    try {
      const messages = await Message.find({
        conversationId: conversationId
      });
      res.status(200).json(messages);
    } catch (mongoErr) {
      // Fallback to demo mode (not fully supported for convoId transition yet)
       res.status(500).json({message: "Demo mode not supported for conversations yet"});
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
