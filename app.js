const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const DB_URL = 'mongodb://localhost:27017/mestodb';

const app = express();

app.use(express.json());

app.get('/users', (req, res) => {
  res.send('Get user');
});

app.get('/users/:id', (req, res) => {
  res.send(req.params.id);
});

app.post('/users', (req, res) => {
  const { name, about, avatar } = req.body;
  res.send(`Name: ${name} | about: ${about} | avatar: ${avatar}`);
});

mongoose.connect(DB_URL, {
  useNowUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.listen(PORT, () => {
  console.log('Ура');
});
