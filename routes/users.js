const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  getCurrentUserInformation, updateUserInformation,
} = require('../controllers/users');

router.get('/users/me', getCurrentUserInformation);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
}), updateUserInformation);

module.exports = router;
