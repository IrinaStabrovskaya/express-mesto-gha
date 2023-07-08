const mongoose = require('mongoose');
const Card = require('../models/card');
const BadRequest = require('../errors/bad-request');
const Forbidden = require('../errors/forbidden');
const NotFound = require('../errors/not-found');
const { OK, CREATED } = require('../constants/errors');

const getCards = (req, res, next) => {
  if (!req.user) {
    throw new Forbidden('Нет доступа');
  }
  Card.find({})
    .orFail(() => new Error('CardsNotFound'))
    .then((cards) => {
      res.status(OK).send({ data: cards });
    })
    .catch((err) => {
      if (err.message === 'CardsNotFound') {
        return next(new NotFound('Нет данных'));
      }
      return next(err);
    });
};

// Удаление карточки
const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)

    .then((cardData) => {
      if (!cardData) {
        throw new NotFound('Карточка с указанным _id не найдена');
      }
      if (cardData.owner !== req.user._id) {
        throw new Forbidden('Вы не можете удалить чужую карточку');
      }
      res.status(OK).send({ data: cardData });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(
          new BadRequest('Переданы некорректные данные при удалении карточки'),
        );
      }
      return next(err);
    });
};

// Создание новой карточки
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const id = req.user._id;

  Card.create({ name, link, owner: id })
    .then((newCard) => res.status(CREATED).send({ data: newCard }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(
          new BadRequest('Переданы некорректные данные при создании карточки'),
        );
      }
      return next(err);
    });
};

// Постановка лайка
const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => new Error('NotValidId'))
    .then((cardData) => {
      res.status(OK).send({ data: cardData });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        return next(new NotFound('Передан несуществующий _id карточки'));
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(
          new BadRequest('Переданы некорректные данные для постановки лайка'),
        );
      }
      return next(err);
    });
};

// Удаление лайка
const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => new Error('NotValidId'))
    .then((cardData) => {
      res.status(OK).send({ data: cardData });
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        return next(new NotFound('Передан несуществующий _id карточки'));
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(
          new BadRequest('Переданы некорректные данные для удаления лайка'),
        );
      }
      return next(err);
    });
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
};
