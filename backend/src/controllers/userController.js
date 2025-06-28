const userService = require('../services/userService');

exports.getOrCreateUser = async (req, res) => {
  try {
    // req.user comes from your authenticate middleware after verifying Firebase token
    const user = await userService.getOrCreateUser(req.user);
    res.status(200).json(user);
  } catch (err) {
    console.error('Error getting or creating user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
