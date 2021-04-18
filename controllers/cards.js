const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const _id = req.user._id;

  Card.create({ name, link, owner: _id })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.getCardList = (req, res) => {
  Card.find({})
    .then((cardList) => res.send({ data: cardList }))
    .catch((err) => {
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};
