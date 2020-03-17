const express = require('express');
const userRepository = require('../repositories/UserRepository');
const metrics = require('../utils/metrics');

const router = express.Router();

router.get('/', async (_req, res) => {
  metrics.usersCounter.set(await userRepository.numberOfUsers());

  res.set('Content-Type', metrics.promClient.register.contentType);
  res.end(metrics.promClient.register.metrics());
});

module.exports = router;
