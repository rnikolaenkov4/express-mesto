const users = require('express').Router();
const { createUser, getUserList, getUserById, updateUserInfo } = require('../controllers/users');

users.get('/', getUserList);
users.get('/:id', getUserById);
users.post('/', createUser);
users.patch('/me', updateUserInfo);

module.exports = users;
