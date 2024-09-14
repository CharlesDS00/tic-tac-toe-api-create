const express = require('express');
const router = express.Router();

let games = [];

router.post('/', (req, res) => {
  const { player1, player2 } = req.body;

  if (!player1 || !player2) {
    return res.status(400).json({ message: 'Both players are required' });
  }

  const game = {
    id: games.length + 1,
    player1,
    player2,
    status: 'in progress'
  };

  games.push(game);

  res.status(201).json({ message: 'Game created successfully', game });
});

router.get('/', (req, res) => {
  res.status(200).json(games);
});

router.get('/:id', (req, res) => {
  const game = games.find(g => g.id == req.params.id);

  if (!game) {
    return res.status(404).json({ message: 'Game not found' });
  }

  res.status(200).json(game);
});

router.put('/:id', (req, res) => {
  const game = games.find(g => g.id == req.params.id);

  if (!game) {
    return res.status(404).json({ message: 'Game not found' });
  }

  const { status } = req.body;
  if (status) {
    game.status = status;
  }

  res.status(200).json({ message: 'Game updated successfully', game });
});

router.delete('/:id', (req, res) => {
  const gameIndex = games.findIndex(g => g.id == req.params.id);

  if (gameIndex === -1) {
    return res.status(404).json({ message: 'Game not found' });
  }

  games.splice(gameIndex, 1);
  res.status(200).json({ message: 'Game deleted successfully' });
});

module.exports = router;
