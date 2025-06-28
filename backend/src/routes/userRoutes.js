const express = require('express');
const router = express.Router();

const authenticate = require('../middlewares/authenticate');
const userController = require('../controllers/userController');

// Sign up route - creates a new user
router.post('/signup', authenticate, userController.signUp);

// Sign in route - get existing user
router.post('/signin', authenticate, userController.signIn);

module.exports = router;
