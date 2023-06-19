const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./card');

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use('*', (req, res) => { res.status(400).send({ message: 'Некорректный путь' }); });
module.exports = router;
