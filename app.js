const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const helmet = require('helmet');

const { createUser, login } = require('./controllers/users');
const auth = require('./midlewares/auth');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./midlewares/logger');
const errorHandler = require('./midlewares/error-handler');
const { MONGODB_URL } = require('./utils/configs');
const limiter = require('./midlewares/rate-limit');
require('dotenv').config();

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
});

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(helmet());
app.use(limiter);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), createUser);

app.post('/api/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.use(auth);
app.use('/api/', require('./routes/index'));

app.get('/signout', (req, res) => {
  res.status(200).clearCookie('jwt').send({ message: 'Выход' });
});

app.use(errorLogger);

app.use('/api/', (req, res, next) => {
  next(new NotFoundError('Запрос несуществующей страницы'));
});

app.use(errors());
app.use(errorHandler);

app.listen(PORT);
