const express = require('express');
const mongoose = require('mongoose');
const user = require('./routes/users');

const { PORT = 3000 } = process.env;
const DB_URL = 'mongodb://localhost:27017/mestodb';

const app = express();

app.use(express.json());

app.use('/users', user);

mongoose.connect(DB_URL, {
  useNowUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.listen(PORT, () => {
  console.log('Ура');
});
