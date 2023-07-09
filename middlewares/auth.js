const jwt = require('jsonwebtoken');

const Unauthorized = require('../errors/unauthorized');

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new Unauthorized('Нет доступа, нужна авторизация'));
    return;
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'super-puper-secret-key');
  } catch (err) {
    next(Unauthorized);
    return;
  }
  req.user = payload;

  next();
};
