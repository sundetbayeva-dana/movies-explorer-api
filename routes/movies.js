const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  getOwnSavedMovies, createMovie, deleteMovie,
} = require('../controllers/movies');
const {
  validateURL, validateNumber,
} = require('../utils/validate');

router.get('/api/movies', getOwnSavedMovies);
router.post('/api/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().integer().required(),
    year: Joi.string().required().custom(validateNumber),
    description: Joi.string().required(),
    image: Joi.string().required().custom(validateURL),
    trailer: Joi.string().required().custom(validateURL),
    thumbnail: Joi.string().required().custom(validateURL),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    movieId: Joi.number().integer().required(),
  }),
}), createMovie);
router.delete('/api/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().alphanum().length(24).hex(),
  }),
}), deleteMovie);

module.exports = router;
