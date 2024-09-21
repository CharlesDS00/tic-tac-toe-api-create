const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const hateoasLinker = require('express-hateoas-links');
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/game');
const { notFound, errorHandler } = require('./middleware/errorMiddleware'); 

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(hateoasLinker);

const connectDB = require('./config/db');
connectDB();

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/games', gameRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
