const users = require('express').Router();
const {
  createUser, getUserList, getUserById, updateUserInfo, updateUserAvatar,
} = require('../controllers/users');

users.get('/', getUserList);
users.get('/:id', getUserById);
users.post('/', createUser);
users.patch('/me', updateUserInfo);
users.patch('/me/avatar', updateUserAvatar);

module.exports = users;
