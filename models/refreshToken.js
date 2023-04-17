const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const refreshTokenSchema = new Schema({
  user_id: {
    type: String,
    required: true,
    unique: true
  },
  refreshToken: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);