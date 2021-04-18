const cards = require('express').Router();
const { createCard, getCardList, likeCard } = require('../controllers/cards');

cards.get('/', getCardList);
cards.post('/', createCard);
cards.put('/:cardId/likes', likeCard);

module.exports = cards;
