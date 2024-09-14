const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  board: { type: Array, default: [['', '', ''], ['', '', ''], ['', '', '']] },
  currentPlayer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'in-progress' },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
});

module.exports = mongoose.model('Game', GameSchema);
