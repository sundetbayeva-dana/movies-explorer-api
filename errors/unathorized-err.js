const { unathorizedStatusCode } = require('../utils/error-const');

class UnathorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = unathorizedStatusCode;
  }
}

module.exports = UnathorizedError;
