const jwt = require('jsonwebtoken');

const Unauthorized = require('../errors/unauthorized');

const handleAuthError = (res, next) => next(new Unauthorized('Нет доступа, нужна авторизация'));

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    handleAuthError(res);
    return;
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'super-puper-secret-key');
  } catch (err) {
    handleAuthError(res);
    return;
  }
  req.user = payload;

  next();
};
