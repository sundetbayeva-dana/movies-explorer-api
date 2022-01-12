const validator = require('validator');

const validateURL = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new Error('Неправильный формат ссылки');
  }
  return value;
};

const validateNumber = (value) => {
  if (!validator.isNumeric(value, { no_symbols: false })) {
    throw new Error('Нечисловое значение');
  }
  return value;
};

module.exports = {
  validateURL,
  validateNumber,
};
