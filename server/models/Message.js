const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
