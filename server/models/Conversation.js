const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  members: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    required: true
  },
  isGroup: {
    type: Boolean,
    default: false
  },
  name: {
    type: String, // Only for groups
    default: ""
  },
  admins: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Only for groups
    default: []
  },
  groupAvatar: {
    type: String,
    default: ""
  }
}, { timestamps: true });

module.exports = mongoose.model('Conversation', ConversationSchema);
