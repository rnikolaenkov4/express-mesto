const mogoose = require('mongoose');

const userSchema = new mogoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },

  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },

  avatar: {
    type: String,
    required: true,
  },
});

module.exports = mogoose.model('user', userSchema);
