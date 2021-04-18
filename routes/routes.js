const routes= require('express').Router();
const { notFound } = require('../controllers/notFound');

routes.get('/', notFound);

module.exports = routes;
