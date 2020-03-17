const metrics = require('../utils/metrics');
const Error = require('../dtos/error');

module.exports = function (err, _req, res, next) {
  metrics.errorsCounter.inc();

  if (err.message.toLowerCase().includes('bad request')) {
    console.log(err);
    console.log('--> sent 400');
    return res.status(400).send(new Error(err.message));
  }

  if (err.message === 'Unauthorized') {
    console.log(err);
    console.log('--> sent 403');
    return res.status(403).send(new Error('You are not authorized to use this resource'));
  }

  if (err.message.toLowerCase().includes('not found')) {
    console.log(err);
    console.log('--> sent 404');
    return res.status(404).send(new Error(err.message));
  }

  console.log(err);
  console.log('--> sent 500');

  res.status(500).send(new Error(err.message));

  return next();
};
