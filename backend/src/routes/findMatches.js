const express = require('express');
const router = express.Router();
const matchesController = require('../controllers/matchesController');
const authenticate = require('../middlewares/authenticate');

router.post('/matches', authenticate, matchesController.getMatches);

module.exports = router;
