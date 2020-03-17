const express = require('express');

const app = express();

// Global counter for 'latest'
global.latestCounter = 0;

require('./config/error-handling');
require('./startup/simulator-routes')(app);

module.exports = app;
