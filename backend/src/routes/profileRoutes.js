// routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const { getProfile, updateProfile, updateSkillVerification, getAllSkills, removeSkill, removeInterest } = require('../controllers/profileController');

router.get('/skills', getAllSkills); // Public endpoint to get all skills
router.get('/', authenticate, getProfile);
router.put('/', authenticate, updateProfile);
router.put('/skill-verification', authenticate, updateSkillVerification);
router.delete('/skills', authenticate, removeSkill);
router.delete('/interests', authenticate, removeInterest);

module.exports = router;
