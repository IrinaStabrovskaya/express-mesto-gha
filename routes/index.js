const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./card');
const {
  NOT_FOUND,
} = require('../constants/errors');

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use('/*', (req, res) => { res.status(NOT_FOUND).send({ message: 'Страница не найдена' }); });

module.exports = router;
