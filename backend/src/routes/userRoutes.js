const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const authenticate = require('../middlewares/authenticate');

router.post('/signup', authenticate, usersController.signup);
router.post('/signin', authenticate, usersController.signin);

module.exports = router;
