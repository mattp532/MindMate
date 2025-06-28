const express = require('express');
const router = express.Router();

const authenticate = require('../middlewares/authenticate');
const { getOrCreateUser} = require('../controllers/userController');

router.get('/user', authenticate, getOrCreateUser);

module.exports = router;