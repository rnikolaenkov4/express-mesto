const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/users');
const cards = require('./routes/cards');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const DB_URL = 'mongodb://localhost:27017/mestodb';
const { login, createUser } = require('./controllers/users');

const app = express();

app.use(express.json());

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);
app.use('/users', users);
app.use('/cards', cards);

mongoose.connect(DB_URL, {
  useNowUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.listen(PORT, () => {
  console.log('Ура');
});
