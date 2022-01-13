const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

const getAllSavedMovies = (req, res, next) => {
  Movie.find({ owned: req.user._id })
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Карточек нет');
      }
      if (movie.owner === req.user._id) {
        res.status(200).send({ data: movie });
      } else {
        throw new ForbiddenError('Карта не принадлежит пользователю');
      }
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
    .then((movie) => res.status(200).send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные в метод создания фильма'));
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
        throw new NotFoundError('Фильм не найден');
      }
      if (movie.owner.toString() === req.user._id) {
        Movie.findByIdAndRemove(movieId)
          .then(() => {
            res.status(200).send({ message: 'Фильм удален' });
          })
          .catch(next);
      } else {
        throw new ForbiddenError('Попытка удалить фильм в чужом аккаунте');
      }
    })
    .catch(next);
};

module.exports = {
  getAllSavedMovies,
  createMovie,
  deleteMovie,
};
