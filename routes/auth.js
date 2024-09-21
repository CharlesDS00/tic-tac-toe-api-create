const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Game = require('../models/game'); 
const { Builder } = require('xml2js');
const router = express.Router();


router.post('/v1/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: res.__('registration_error') });
    }

    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: res.__('registration_email_in_use') });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();

    const response = {
      message: res.__('registration_success'),
      user: {
        id: user._id,
        username: user.username
      },
      links: {
        login: {
          href: 'http://localhost:3000/api/v1/login',
          method: 'POST',
          description: res.__('login_link_description') 
        },
        createGame: {
          href: 'http://localhost:3000/api/v1/game/create',
          method: 'POST',
          description: res.__('create_game_link_description')
        }
      }
    };

    if (req.headers['accept'] === 'application/xml') {
      const builder = new Builder();
      const xml = builder.buildObject(response);
      res.set('Content-Type', 'application/xml');
      res.status(200).send(xml);
    } else {
      res.status(201).json(response);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: res.__('registration_error') });
  }
});


router.post('/v1/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: res.__('login_error') });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: res.__('invalid_credentials') });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: res.__('invalid_credentials') });
    }

    res.status(200).json({
      message: res.__('login_success'),
      user: {
        id: user._id,
        username: user.username
      },
      links: {
        createGame: {
          href: 'http://localhost:3000/api/v1/game/create',
          method: 'POST',
          description: res.__('create_game_link_description')
        },
        viewProfile: {
          href: `http://localhost:3000/api/v1/users/${user._id}`,
          method: 'GET',
          description: res.__('view_profile_link_description')
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: res.__('login_error') });
  }
});


router.post('/v1/game/move', async (req, res) => {
  const { userId, gameId, position } = req.body;

  try {
    const game = await Game.findById(gameId);

    if (!game) {
      return res.status(404).json({ message: 'Game not found!' });
    }

    if (game.currentPlayer.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not your turn!' });
    }

    if (position < 0 || position > 8 || game.board[position] !== null) {
      return res.status(400).json({ message: 'Invalid move!' });
    }

    game.board[position] = game.currentPlayerSymbol;

    if (checkWin(game.board, game.currentPlayerSymbol)) {
      game.winner = game.currentPlayer;
    }

    game.currentPlayer = getNextPlayer(game);
    game.currentPlayerSymbol = game.currentPlayerSymbol === 'X' ? 'O' : 'X';
    await game.save();

    res.status(200).json({ message: 'Move successful!', game });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing the move.' });
  }
});


function checkWin(board, symbol) {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  return winningCombinations.some(combination => 
    combination.every(index => board[index] === symbol)
  );
}


function getNextPlayer(game) {
  const players = game.players;
  const currentIndex = players.indexOf(game.currentPlayer.toString());
  const nextIndex = (currentIndex + 1) % players.length;
  return players[nextIndex];
}

module.exports = router;
