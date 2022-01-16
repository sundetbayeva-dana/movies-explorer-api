const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const { login } = require('../controllers/users');

router.post('/api/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

module.exports = router;
