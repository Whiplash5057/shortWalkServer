const MainDB = require('../models/main_db');
const bcrypt = require('bcryptjs');

module.exports = {
  greeting(req, res) {
    res.send({ message: 'success' });
  },

  login(req, res, next) { //login

    const returnVal = new Object();
    if ('username' in req.body && req.body.username.length > 0 && req.body.password.length > 0)
    {

      MainDB.findOne({ $text: { $search: req.body.username } })
        .then((user) => {

          let authBool = authPassword(req.body.password, user.password)
              .then(() => {
                loginSuccess(user, user.password);
              })
              .catch(loginErrors);

        })
        .catch((error) => {
            loginErrors();
          });
    }else {
      console.log('test');
      loginErrors();
    }

    const authPassword = (userInput, dbInput) => {
      let userInputStream = userInput;
      let hash = dbInput;

      return new Promise((resolve, reject) => {

        bcrypt.compare(userInputStream, hash).then((res) => {
            if (res == true)
              resolve(res);
            else
              reject();
          });
      });

    };

    const loginSuccess = (user, hashPass) => {
      // console.log(hashPass + ' is the hashed password');
      // console.log(user._id + ' is the user id');
      let authToke = hashPass + user._id;

      returnVal.message = 'success';
      returnVal.status = 'success';
      let token = { authToken:  authToke };
      returnVal.response = token;
      res.send(returnVal);
    };

    const loginErrors = () => {
      returnVal.message = 'Enter your correct username and password';
      returnVal.status = 'failure';
      returnVal.response = {
        response: { authToken: '' },
      };
      res.status(402).send(returnVal);
      next();
    };

  }, //login end

  create(req, res, next) { //create
    const userProps = req.body;

    const createUser = (callback) => {
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(userProps.password, salt, function (err, hash) {
          //Store hash in your password DB.
          userProps.password = hash;
          createTheNewUserAfterHash(hash);
        });
      });
    };

    const createTheNewUserAfterHash = (hashPass) => {
      MainDB.create(userProps)
        .then((user) => {
          let authToke = hashPass + user._id;
          const returnVal = new Object();
          returnVal.message = 'success';
          let token = { authToken: authToke };
          returnVal.status = 'success';
          returnVal.response = token;
          res.send(returnVal);
        })
        .catch((error) => {
          if (error.name === 'MongoError' && error.code === 11000) {
            res.status(422).send({
              status: 'failure',
              message: 'Username already exists',
              response: { authToken: '' },
            });
          }else {
            next(error);
          }
        });
    };

    createUser(createTheNewUserAfterHash);

  }, //create end

};
