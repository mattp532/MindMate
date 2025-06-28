const express = require('express');
const router = express.Router();

const authenticate = require('../middlewares/authenticate');
const userController = require('../controllers/userController');

// Sign up or sign in: verify Firebase token and create basic user if new
router.post('/auth', authenticate, userController.signInOrSignUp);

// Get user profile (requires auth)
router.get('/profile', authenticate, userController.getUserProfile);

// Update user profile (requires auth)
router.put('/profile', authenticate, userController.updateUserProfile);

module.exports = router;
