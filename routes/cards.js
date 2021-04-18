const cards = require('express').Router();
const {
  createCard, getCardList, likeCard, deleteCard,
} = require('../controllers/cards');

cards.get('/', getCardList);
cards.post('/', createCard);
cards.delete('/:cardId', deleteCard);
cards.put('/:cardId/likes', likeCard);

module.exports = cards;
