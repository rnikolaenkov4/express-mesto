require('dotenv').config();

const { SERVER_PORT = 3000, DB_URL } = process.env;
const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');

const users = require('./routes/users');
const cards = require('./routes/cards');
const auth = require('./middlewares/auth');
const error = require('./middlewares/error');

// const { SERVER_PORT = 3000 } = process.env;
// const DB_URL = 'mongodb://localhost:27017/mestodb';
const { login, createUser } = require('./controllers/users');

const app = express();

app.use(express.json());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);
app.use('/users', users);
app.use('/cards', cards);

mongoose.connect(DB_URL, {
  useNowUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(errors());
app.use(error);

app.listen(SERVER_PORT, () => {
  console.log('Ура');
});
