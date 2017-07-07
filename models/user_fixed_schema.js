const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserFixedSchema = new Schema(
  {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' },
    maxDistance: { type: Number, default: 0 },
    minDistance: { type: Number, default: 0 },
  }
);

module.exports = UserFixedSchema;
