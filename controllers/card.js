const mongoose = require('mongoose');
const Card = require('../models/card');
const {
  BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, CREATED,
} = require('../constants/errors');

const getCards = (req, res) => Card.find({})
  .then((cards) => res.status(OK).send({ data: cards }))
  .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' }));

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)

    .then((cardData) => {
      if (!req.user) {
        res.status(403).send({ message: 'Вы не можете удалить чужую карточку' });
        return;
      }
      if (!cardData) {
        res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
        return;
      }
      res.status(OK).send({ data: cardData });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при удалении карточки' });
        return;
      }

      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const id = req.user._id;

  Card.create({ name, link, owner: id })
    .then((newCard) => res.status(CREATED).send({ data: newCard }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res
          .status(BAD_REQUEST)
          .send({
            message: 'Переданы некорректные данные при создании карточки',
          });
      }

      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((cardData) => {
      res.status(OK).send({ data: cardData });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      if (err instanceof mongoose.Error.CastError) {
        res.status(BAD_REQUEST).send({ message: `'Переданы некорректные данные для постановки лайка' ${err.name} ${err.message}` });
        return;
      }

      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((cardData) => {
      res.status(OK).send({ data: cardData });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      if (err instanceof mongoose.Error.CastError) {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка' });
        return;
      }

      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
};
