const mogoose = require('mongoose');
const validator = require('validator');

const userSchema = new mogoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },

  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },

  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },

  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: () => 'Вы указали не email',
    },
  },

  password: {
    type: String,
    required: true,
    minlength: 8,
  },
});

module.exports = mogoose.model('user', userSchema);
