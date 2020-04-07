const stringifyRequest = require('./util/stringify-http-request');
const winston = require('../config/winston');

module.exports = (req, _res, next) => {
  winston.info(stringifyRequest(req));
  next();
};
