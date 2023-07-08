const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../errors/bad-request');
const Forbidden = require('../errors/forbidden');
const Conflict = require('../errors/conflict');
const Unauthorized = require('../errors/unauthorized');
const NotFound = require('../errors/not-found');
const {
  OK, CREATED,
} = require('../constants/errors');

const SALT_ROUNDS = 10;

const JWT_SECRET = 'super-puper-secret-key';

// запрос всех пользователей
const getUsers = (req, res, next) => {
  if (!req.user) {
    throw new Forbidden('Нет доступа');
  }
  User.find({})
    .orFail(new Error('NotFoundUsers'))
    .then((users) => res.status(OK).send({ data: users }))
    .catch((err) => {
      if (err.message === 'NotFoundUsers') {
        return next(new NotFound('Пользователи не найдены'));
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequest('Переданы некорректные данные при поиске пользователя'));
      }
      return next(err);
    });
};

// запрос своих данных
const getUser = (req, res, next) => {
  if (!req.user._id) {
    throw new Forbidden('Нет доступа');
  }
  User.findOne({ _id: req.user._id })
    .then((userData) => res.status(OK).send({ data: userData }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequest('Переданы некорректные данные при поиске пользователя'));
      }
      return next(err);
    });
};

// запрос пользователя по id
const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => new Error('NotValidId'))
    .then((userData) => {
      res.status(OK).send({ data: userData });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        return next(new NotFound('Пользователь не найден'));
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequest('Переданы некорректные данные при поиске пользователя'));
      }
      return next(err);
    });
};
// запрос на создание пользователя
const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  return bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((userData) => {
      if (!email || !password) {
        throw new BadRequest('Не передан электоронный адрес или пароль');
      }
      res.status(CREATED).send({ data: userData });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new Conflict('Пользователь уже существует'));
      }
      return next(err);
    });
};

// функция запроса обновления данных пользователя
const updateUser = (req, res, next) => {
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
        return next(new NotFound('Пользователь не найден'));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequest('Переданы некорректные данные при обновлении профиля'));
      }
      return next(err);
    });
};

// запрос на обновление аватара
const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new Error('NotValidId'))
    .then((userData) => {
      if (!avatar) {
        throw new BadRequest('Ссылка не передана');
      }
      res.status(OK).send({ data: userData });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        return next(new NotFound('Пользователь не найден'));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequest(`'Переданы некорректные данные при обновлении профиля' ${err.name} ${err.message}`));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .orFail(new Error('EmailNotFound'))
    .then((user) => bcrypt.compare(password, user.password)
      .then((matched) => {
        if (!matched) {
          throw new Unauthorized('Неправильные почта или пароль');
        }
        return res.status(OK).send({
          token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' }),
        });
      }))
    .catch((err) => {
      if (err.message === 'EmailNotFound') {
        return next(new Unauthorized('Неправильные почта или пароль'));
      }
      return next(err);
    });
};

module.exports = {
  getUsers,
  getUser,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
