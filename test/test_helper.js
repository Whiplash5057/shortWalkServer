const mongoose = require('mongoose');

before(done => {
  mongoose.connect('mongodb://localhost/ShortWalk_test');
  mongoose.connection
    .once('open', () => done())
    .on('error', (arguments) => {
      console.warn('Warning', error);
    });
});

beforeEach((done) => {
  const { users, useraddwalks } = mongoose.connection.collections;

  users.drop(() => {
    users.ensureIndex({ 'geometry.coordinates': '2dsphere' });
    users.ensureIndex({ username: 'text' });
    useraddwalks.drop(() => {
      done();
    });
  });
});
