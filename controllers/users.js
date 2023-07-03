const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
// const checkToken = require('../middlewares/auth');
const {
  BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, CREATED,
} = require('../constants/errors');

const SALT_ROUNDS = 10;

const JWT_SECRET = 'super-puper-secret-key';

// запрос всех пользователей
const getUsers = (req, res) => {
  if (!req.user) {
    res.status(403).send({ message: 'Нет доступа' });
  }
  User.find({})
    .then((users) => res.status(OK).send({ data: users }))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

// запрос пользователя по id
const getUser = (req, res) => {
  if (!req.user) {
    res.status(403).send({ message: 'Нет доступа' });
  }
  User.findById(req.user)
    .orFail(new Error('NotValidId'))
    .then((userData) => {
      res.status(OK).send({ data: userData });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
        return;
      }
      if (err instanceof mongoose.Error.CastError) {
        res.status(BAD_REQUEST).send({ message: `'Переданы некорректные данные при поиске пользователя' ${err.name} ${err.message}` });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};
// запрос на создание пользователя
const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    res.status(BAD_REQUEST).send({ message: 'Не передан электоронный адрес или пароль' });
  }
  // ищем пользователя по email
  //  если пользователя такого нет, то создаем
  return User.findOne({ email })

    .then((user) => {
      if (user) {
        return res.status(409).send({ message: 'Пользователь уже существует' });
      }

      return bcrypt.hash(password, SALT_ROUNDS)
        .then((hash) => User.create({
          name, about, avatar, email, password: hash,
        }))

        .then((userData) => {
          res.status(CREATED).send({ data: userData });
        });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(BAD_REQUEST).send({
          message: `'Переданы некорректные данные при создании пользователя' ${err.name} ${err.message}`,
        });
      }
    });
};

// функция запроса обновления данных пользователя
const updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(new Error('NotValidId'))
    .then((userData) => {
      res.status(OK).send({ data: userData });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
        return;
      }
      if (err instanceof mongoose.Error.ValidationError) {
        res
          .status(BAD_REQUEST)
          .send({
            message: 'Переданы некорректные данные при обновлении профиля',
          });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

// запрос на обновление аватара
const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new Error('NotValidId'))
    .then((userData) => {
      res.status(OK).send({ data: userData });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
        return;
      }
      if (err instanceof mongoose.Error.ValidationError) {
        res
          .status(BAD_REQUEST)
          .send({
            message: 'Переданы некорректные данные при обновлении профиля',
          });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .orFail(new Error('EmailNotFound'))
    .then((user) => bcrypt.compare(password, user.password)
      .then((matched) => {
        if (!matched) {
          Promise.reject(new Error('EmailNotFound'));
          return;
        }
        // eslint-disable-next-line consistent-return
        return res.status(OK).send({
          token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' }),
        });
      }))
    .catch((err) => {
      if (err.message === 'EmailNotFound') {
        res.status(401).send({ message: 'Неправильные почта или пароль' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
