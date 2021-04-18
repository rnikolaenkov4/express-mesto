const { ObjectId } = require('mongoose').Types.ObjectId;
const User = require('../models/user');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
        return;
      }
      res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.getUserList = (req, res) => {
  User.find({})
    .then((userList) => res.send({ data: userList }))
    .catch(() => {
      res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.getUserById = (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      throw new Error('Not valid _id');
    }

    User.findById(req.params.id)
      .orFail(() => new Error('User not found'))
      .then((user) => res.send({ data: user }))
      .catch((err) => {
        if (err.message === 'User not found') {
          res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
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

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.user;

  try {
    User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
      .orFail(() => new Error('User not found'))
      .then((user) => res.send({ data: user }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
          return;
        }
        if (err.message === 'User not found') {
          res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
          return;
        }
        res.status(500).send({ message: 'Ошибка по умолчанию.' });
      });
  } catch (err) {
    res.status(500).send({ message: 'Ошибка по умолчанию.' });
  }
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;
  try {
    User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true, upsert: true })
      .orFail(() => new Error('User not found'))
      .then((user) => res.send({ data: user }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
          return;
        }
        if (err.message === 'User not found') {
          res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
          return;
        }
        res.status(500).send({ message: 'Ошибка по умолчанию.' });
      });
  } catch (err) {
    res.status(500).send({ message: 'Ошибка по умолчанию.' });
  }
};
