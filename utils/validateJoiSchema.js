const { celebrate, Joi } = require('celebrate');

// eslint-disable-next-line max-len
const urlPattern = /^(https?):\/\/(www\.)?([a-z0-9-.]*)\/?(([-._~:/?#[\]@!$&'()*+,;=a-z0-9]*)?)#?$/;

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().default('Жак-Ив Кусто').min(2).max(30),
    about: Joi.string().default('Исследователь').min(2).max(30),
    avatar: Joi.string().default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png').pattern(urlPattern),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }).unknown(true),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }).unknown(true),
});

const validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24),
  }),
});

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().default('Жак-Ив Кусто').validate(),
    about: Joi.string().default('Исследователь').validate(),
  }),
});

const validateUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar:
    Joi.string().required().pattern(urlPattern),
  }),
});

const validateDeleteCard = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
});

const validateLikeCard = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

const validateDislikeCard = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

module.exports = {
  validateCreateUser,
  validateLogin,
  validateUpdateUser,
  validateUpdateAvatar,
  validateDeleteCard,
  validateCreateCard,
  validateLikeCard,
  validateDislikeCard,
  validateUserId,

};
