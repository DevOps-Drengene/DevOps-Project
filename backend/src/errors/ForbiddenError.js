module.exports = class ForbiddenError extends Error {
  constructor(message) {
    super();
    this.message = message;
  }
};
