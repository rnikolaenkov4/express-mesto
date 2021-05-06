const users = require('express').Router();
const {
  getUserList, getUserById, updateUserInfo, updateUserAvatar, getCurrentUser,
} = require('../controllers/users');

users.get('/', getUserList);
users.get('/me', getCurrentUser);
users.get('/:id', getUserById);
users.patch('/me', updateUserInfo);
users.patch('/me/avatar', updateUserAvatar);

module.exports = users;
