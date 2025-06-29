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
    console.log('Profile update request for user:', req.user.uid);
    console.log('Profile data received:', req.body);
    
    const updatedUser = await profileService.updateProfile(req.user.uid, req.body);
    res.status(200).json(updatedUser);
    console.log("updated user profile succesfully")
  } catch (err) {
    console.error('Profile update error details:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ error: 'Failed to update profile', details: err.message });
  }
};

exports.updateSkillVerification = async (req, res) => {
  try {
    const { skillName, verified, score } = req.body;
    
    if (!skillName || typeof verified !== 'boolean') {
      return res.status(400).json({ error: 'Invalid request data' });
    }
    
    await profileService.updateSkillVerification(req.user.uid, skillName, verified, score);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error updating skill verification:', err);
    res.status(500).json({ error: 'Failed to update skill verification' });
  }
};
