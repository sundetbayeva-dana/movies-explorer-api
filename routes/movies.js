const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  getAllSavedMovies, createMovie, deleteMovie,
} = require('../controllers/movies');
const {
  validateURL, validateNumber,
} = require('../utils/validate');

router.get('/movies', getAllSavedMovies);
router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().integer().required(),
    year: Joi.string().required().custom(validateNumber),
    description: Joi.string().required(),
    image: Joi.string().required().custom(validateURL),
    trailer: Joi.string().required().custom(validateURL),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().custom(validateURL),
    movieId: Joi.string().required(),
  }),
}), createMovie);
router.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().alphanum().length(24).hex(),
  }),
}), deleteMovie);

module.exports = router;
