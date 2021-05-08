const { ObjectId } = require('mongoose').Types;
const Card = require('../models/card');

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
    .catch(() => {
      res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.deleteCard = (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.cardId)) {
      throw new Error('Not valid _id');
    }

    Card.findById(req.params.cardId)
      .orFail(() => new Error('Not Found'))
      .then((cardList) => {
        if (cardList.owner !== req.user._id) {
          return Promise.reject('Not owner');
        }
        res.send({ data: cardList });
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
          return;
        }

        if (err.message === 'Not Found') {
          res.status(404).send({ message: 'Карточка не найдена.' });
          return;
        }

        if (err === 'Not owner') {
          res.status(403).send({ message: 'Удаление не возможно.' });
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
    if (!ObjectId.isValid(req.params.cardId)) {
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
          res.status(404).send({ message: 'Карточка не найдена.' });
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
    if (!ObjectId.isValid(req.params.cardId)) {
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
          res.status(404).send({ message: 'Карточка не найдена.' });
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
