const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');
const UnathorizedError = require('../errors/unathorized-err');
const { verifyConst } = require('../utils/const');

const { NODE_ENV, JWT_SECRET } = process.env;

const getCurrentUserInformation = (req, res, next) => {
  User.findById(req.users._id)
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch(next);
};

const updateUserInformation = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные в метод обновления профиля пользователя'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      const newUser = User.create({ email, password: hash, name });
      return newUser;
    })
    .then((user) => {
      res.status(200).send({
        data: {
          email: user.email, name: user.name,
        },
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('При регистрации указан email, который уже существует на сервере'));
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные в метод создания пользователя'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : verifyConst, { expiresIn: '7d' });
      res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true });
      res.status(200).send({
        data: {
          email: user.email, name: user.name,
        },
      });
    })
    .catch(() => {
      next(new UnathorizedError('Неправильные почта или пароль'));
    });
};

module.exports = {
  getCurrentUserInformation,
  updateUserInformation,
  createUser,
  login,
};
