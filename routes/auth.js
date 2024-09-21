const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: res.__('registration.missing_fields') }); 
  }

  const userExists = await User.findOne({ username });
  if (userExists) {
    return res.status(400).json({ message: res.__('registration.username_taken') }); 
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({ username, password: hashedPassword });
  await user.save();

  res.status(201).json({ 
    message: res.__('registration.success'), 
    user: { id: user._id, username: user.username }
  });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: res.__('login.missing_fields') }); 
  }

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: res.__('login.invalid_credentials') }); 
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ message: res.__('login.invalid_credentials') }); 
  }

  res.status(200).json({ 
    message: res.__('login.success'), 
    user: { id: user._id, username: user.username }
  });
});

module.exports = router;
