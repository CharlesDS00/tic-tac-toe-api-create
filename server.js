const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/game');

const app = express();

app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/games', gameRoutes);

const db = require('./config/db');
db.connect();

app.listen(3000, () => console.log('Server running on port 3000'));
