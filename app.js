const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');

const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./midlewares/logger');
const errorHandler = require('./midlewares/error-handler');
const { MONGODB_URL } = require('./utils/configs');
const limiter = require('./midlewares/rate-limit');
require('dotenv').config();

const { PORT = 3000, MONGODB_URL_PRODUCTION, NODE_ENV } = process.env;
const app = express();

const qwe = NODE_ENV === 'production' ? MONGODB_URL_PRODUCTION : MONGODB_URL;

mongoose.connect(qwe, {
  useNewUrlParser: true,
});

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(helmet());
app.use(limiter);

app.use(require('./routes/index'));

app.use((req, res, next) => {
  next(new NotFoundError('Запрос несуществующей страницы'));
});
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
