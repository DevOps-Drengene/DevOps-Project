const winston = require('winston');

const console = new winston.transports.Console();
winston.add(console);

module.exports = winston;
