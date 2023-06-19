const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./card');
const {
  BAD_REQUEST,
  NOT_FOUND,
} = require('../constants/errors');

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use('/404', (req, res) => { res.status(NOT_FOUND).send({ message: 'Страница не найдена' }); });
router.use('/*', (req, res) => { res.status(BAD_REQUEST).send({ message: 'Некорректный путь' }); });
module.exports = router;
