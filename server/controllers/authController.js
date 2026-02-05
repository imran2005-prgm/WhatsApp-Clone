const User = require('../models/User');
const Otp = require('../models/Otp');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const demoData = require('../demoData');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Try MongoDB first
    try {
      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'User already exists' });

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const newUser = new User({
        username,
        email,
        password: hashedPassword
      });

      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } catch (mongoErr) {
      // Fallback to demo mode
      const demoUser = demoData.users.find(u => u.email === email);
      if (demoUser) return res.status(400).json({ message: 'User already exists' });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        _id: Date.now().toString(),
        username,
        email,
        password: hashedPassword,
        avatar: ""
      };
      demoData.users.push(newUser);
      res.status(201).json(newUser);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Try MongoDB first
    try {
      // Check user
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found' });

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

      // Generate token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1d' });

      const { password: _, ...userData } = user._doc;

      res.status(200).json({ user: userData, token });
    } catch (mongoErr) {
      // Fallback to demo mode
      const user = demoData.users.find(u => u.email === email);
      if (!user) return res.status(404).json({ message: 'User not found' });

      // Check password (for demo, any password works)
      const isMatch = await bcrypt.compare(password, user.password);
      // For demo: allow any password
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1d' });

      const { password: _, ...userData } = user;
      res.status(200).json({ user: userData, token });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.sendOtp = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) return res.status(400).json({ message: "Phone number required" });

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save or update OTP
    await Otp.findOneAndUpdate(
      { phoneNumber },
      { otp, createdAt: Date.now() },
      { upsert: true, new: true }
    );

    // console.log for "sending"
    console.log(`OTP for ${phoneNumber}: ${otp}`);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    
    // Validate OTP
    const validOtp = await Otp.findOne({ phoneNumber, otp });
    if (!validOtp) return res.status(400).json({ message: "Invalid or expired OTP" });

    // Find or create user
    let user = await User.findOne({ phoneNumber });
    let isNewUser = false;

    if (!user) {
      // Create new user with placeholder data
      const suffix = phoneNumber.slice(-4);
      const newUser = new User({
        username: `user_${phoneNumber}`,
        email: `${phoneNumber}@phone.com`,
        password: await bcrypt.hash(Math.random().toString(36), 10), // Random password
        phoneNumber
      });
      user = await newUser.save();
      isNewUser = true;
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1d' });
    const { password: _, ...userData } = user._doc;

    // Delete used OTP
    await Otp.deleteOne({ _id: validOtp._id });

    res.status(200).json({ user: userData, token, isNewUser });

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};
