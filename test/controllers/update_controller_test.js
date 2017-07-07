const assert = require('assert');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app');
const User = require('../../models/main_db');
const AddWalk = require('../../models/user_addWalk_schema');

describe('Update Components and Associations', () => {
  let joe;let newLocations;

  beforeEach((done) =>
    {
      joe = new User(
      {
        email: 'joe@test.com',
        password: 'joe1234',
        username: 'joe1234',
      });
      newLocations = new AddWalk({ coordinates: [10, 20] });
      joe.addNewLocations.push(newLocations);

      Promise.all([joe.save(), newLocations.save()])
      .then(() => done());
    }
  );

  it('saves a relation between a user and a newAddWalk', (done) => {
    User.findOne({ username: 'joe1234' })
      .populate('addNewLocations')
      .then((user) => {
        // console.log(user);
        assert(user.addNewLocations[0].coordinates[0] == 10);
        done();
      });
  });

});
