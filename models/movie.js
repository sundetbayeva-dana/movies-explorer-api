const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
    validate: validator.isNumeric,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: validator.isURL,
  },
  trailer: {
    type: String,
    required: true,
    validate: validator.isURL,
  },
  thumbnail: {
    type: String,
    required: true,
    validate: validator.isURL,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: String,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
    validate: {
      validator(val) {
        return validator.isAlphanumeric(val, 'ru-RU', { ignore: '-' });
      },
    },
  },
  nameEN: {
    type: String,
    required: true,
    validate: {
      validator(val) {
        return validator.isAlphanumeric(val, 'en-US', { ignore: '-\'' });
      },
    },
  },
});

module.exports = mongoose.model('movie', movieSchema);
