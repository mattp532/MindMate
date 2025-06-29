const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authenticate = require('../middlewares/authenticate');

// All chat routes require authentication
router.use(authenticate);

// Get all users (for matching/discovery)
router.get('/users', chatController.getAllUsers);

// Get user's matches
router.get('/matches', chatController.getUserMatches);

// Get messages for a specific match
router.get('/matches/:matchId/messages', chatController.getMatchMessages);

// Create a new match
router.post('/matches', chatController.createMatch);

// Send a message
router.post('/matches/:matchId/messages', chatController.sendMessage);

// Get user's conversations (matches with recent messages)
router.get('/conversations', chatController.getConversations);

module.exports = router; 