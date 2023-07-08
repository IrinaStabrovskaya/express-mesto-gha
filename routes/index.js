const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./card');
const {
  validateCreateUser,
  validateLogin,
} = require('../utils/validateJoiSchema');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');

const NotFound = require('../errors/not-found');

router.use('/signup', validateCreateUser, createUser);
router.use('/signin', validateLogin, login);
router.use('/users', auth, userRoutes);
router.use('/cards', auth, cardRoutes);
router.use('/*', auth, (req, res, next) => next(new NotFound('Страница не найдена')));

module.exports = router;
