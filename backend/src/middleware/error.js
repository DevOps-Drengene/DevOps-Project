const Error = require('../dtos/error');
const { winston, levels } = require('../config/winston');
const stringifyRequest = require('./util/stringify-http-request');

module.exports = (err, req, res, next) => {
  if (err.message.toLowerCase().includes('bad request')) {
    return res.status(400).send(new Error(err.message));
  }

  if (err.message === 'Unauthorized') {
    return res.status(403).send(new Error('You are not authorized to use this resource'));
  }

  if (err.message.toLowerCase().includes('not found')) {
    return res.status(404).send(new Error(err.message));
  }

  winston.log(levels.error, `Internal server error: ${err.message}. Receive HTTP request: ${stringifyRequest(req)}`);
  res.status(500).send(new Error(err.message));

  return next();
};
