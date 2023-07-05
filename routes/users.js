const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().default().validate(),
    about: Joi.string().default().validate(),
  }),

}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object.keys({
    avatar: Joi.string().default().validate(),
  }),
}), updateAvatar);

module.exports = router;
