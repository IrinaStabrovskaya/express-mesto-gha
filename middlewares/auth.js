const jwt = require('jsonwebtoken');
const { UNAUTHORIZED } = require('../constants/errors');

// const handleAuthError = (res) => {
//  res.status(UNAUTHORIZED)
//    .send({ message: 'Нет доступа, нужна авторизация' });
// };

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
   // handleAuthError(res);
    return;
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'super-puper-secret-key');
  } catch (err) {
    res.status(UNAUTHORIZED)
    .send({ message: `'Нет доступа, нужна авторизация' ${err.name} ${err.message}` });
   // handleAuthError(res);
    return;
  }
  req.user = payload;

  next();
};
