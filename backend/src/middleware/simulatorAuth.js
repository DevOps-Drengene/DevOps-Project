module.exports = (req, _res, next) => {
  const token = req.header('Authorization');
  if (token !== 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh') throw new Error('Unauthorized');
  next();
};
