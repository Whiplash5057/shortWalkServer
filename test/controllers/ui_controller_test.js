const assert = require('assert');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app');

const User = mongoose.model('user');
const AddWalk = require('../../models/user_addWalk_schema');

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
    let newLocations = new AddWalk({ coordinates: [10, 20], username: 'ricardo234' });
    let newLocationsTwo = new AddWalk({ coordinates: [11, 20], username: 'dicardo234' });
    nonMulundUserOne.addNewLocations.push(newLocations);

    const mulundUserTwo = new User(
      {
        email: 'dicardo@test.com',
        password: 'dicardo',
        username: 'dicardo234',
        geometry: { type: 'Point', coordinates: [72, 19] },
      }
    );

    mulundUserTwo.addNewLocations.push(newLocationsTwo);

    Promise.all(
      [nonMulundUserOne.save(), mulundUserTwo.save(), newLocations.save(), newLocationsTwo.save()]
    )
      .then(() => {
        request(app)
          .post('/api/closestCompitition')
          .send(
            {
              lng: 72,
              lat: 19,
              username: 'rich1234',
            }
          )
          .end((err, response) => {
            // console.log(response.body);
            done();
          });
      });

  });
});
