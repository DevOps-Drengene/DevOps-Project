const Error = require('../dtos/error');

module.exports = (err, _req, res, next) => {
  if (err.message.toLowerCase().includes('bad request')) {
    return res.status(400).send(new Error(err.message));
  }

  if (err.message === 'Unauthorized') {
    return res.status(403).send(new Error('You are not authorized to use this resource'));
  }

  if (err.message.toLowerCase().includes('not found')) {
    return res.status(404).send(new Error(err.message));
  }

  res.status(500).send(new Error(err.message));

  return next();
};
