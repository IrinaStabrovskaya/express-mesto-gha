/* eslint-disable no-use-before-define */
const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const isLength = require('validator/lib/isLength');

const urlPattern = /^(https?):\/\/(www\.)?([a-z0-9-.]*)\/?(([-._~:/?#[\]@!$&'()*+,;=a-z0-9]*)?)#?$/gmi;
// const isURL = require('validator/lib/isURL');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Жак-Ив Кусто',
      validate: {
        validator: (string) => isLength(string, { min: 2, max: 30 }),
        message: 'Имя должно содержать от 2 до 30 символов',
      },
    },
    about: {
      type: String,
      default: 'Исследователь',
      validate: {
        validator: (string) => isLength(string, { min: 2, max: 30 }),
        message: 'Это поле должно содержать от 2 до 30 символов',
      },
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      //  required: true,
      validate: {
        validator: (url) => urlPattern.test(url),
      },

    },
    email: {
      type: String,
      required: true,
      unique: true,
      email: {
        minDomainSegments: 3,
        tlds: { allow: ['com', 'net', 'ru'] },
        validate: {
          validator: (email) => isEmail(email),
          message: 'Неправильный формат почты',
        },
      },

    },
    password: {
      type: String,
      required: true,
      select: false,
      minlength: 8,
    },
  },
);

// метод, который удаляет поле password из тела ответа
// eslint-disable-next-line func-names
userSchema.methods.toJSON = function () {
  // eslint-disable-next-line no-var
  var obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('user', userSchema);
