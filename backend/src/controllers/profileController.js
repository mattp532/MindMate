// controllers/profileController.js
const profileService = require('../services/profileService');

exports.getAllSkills = async (req, res) => {
  try {
    const skills = await profileService.getAllSkills();
    res.status(200).json(skills);
  } catch (err) {
    console.error('Error fetching skills:', err);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
};

exports.getSkillDistribution = async (req, res) => {
  try {
    const distribution = await profileService.getSkillDistribution();
    res.status(200).json(distribution);
  } catch (err) {
    console.error('Error fetching skill distribution:', err);
    res.status(500).json({ error: 'Failed to fetch skill distribution' });
  }
};

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
    console.log("updated user profile succesfully")
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
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

exports.removeSkill = async (req, res) => {
  try {
    const { skill } = req.body;
    
    if (!skill) {
      return res.status(400).json({ error: 'Skill name is required' });
    }
    
    await profileService.removeSkill(req.user.uid, skill);
    res.status(200).json({ success: true, message: `Skill "${skill}" removed successfully` });
  } catch (err) {
    console.error('Error removing skill:', err);
    res.status(500).json({ error: 'Failed to remove skill' });
  }
};

exports.removeInterest = async (req, res) => {
  try {
    const { interest } = req.body;
    
    if (!interest) {
      return res.status(400).json({ error: 'Interest name is required' });
    }
    
    await profileService.removeInterest(req.user.uid, interest);
    res.status(200).json({ success: true, message: `Interest "${interest}" removed successfully` });
  } catch (err) {
    console.error('Error removing interest:', err);
    res.status(500).json({ error: 'Failed to remove interest' });
  }
};
