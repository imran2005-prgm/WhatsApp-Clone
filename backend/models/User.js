const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true, unique: true, sparse: true },
    phoneSuffix: { type: String, unique: false },
    username: { type: String},
    email: { type: String, lowercase: true, match: [/.+@.+\..+/, "Please enter a valid email address"] },
    emailOtp: { type: String },
    emailOtpExpiry: { type: Date },
    profilePicture: { type: String },
    about: { type: String },
    status: { type: String },
    lastSeen: { type: Date },
    isOnline: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    agreed: { type: Boolean, default: false },
    
    

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);