// routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const { getProfile, updateProfile } = require('../controllers/profileController');

router.get('/', authenticate, getProfile);
router.put('/', authenticate, updateProfile);

module.exports = router;
