const mogoose = require('mongoose');
const userSchema = require('./user');

const cardSchema = new mogoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },

  link: {
    type: String,
    required: true,
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },

  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
      default: '',
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mogoose.model('card', cardSchema);
