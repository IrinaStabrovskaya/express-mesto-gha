const Card = require('../models/card');

const getCards = (req, res) => Card.find({})
  .then((cards) => res.status(200).send({ data: cards }))
  .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)

    .then((cardData) => {
      if (!cardData) {
        return res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
      }
      return res.status(200).send({ data: cardData });
    })
    .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const id = req.user._id;

  Card.create({ name, link, owner: id })
    .then((newCard) => res.status(201).send({ data: newCard }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(400)
          .send({
            message: 'Переданы некорректные данные при создании карточки',
          });
      }

      return res.status(500).send({ message: 'Ошибка сервера' });
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true, runValidators: true },
  )
    .then((cardData) => {
      if (!cardData) {
        return res.status(404).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.status(200).send({ data: cardData });
    })
    .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true, runValidators: true },
  )
    .then((cardData) => {
      if (!req.params.cardId) {
        return res.status(404).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.status(200).send({ data: cardData });
    })
    .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
};
