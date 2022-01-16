const { notFoundStatusCode } = require('../utils/error-const');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = notFoundStatusCode;
  }
}

module.exports = NotFoundError;
