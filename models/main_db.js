const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserFixedSchema = require('./user_fixed_schema');
const UserAddWalk = require('./user_addWalk_schema');

const UserSchema = new Schema({
  geometry: UserFixedSchema,
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    validate: {
      validator: (password) => password.length > 6,
      message: 'Password must be longer than 6 characters.',
    },
    required: [true, 'Password is required'],
  },
  username: {
    type: String,
    validate: {
      validator: (username) => username.length > 5,
      message: 'Name must be longer than 2 characters.',
    },
    required: [true, 'Name is required'],
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  addNewLocations: [
    {
      type: Schema.Types.ObjectId,
      ref: 'useraddwalk',
    },
  ],
});

const User = mongoose.model('user', UserSchema);
module.exports = User;
