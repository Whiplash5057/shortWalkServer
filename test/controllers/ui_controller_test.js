const assert = require('assert');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app');

const User = mongoose.model('user');

describe('UI controllers', () => {
  it('GET to /api/closestCompitition finds users about a nearby location', (done) => {
    const nonMulundUserOne = new User(
      {
        email: 'ricardo@test.com',
        password: 'ricardo',
        username: 'ricardo234',
        geometry: { type: 'Point', coordinates: [72.001, 19.001] },
      }
    );

    const mulundUserTwo = new User(
      {
        email: 'dicardo@test.com',
        password: 'dicardo',
        username: 'dicardo234',
        geometry: { type: 'Point', coordinates: [72, 19] },
      }
    );
    Promise.all([nonMulundUserOne.save(), mulundUserTwo.save()])
      .then(() => {
        request(app)
          .get('/api/closestCompitition?lng=72&lat=19')
          .end((err, response) => {
            console.log(response.body);
            done();
          });
      });

  });
});
