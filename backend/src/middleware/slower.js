const winston = require('../config/winston');

/**
 * Slows endpoint, that applies this middleware, by five seconds
 */
module.exports = function (req, res, next) {
  setTimeout(() => {
    winston.info(`Slowed request by 5000 ms for following path: '${req.path}'`);
    next();
  }, 5000);
};
