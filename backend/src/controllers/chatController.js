const chatService = require('../services/chatService');

// Get all users (excluding current user)
exports.getAllUsers = async (req, res) => {
  try {
    const currentUserId = req.user.uid;
    const users = await chatService.getAllUsers(currentUserId);
    res.status(200).json(users);
  } catch (err) {
    console.error('Error getting all users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user's matches
exports.getUserMatches = async (req, res) => {
  try {
    const currentUserId = req.user.uid;
    const matches = await chatService.getUserMatches(currentUserId);
    res.status(200).json(matches);
  } catch (err) {
    console.error('Error getting user matches:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get messages for a specific match
exports.getMatchMessages = async (req, res) => {
  try {
    const { matchId } = req.params;
    const currentUserId = req.user.uid;
    
    // Verify user is part of this match
    const isPartOfMatch = await chatService.isUserInMatch(currentUserId, matchId);
    if (!isPartOfMatch) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const messages = await chatService.getMatchMessages(matchId);
    res.status(200).json(messages);
  } catch (err) {
    console.error('Error getting match messages:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new match
exports.createMatch = async (req, res) => {
  try {
    const currentUserId = req.user.uid;
    const { otherUserId } = req.body;
    
    console.log('createMatch called with:', { currentUserId, otherUserId });
    
    if (!otherUserId) {
      return res.status(400).json({ error: 'otherUserId is required' });
    }
    
    const match = await chatService.createMatch(currentUserId, otherUserId);
    console.log('Match created successfully:', match);
    res.status(201).json(match);
  } catch (err) {
    console.error('Error creating match:', err);
    if (err.message === 'Match already exists') {
      return res.status(409).json({ error: err.message });
    }
    if (err.message.includes('not found in database')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { content } = req.body;
    const currentUserId = req.user.uid;
    
    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Message content is required' });
    }
    
    // Verify user is part of this match
    const isPartOfMatch = await chatService.isUserInMatch(currentUserId, matchId);
    if (!isPartOfMatch) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const message = await chatService.sendMessage(matchId, currentUserId, content);
    res.status(201).json(message);
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user's conversations (matches with recent messages)
exports.getConversations = async (req, res) => {
  try {
    const currentUserId = req.user.uid;
    const conversations = await chatService.getConversations(currentUserId);
    res.status(200).json(conversations);
  } catch (err) {
    console.error('Error getting conversations:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 