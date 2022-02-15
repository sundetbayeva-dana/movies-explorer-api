const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');
const UnathorizedError = require('../errors/unathorized-err');
const { VERIFY_CONST } = require('../utils/configs');
const {
  notFoundUserMessage, badRequestMessage, conflictMessage, unathorizedMessage,
} = require('../utils/error-const');

const { NODE_ENV, JWT_SECRET } = process.env;

const getCurrentUserInformation = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send({
        data: {
          email: user.email, name: user.name,
        },
      });
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
        throw new NotFoundError(notFoundUserMessage);
      }
      res.send({
        data: {
          email: user.email, name: user.name,
        },
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(badRequestMessage));
      } else if (err.code === 11000) {
        next(new ConflictError(conflictMessage));
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
      res.send({
        data: {
          email: user.email, name: user.name,
        },
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(conflictMessage));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(badRequestMessage));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : VERIFY_CONST, { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: true,
        // sameSite: 'None', secure: true,
      });
      res.send({
        data: {
          email: user.email, name: user.name,
        },
      });
    })
    .catch(() => {
      next(new UnathorizedError(unathorizedMessage));
    });
};

module.exports = {
  getCurrentUserInformation,
  updateUserInformation,
  createUser,
  login,
};
