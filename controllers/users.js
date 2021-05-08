require('dotenv').config();

const { CRYPT_ROUNDS = 10, JWT_SECRET = 'super-strong-secret' } = process.env;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const ConflictError = require('../errors/conflict-err');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const InternalServerError = require('../errors/internal-server-err');

// const CRYPT_ROUNDS = 10;

module.exports.createUser = (req, res, next) => {
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
      if (err.name === "MongoError" && err.code === 11000) {
        return next(new ConflictError('При регистрации указан email, который уже существует на сервере.'));
      }

      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      }

      return next(new InternalServerError('Ошибка по умолчанию.'));
    });
};

module.exports.getUserList = (req, res, next) => {
  User.find({})
    .then((userList) => res.send({ data: userList }))
    .catch(() => next(new InternalServerError('Ошибка по умолчанию.')));
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new NotFoundError('Пользователь по указанному _id не найден.'));
      }

      return next(new InternalServerError('Ошибка по умолчанию.'));
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new NotFoundError('Пользователь по указанному _id не найден.'));
      }

      return next(new InternalServerError('Ошибка по умолчанию.'));
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true, upsert: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      }
      if (err.name === 'CastError') {
        return next(new NotFoundError('Пользователь по указанному _id не найден.'));
      }

      return next(new InternalServerError('Ошибка по умолчанию.'));
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true, upsert: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(err.message));
      }
      if (err.name === 'CastError') {
        return next(new NotFoundError('Пользователь по указанному _id не найден.'));
      }

      return next(new InternalServerError('Ошибка по умолчанию.'));
    });
};

module.exports.login = (req, res, next) => {
  const {
    email, password,
  } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

      res
        .cookie('jwt', token, {
          maxAge: 604800000,
          httpOnly: true,
        })
        .send({ token });
    })
    .catch((err) => next(new UnauthorizedError(err.message)));
};
