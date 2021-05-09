const users = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUserList, getUserById, updateUserInfo, updateUserAvatar, getCurrentUser,
} = require('../controllers/users');

users.get('/', getUserList);
users.get('/me', getCurrentUser);

users.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
}), getUserById);

users.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserInfo);
users.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(/https?:\/\/[a-z\d\-_]+\.[a-z]+/),
  }),
}), updateUserAvatar);

module.exports = users;
