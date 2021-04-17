const router = require('express').Router();

router.get('/users', (req, res) => {
  res.send('Get user');
});

router.get('/users/:id', (req, res) => {
  res.send(req.params.id);
});

router.post('/users', (req, res) => {
  const { name, about, avatar } = req.body;
  res.send(`Name: ${name} | about: ${about} | avatar: ${avatar}`);
});

module.exports = router;
