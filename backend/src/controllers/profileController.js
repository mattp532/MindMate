// controllers/profileController.js
const profileService = require('../services/profileService');

exports.getProfile = async (req, res) => {
  try {
    const user = await profileService.getProfile(req.user.uid);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updatedUser = await profileService.updateProfile(req.user.uid, req.body);
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};
