const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const isLength = require('validator/lib/isLength');
// const isURL = require('validator/lib/isURL');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Жак-Ив Кусто',
      validate: {
        validator: (String) => isLength(String, { min: 2, max: 30 }),
        message: 'Имя должно содержать от 2 до 30 символов',
      },
    },
    about: {
      type: String,
      default: 'Исследователь',
      validate: {
        validator: (String) => isLength(String, { min: 2, max: 30 }),
        message: 'Поле "О себе" должно содержать от 2 до 30 символов',
      },
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        // validator: (String) => isURL(String),
        validator: (url) => /^(https?):\/\/(www\.)?([a-z0-9-]*)\.([a-z]{2,6})\/?(((([-._~:/?#[\]@!$&'()*+,;=]*)?)(\w*?))*)?#?/gim.test(url),

        message: 'Неверный формат URL-адреса',
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v) => isEmail(v),
        message: 'Неправильный формат почты',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
);

// метод, который удаляет поле password из тела ответа
// eslint-disable-next-line func-names
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('user', userSchema);
