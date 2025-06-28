const userService = require('../services/userService');

exports.signUp = async (req, res) => {
  try {
    // req.user from authenticate middleware (firebase decoded token)
    // req.body for extra profile fields (name, bio, etc)
    const user = await userService.createUser(req.user, req.body);
    res.status(201).json(user);
  } catch (err) {
    if (err.statusCode === 409) {
      return res.status(409).json({ error: err.message }); // User exists
    }
    console.error('SignUp error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.signIn = async (req, res) => {
  try {
    const user = await userService.getUser(req.user);
    if (!user) {
      return res.status(404).json({ error: 'User not found. Please sign up.' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error('SignIn error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
