const router = require('express').Router();
const {
  BAD_REQUEST,
} = require('../constants/errors');
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/:userId', getUserById);

router.post('/', createUser);

router.patch('/me', updateUser);

router.patch('/me/avatar', updateAvatar);

router.use('/*', (req, res) => { res.status(BAD_REQUEST).send({ message: 'Некорректный путь' }); });

module.exports = router;
