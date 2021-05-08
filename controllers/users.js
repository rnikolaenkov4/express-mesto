const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const CRYPT_ROUNDS = 10;

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, CRYPT_ROUNDS)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.send({ data: { _id: user._id } });
    })
    .catch((err) => {
      console.log(err);
      if (err.code === 11000) {
        res.status(409).send({ message: 'При регистрации указан email, который уже существует на сервере.' });
      }

      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
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
  User.findById(req.params.id)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true, upsert: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true, upsert: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден. ' });
      }
      res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.login = (req, res) => {
  const {
    email, password,
  } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });

      res
        .cookie('jwt', token, {
          maxAge: 604800000,
          httpOnly: true,
        })
        .send({ token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};
