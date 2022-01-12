const jwt = require('jsonwebtoken');
const UnathorizedError = require('../errors/unathorized-err');

// const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, 'secretKey');
  } catch (err) {
    throw new UnathorizedError('Необходима авторизация');
  }
  req.user = payload;
  next();
  return req.user;
};
