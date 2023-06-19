const Card = require('../models/card');
const {
  BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, CREATED,
} = require('../errors/errors');

const getCards = (req, res) => Card.find({})
  .then((cards) => res.status(OK).send({ data: cards }))
  .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' }));

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)

    .then((cardData) => {
      if (!cardData) {
        return res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
      }
      return res.status(OK).send({ data: cardData });
    })
    .catch((cardData) => {
      if (cardData._id.length === 24) {
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
      if (err.name === 'ValidationError') {
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
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true, runValidators: true },
  )
    .then((cardData) => {
      if (!cardData) {
        return res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.status(OK).send({ data: cardData });
    })
    .catch((cardData) => {
      if (cardData._id.length === 24) {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка' });
        return;
      }

      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true, runValidators: true },
  )
    .then((cardData) => {
      if (!cardData) {
        return res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.status(OK).send({ data: cardData });
    })
    .catch((cardData) => {
      if (cardData._id.length === 24) {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для снятия лайка' });
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
