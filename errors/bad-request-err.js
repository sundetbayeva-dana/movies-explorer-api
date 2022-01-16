const { badRequestStatusCode } = require('../utils/error-const');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = badRequestStatusCode;
  }
}

module.exports = BadRequestError;
