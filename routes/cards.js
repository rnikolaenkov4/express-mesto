const cards = require('express').Router();
const {
  createCard, getCardList, likeCard, deleteCard, dislikeCard,
} = require('../controllers/cards');

cards.get('/', getCardList);
cards.post('/', createCard);
cards.delete('/:cardId', deleteCard);
cards.put('/:cardId/likes', likeCard);
cards.delete('/:cardId/likes', dislikeCard);

module.exports = cards;
