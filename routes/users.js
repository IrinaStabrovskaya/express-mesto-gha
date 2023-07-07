const router = require('express').Router();

const {
  validateUpdateUser,
  validateUpdateAvatar,
} = require('../utils/validateJoiSchema');

const {
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get(
  '/',
  getUsers,
);

router.get('/me', getUser);

router.patch('/me', validateUpdateUser, updateUser);

router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

module.exports = router;
