const User = require('../models/user');
const {
  BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, CREATED,
} = require('../constants/errors');

// запрос всех пользователей
const getUsers = (req, res) => User.find({})
  .then((users) => res.status(OK).send({ data: users }))
  .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }));

// запрос пользователя по id
const getUserById = (req, res) => {
  User.findById(req.params.userId)

    .then((userData) => {
      if (!userData) {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
        return;
      }
      res.status(OK).send({ data: userData });
    })

    .catch((userData) => {
      if (userData.length !== 24) {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при поиске пользователя' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};
// запрос на создание пользователя
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((userData) => res.status(CREATED).send({ data: userData }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
      }

      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка' });
    });
};

// запрос на обновление аватара
const updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((userData) => {
      if (!userData) {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
        return;
      }

      res.status(OK).send({ data: userData });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(BAD_REQUEST)
          .send({
            message: 'Переданы некорректные данные при обновлении профиля',
          });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((userData) => {
      if (!userData) {
        return res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      }

      return res.status(OK).send({ data: userData });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(BAD_REQUEST)
          .send({
            message: 'Переданы некорректные данные при обновлении профиля',
          });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
