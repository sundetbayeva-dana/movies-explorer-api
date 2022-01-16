const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');
const {
  notFoundCardsMessage, badRequestMessage, notFoundMovieMessage, forbiddenMessage,
} = require('../utils/error-const');
const { resDeletedMovie } = require('../utils/res-const');

const getOwnSavedMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movie) => {
      if (movie.length === 0) {
        throw new NotFoundError(notFoundCardsMessage);
      }
      res.send({ data: movie });
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image,
    trailer, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(badRequestMessage));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(notFoundMovieMessage);
      }
      if (movie.owner.toString() === req.user._id) {
        Movie.findByIdAndRemove(movieId)
          .then(() => {
            res.send({ message: resDeletedMovie });
          })
          .catch(next);
      } else {
        throw new ForbiddenError(forbiddenMessage);
      }
    })
    .catch(next);
};

module.exports = {
  getOwnSavedMovies,
  createMovie,
  deleteMovie,
};
