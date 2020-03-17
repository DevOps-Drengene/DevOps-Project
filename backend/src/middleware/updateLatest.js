module.exports = function (req, _res, next) {
  if (req.query.latest) {
    global.latestCounter = parseInt(req.query.latest, 10);
  }
  next();
};
