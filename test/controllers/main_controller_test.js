const assert = require('assert');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app');
const bcrypt = require('bcryptjs');

const User = mongoose.model('user');

describe('User controller', () => {

  it('POST to /api/newuser', (done) => {
    // THE COMMENT FORMAT SHOULD BE METHOD | ROUTE | RESULT
    User.count()
      .then((count) => {
        request(app)
          .post('/api/newuser')
          .send(
            {
              email: 'ronald@test.com',
              password: 'abcdefghi',
              username: 'rich1234',
              geometry: { type: 'Point', coordinates: [70, 20.1] }, //lng, lat
            }
          )
          .end(() => {
            User.count()
              .then(newCount => {
                assert(newCount == count + 1);
                done();
              });
          });
      });
  });

  it('POST to /api/login', (done) => {
    const password = 'ronald';
    const usernameTest = 'rich1234';
    request(app)
      .post('/api/newuser')
      .send(
        {
          email: 'richard@richard.com',
          password: password,
          username: usernameTest,
        }
      )
      .end((err, resp) => {
        assert(resp.body.message === 'success');
        done();
      });
  });

});

const createHash = (password) => {
  let passwordOuter = password;
  return new Promise((resolve, reject) => {

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(passwordOuter, salt, function (err, hash) {
        //Store hash in your password DB.
        passwordInner = hash;
        resolve(passwordInner);
      });
    });

  });

};
