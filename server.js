const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/game');
const i18n = require('i18n');
const path = require('path');

const app = express();

i18n.configure({
    locales: ['en', 'fr'], 
    directory: path.join(__dirname, 'locales'), 
    defaultLocale: 'en',
    queryParameter: 'lang', 
    autoReload: true, 
    updateFiles: false, 
    objectNotation: true 
});
  
app.use(i18n.init);

app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/games', gameRoutes);

const db = require('./config/db');
db.connect();

app.listen(3000, () => console.log('Server running on port 3000'));
