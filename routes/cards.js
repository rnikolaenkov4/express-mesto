const cards = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createCard, getCardList, likeCard, deleteCard, dislikeCard,
} = require('../controllers/cards');

cards.get('/', getCardList);
cards.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    link: Joi.string().required(),
  }),
}), createCard);
cards.delete('/:cardId', deleteCard);
cards.put('/:cardId/likes', likeCard);
cards.delete('/:cardId/likes', dislikeCard);

module.exports = cards;
