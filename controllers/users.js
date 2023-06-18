const User = require('../models/user');

// запрос всех пользователей
const getUsers = (req, res) => User.find({})
  .then((users) => res.status(200).send({ data: users }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));

// запрос пользователя по id
const getUserById = (req, res) => User.findById(req.user._id)
  .then((userData) => {
    if (!userData) {
      return res.status(404).send({ message: 'Пользователь не найден' });
    }

    return res.status(200).send({ data: userData });
  })

  .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));

// запрос на создание пользователя
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((userData) => res.status(201).send({ data: userData }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(400)
          .send({
            message: 'Переданы некорректные данные при создании пользователя',
          });
      }

      return res.status(500).send({ message: 'Ошибка' });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((userData) => {
      if (!req.user._id) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }

      return res.status(200).send({ data: userData });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      return res.status(500).send(`Ошибка ${err.name} `);
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((userData) => {
      if (!req.user._id) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }

      return res.status(200).send({ data: userData });
    })
    .catch((err) => res.status(500).send(`Ошибка ${err.name} ${err.message}`));
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
