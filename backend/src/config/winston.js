const winston = require('winston');

const console = new winston.transports.Console();
winston.add(console);

const levels = {
  error: 'error',
  warn: 'warn',
  info: 'info',
  verbose: 'verbose',
  debug: 'debug',
  silly: 'silly',
};

module.exports = {
  winston,
  levels,
};
