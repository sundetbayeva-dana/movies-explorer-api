const { conflictStatusCode } = require('../utils/error-const');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = conflictStatusCode;
  }
}

module.exports = ConflictError;
