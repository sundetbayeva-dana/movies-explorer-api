const badRequestStatusCode = 400;
const conflictStatusCode = 409;
const forbiddenStatusCode = 403;
const notFoundStatusCode = 404;
const unathorizedStatusCode = 401;
const badRequestMessage = 'Переданы некорректные данные';
const conflictMessage = 'Указан email, который уже существует на сервере';
const forbiddenMessage = 'Попытка удалить фильм в чужом аккаунте';
const unathorizedMessage = 'Неправильные почта или пароль';
const notFoundCards = 'Карточек нет';
const notFoundMovie = 'Фильм не найден';
const notFoundUser = 'Пользователь не найден';

module.exports = {
  badRequestStatusCode,
  conflictStatusCode,
  forbiddenStatusCode,
  notFoundStatusCode,
  unathorizedStatusCode,
  badRequestMessage,
  conflictMessage,
  forbiddenMessage,
  unathorizedMessage,
  notFoundCards,
  notFoundMovie,
  notFoundUser,
};
