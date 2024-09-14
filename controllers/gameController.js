const Game = require('../models/game');

exports.createGame = async (req, res) => {
  try {
    const game = new Game({ players: [req.user.id], currentPlayer: req.user.id });
    await game.save();
    res.json(game);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.makeMove = async (req, res) => {
};

exports.getGame = async (req, res) => {
  const game = await Game.findById(req.params.gameId);
  res.json(game);
};
