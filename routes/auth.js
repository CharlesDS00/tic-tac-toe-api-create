const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const router = express.Router();

router.post('/register', async (req, res) => {
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

    res.status(201).json({
      message: res.__('registration_success'),
      user: {
        id: user._id,
        username: user.username
      },
      links: {
        login: {
          href: 'http://localhost:3000/api/login',
          method: 'POST',
          description: res.__('login_link_description') 
        },
        createGame: {
          href: 'http://localhost:3000/api/game/create',
          method: 'POST',
          description: res.__('create_game_link_description')
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: res.__('registration_error')
    });
  }
});

router.post('/login', async (req, res) => {
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
          href: 'http://localhost:3000/api/game/create',
          method: 'POST',
          description: res.__('create_game_link_description')
        },
        viewProfile: {
          href: `http://localhost:3000/api/users/${user._id}`,
          method: 'GET',
          description: res.__('view_profile_link_description')
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: res.__('login_error')
    });
  }
});


module.exports = router;
