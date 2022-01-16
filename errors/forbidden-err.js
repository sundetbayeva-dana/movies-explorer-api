const { forbiddenStatusCode } = require('../utils/error-const');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = forbiddenStatusCode;
  }
}

module.exports = ForbiddenError;
