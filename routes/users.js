const users = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUserList, getUserById, updateUserInfo, updateUserAvatar, getCurrentUser,
} = require('../controllers/users');

users.get('/', getUserList);
users.get('/me', getCurrentUser);
users.get('/:id', getUserById);
users.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    about: Joi.string().required(),
  }),
}), updateUserInfo);
users.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
}), updateUserAvatar);

module.exports = users;
