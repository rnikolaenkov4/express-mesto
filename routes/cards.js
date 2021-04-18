const cards = require('express').Router();
const { createCard, getCardList } = require('../controllers/cards');

cards.get('/', getCardList);
cards.post('/', createCard);

module.exports = cards;