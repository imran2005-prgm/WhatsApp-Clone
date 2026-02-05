const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  receiver: { // Deprecated, but keeping for backward compat if needed, or we can make it optional
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  text: {
    type: String,
    default: ""
  },
  fileUrl: {
    type: String,
    default: ""
  },
  type: {
    type: String,
    enum: ['text', 'image', 'file'],
    default: 'text'
  }
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);
