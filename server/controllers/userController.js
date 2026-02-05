const User = require('../models/User');
const demoData = require('../demoData');

exports.getAllUsers = async (req, res) => {
  try {
    // Try MongoDB first
    try {
      const users = await User.find({}, { password: 0 }); // Exclude password
      res.status(200).json(users);
    } catch (mongoErr) {
      // Fallback to demo mode
      const users = demoData.users.map(u => {
        const { password, ...userData } = u;
        return userData;
      });
      res.status(200).json(users);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
