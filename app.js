require('dotenv').config();

const { SERVER_PORT = 3000, DB_URL } = process.env;
const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const { celebrate, Joi, errors } = require('celebrate');

const helmet = require('helmet');

const users = require('./routes/users');
const cards = require('./routes/cards');
const routes = require('./routes/routes');

const auth = require('./middlewares/auth');
const error = require('./middlewares/error');

const { login, createUser } = require('./controllers/users');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

app.use(helmet());
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
    avatar: Joi.string().required().regex(/https?:\/\/[a-z\d\-_]+\.[a-z]+/),
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }).unknown(true),
}), createUser);

app.use(auth);
app.use('/users', users);
app.use('/cards', cards);
app.use('*', routes);

mongoose.connect(DB_URL, {
  useNowUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(errors());
app.use(error);

app.listen(SERVER_PORT, () => {});
