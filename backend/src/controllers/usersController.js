const userService = require('../services/userService');

exports.signup = async (req, res) => {
  try {
    const firebaseUser = req.user;  // assume auth middleware decoded token and put user here
    const user = await userService.createUser(firebaseUser);
    res.status(201).json(user);
    console.log("User signed in succesfully")
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.signin = async (req, res) => {
  try {
    const firebaseUser = req.user; 
    const user = await userService.getUser(firebaseUser);
    if (!user) {
      return res.status(404).json({ error: 'User not found. Please sign up first.' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
