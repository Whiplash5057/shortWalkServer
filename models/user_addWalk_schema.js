const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserAddWalkSchema = new Schema({
  coordinates: [Number],
  locationName: {
    type: String,
    default: 'Not Defined',
  },
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
  username: {
    type: String,
    default: 'default',
  },
  questions: {
    type: [String],
  },
  answers: {
    type: [String],
  },
});

const UserAddWalk = mongoose.model('useraddwalk', UserAddWalkSchema);
module.exports = UserAddWalk;
