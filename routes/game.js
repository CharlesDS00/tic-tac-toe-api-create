const express = require('express');
const router = express.Router();
const { createGame, makeMove, getGame } = require('../controllers/gameController');
const { authenticateJWT } = require('../middleware/authMiddleware');

router.post('/', authenticateJWT, createGame);
router.post('/:gameId/move', authenticateJWT, makeMove);
router.get('/:gameId', authenticateJWT, getGame);

module.exports = router;
