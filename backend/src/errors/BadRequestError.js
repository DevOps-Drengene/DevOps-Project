module.exports = class BadRequestError extends Error {
  constructor(message) {
    super();
    this.message = message;
  }
};
