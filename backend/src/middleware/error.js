const Error = require('../dtos/error');
const winston = require('../config/winston');
const { BadRequestError, ForbiddenError, NotFoundError } = require('../errors');

module.exports = (err, req, res, next) => {
  if (err instanceof BadRequestError) {
    winston.error(`400: ${err.message}`);
    res.status(400).send(new Error(err.message));
  } else if (err instanceof ForbiddenError) {
    winston.error(`403: ${err.message}`);
    res.status(403).send(new Error(err.message));
  } else if (err instanceof NotFoundError) {
    winston.error(`404: ${err.message}`);
    res.status(404).send(new Error(err.message));
  } else {
    winston.error(`500: ${err.message}`);
    res.status(500).send(new Error(err.message));
  }

  next();
};
