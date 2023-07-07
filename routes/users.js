const router = require('express').Router();

const {
  validateUpdateUser,
  validateUpdateAvatar,
  validateUserId,
} = require('../utils/validateJoiSchema');

const {
  getUsers,
  getUser,
  getUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get(
  '/',
  getUsers,
);

router.get('/me', getUser);

router.get('/:userId', validateUserId, getUserById);

router.patch('/me', validateUpdateUser, updateUser);

router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

module.exports = router;
