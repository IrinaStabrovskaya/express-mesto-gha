const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./card');
const {
  validateCreateUser,
  validateLogin,
} = require('../utils/validateJoiSchema');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');

const {
  NOT_FOUND,
} = require('../constants/errors');

router.use('/signup', validateCreateUser, createUser);
router.use('/signin', validateLogin, login);
router.use('/users', auth, userRoutes);
router.use('/cards', auth, cardRoutes);
router.use('/*', (req, res) => { res.status(NOT_FOUND).send({ message: 'Страница не найдена' }); });

module.exports = router;
