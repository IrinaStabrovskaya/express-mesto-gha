const router = require('express').Router();
const {
  BAD_REQUEST,
} = require('../constants/errors');

const {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/card');

router.get('/', getCards);

router.delete('/:cardId', deleteCard);

router.post('/', createCard);

router.put('/:cardId/likes', likeCard);

router.delete('/:cardId/likes', dislikeCard);

router.use('/*', (req, res) => { res.status(BAD_REQUEST).send({ message: 'Некорректный путь' }); });

module.exports = router;
