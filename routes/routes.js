const routes = require('express').Router();
const { notFound } = require('../controllers/notFound');

routes.all('/', notFound);

module.exports = routes;
