// routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const { getProfile, updateProfile, updateSkillVerification } = require('../controllers/profileController');

router.get('/', authenticate, getProfile);
router.put('/', authenticate, updateProfile);
router.put('/skill-verification', authenticate, updateSkillVerification);

module.exports = router;
