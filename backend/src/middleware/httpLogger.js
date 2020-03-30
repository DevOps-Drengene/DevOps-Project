const stringifyRequest = require('./util/stringify-http-request');
const { winston, levels } = require('../config/winston');

module.exports = (req, _res, next) => {
  winston.log(levels.info, stringifyRequest(req));
  next();
};
