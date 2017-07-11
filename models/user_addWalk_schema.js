const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserAddWalkSchema = new Schema({
  coordinates: [Number],
  isComplete: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  isValid: {
    type: Boolean,
    default: true,
  },
});

const UserAddWalk = mongoose.model('useraddwalk', UserAddWalkSchema);
module.exports = UserAddWalk;
