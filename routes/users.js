const users = require('express').Router();
const { createUser, getUserList, getUserById } = require('../controllers/users');

users.get('/', getUserList);

users.get('/:id', getUserById);

users.post('/', createUser);

module.exports = users;
