const router = require('express').Router();

const {
  validateUpdateUser,
  validateUpdateAvatar,
  validateUserId,
  validateIsToken,
} = require('../utils/validateJoiSchema');

const {
  getUsers,
  getUser,
  getUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/', validateIsToken, getUsers);

router.get('/me', validateIsToken, getUser);

router.get('/:userId', validateUserId, getUserById);

router.patch('/me', validateUpdateUser, updateUser);

router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

module.exports = router;
