const jwt = require('jsonwebtoken');

const handleAuthError = (res, err) => {
  res
    .status(401)
    .send(`${err.name} ${err.message}`);
};

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
    res.send(`${err.name} ${err.message}`);
  }
  req.user = payload;

  next();
};
