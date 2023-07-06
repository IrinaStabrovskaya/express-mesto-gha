const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userRoutes = require('./users');
const cardRoutes = require('./card');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');

const {
  NOT_FOUND,
} = require('../constants/errors');

router.use('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);
router.use('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
router.use('/users', auth, userRoutes);
router.use('/cards', auth, cardRoutes);
router.use('/*', (req, res) => { res.status(NOT_FOUND).send({ message: 'Страница не найдена' }); });

module.exports = router;
