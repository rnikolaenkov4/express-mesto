const { ObjectId } = require('mongoose').Types;
const Card = require('../models/card');

const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const InternalServerError = require('../errors/internal-server-err');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  Card.create({ name, link, owner: _id })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
        return;
      }

      next(new InternalServerError('Ошибка по умолчанию.'));
    });
};

module.exports.getCardList = (req, res, next) => {
  Card.find({})
    .then((cardList) => res.send({ data: cardList }))
    .catch(() => next(new InternalServerError('Ошибка по умолчанию.')));
};

module.exports.deleteCard = (req, res, next) => {
  if (!ObjectId.isValid(req.params.cardId)) {
    throw new BadRequestError('Не валидный id');
  }

  Card.findById(req.params.cardId)
    .orFail()
    .then((cardList) => {
      if (String(cardList.owner) !== req.user._id) {
        next(new ForbiddenError('Удаление не возможно. Не хватает прав'));
        return;
      }
      cardList.deleteOne();
      res.send({ data: cardList });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Карточка не найдена'));
        return;
      }

      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные для постановки/снятии лайка.'));
        return;
      }

      next(new InternalServerError('Ошибка по умолчанию.'));
    });
};

module.exports.likeCard = (req, res, next) => {
  if (!ObjectId.isValid(req.params.cardId)) {
    throw new BadRequestError('Не валидный id');
  }

  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((cardList) => res.send({ data: cardList }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Карточка не найдена'));
        return;
      }

      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные для постановки/снятии лайка.'));
        return;
      }

      next(new InternalServerError('Ошибка по умолчанию.'));
    });
};

module.exports.dislikeCard = (req, res, next) => {
  if (!ObjectId.isValid(req.params.cardId)) {
    throw new BadRequestError('Не валидный id');
  }

  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((cardList) => res.send({ data: cardList }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Карточка не найдена'));
        return;
      }

      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные для постановки/снятии лайка.'));
        return;
      }

      next(new InternalServerError('Ошибка по умолчанию.'));
    });
};
