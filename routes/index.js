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
    name: Joi.string().default('Жак-Ив Кусто').validate(),
    about: Joi.string().default('Исследователь').validate(),
    avatar: Joi.string().default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png').validate(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), createUser);
router.use('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);
router.use('/users', auth, userRoutes);
router.use('/cards', auth, cardRoutes);
router.use('/*', (req, res) => { res.status(NOT_FOUND).send({ message: 'Страница не найдена' }); });

module.exports = router;
