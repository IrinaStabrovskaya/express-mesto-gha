const { celebrate, Joi } = require('celebrate');

// eslint-disable-next-line max-len
const urlPattern = /^(https?):\/\/(www\.)?([a-z0-9-.]*)\/?(([-._~:/?#[\]@!$&'()*+,;=a-z0-9]*)?)#?$/;

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
  validateUpdateUser,
  validateUpdateAvatar,
  validateDeleteCard,
  validateCreateCard,
  validateLikeCard,
  validateDislikeCard,
};
