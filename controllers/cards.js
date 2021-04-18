const Card = require('../models/card');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  Card.create({ name, link, owner: _id })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
        return;
      }
      res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.getCardList = (req, res) => {
  Card.find({})
    .then((cardList) => res.send({ data: cardList }))
    .catch((err) => {
      res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.deleteCard = (req, res) => {
  try {
    if(!ObjectId.isValid(req.params.cardId)) {
      throw new Error('Not valid _id');
    }

    Card.findByIdAndRemove(req.params.cardId)
      .orFail(() => new Error('Not Found'))
      .then((cardList) => res.send({ data: cardList }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
          return;
        }

        if (err.message === 'Not Found') {
          res.status(400).send({ message: 'Карточка не найдена.' });
          return;
        }
        res.status(500).send({ message: 'Ошибка по умолчанию.' });
      });
  } catch (err) {
    if (err.message === 'Not valid _id') {
      res.status(400).send({ message: 'Переданы некорректные данные.' });
      return;
    }

    res.status(500).send({ message: 'Ошибка по умолчанию.' });
  }
};

module.exports.likeCard = (req, res) => {
  try {
    if(!ObjectId.isValid(req.params.cardId)) {
      throw new Error('Not valid _id');
    }

    Card.findByIdAndUpdate(req.params.cardId,
      { $addToSet: { likes: req.user._id } }, { new: true })
      .orFail(() => new Error('Not Found'))
      .then((cardList) => res.send({ data: cardList }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
          return;
        }
        if (err.message === 'Not Found') {
          res.status(400).send({ message: 'Карточка не найдена.' });
          return;
        }
        res.status(500).send({ message: 'Ошибка по умолчанию.' });
      });
  } catch (err) {
    if (err.message === 'Not valid _id') {
      res.status(400).send({ message: 'Переданы некорректные данные.' });
      return;
    }

    res.status(500).send({ message: 'Ошибка по умолчанию.' });
  }
};

module.exports.dislikeCard = (req, res) => {
  try {
    if(!ObjectId.isValid(req.params.cardId)) {
      throw new Error('Not valid _id');
    }

    Card.findByIdAndUpdate(req.params.cardId,
      { $pull: { likes: req.user._id } }, { new: true })
      .orFail(() => new Error('Not Found'))
      .then((cardList) => res.send({ data: cardList }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
          return;
        }
        if (err.message === 'Not Found') {
          res.status(400).send({ message: 'Карточка не найдена.' });
          return;
        }
        res.status(500).send({ message: 'Ошибка по умолчанию.' });
      });
  } catch (err) {
    if (err.message === 'Not valid _id') {
      res.status(400).send({ message: 'Переданы некорректные данные.' });
      return;
    }

    res.status(500).send({ message: 'Ошибка по умолчанию.' });
  }
};
