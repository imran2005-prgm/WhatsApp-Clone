const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation"
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    content: {type: String,required: true},
    imageorVideo: {type: String,required: true},
    contentType: {type: String,required: true},
    
    
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);
