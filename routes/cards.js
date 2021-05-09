const cards = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createCard, getCardList, likeCard, deleteCard, dislikeCard,
} = require('../controllers/cards');

cards.get('/', getCardList);

cards.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    link: Joi.string().required().regex(/https?:\/\/[a-z\d\-_]+\.[a-z]+/),
  }),
}), createCard);

cards.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), deleteCard);

cards.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), likeCard);
cards.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), dislikeCard);

module.exports = cards;
