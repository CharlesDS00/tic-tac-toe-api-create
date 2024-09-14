const mongoose = require('mongoose');

module.exports.connect = () => {
  mongoose.connect('mongodb://localhost:27017/tictactoe', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
};
