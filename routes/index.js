const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./card');
const {
  BAD_REQUEST,
} = require('../constants/errors');

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use('*', (req, res) => { res.status(BAD_REQUEST).send({ message: 'Некорректный путь' }); });
module.exports = router;
