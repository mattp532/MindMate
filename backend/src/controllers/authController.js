const userService = require('../services/userService');

// Sign in or sign up: use Firebase token info to create or get user
exports.signInOrSignUp = async (req, res) => {
  try {
    // req.user comes from authenticate middleware (Firebase token decoded)
    const firebaseUser = req.user;
    const user = await userService.getOrCreateUser(firebaseUser);
    res.status(200).json(user);
  } catch (err) {
    console.error('Error in signInOrSignUp:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user profile details
exports.getUserProfile = async (req, res) => {
  try {
    const firebaseUser = req.user;
    const user = await userService.getUserProfile(firebaseUser.uid);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Error getting user profile:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update user profile details
exports.updateUserProfile = async (req, res) => {
  try {
    const firebaseUser = req.user;
    const profileData = req.body;
    const updatedUser = await userService.updateUserProfile(firebaseUser.uid, profileData);
    res.json(updatedUser);
  } catch (err) {
    console.error('Error updating user profile:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
