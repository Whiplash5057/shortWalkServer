const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const routes = require('./routes/routes');

//THE EXPRESS IS A WRAPPER WHICH RETURNS A FUNCTION

const app = express();

//THE PROMISE PROVIDED BY MONGOOSE HAS BEEN DEPRICATED
mongoose.Promise = global.Promise;

if (process.env.NODE_ENV != 'test')
{
  mongoose.connect('mongodb://localhost/ShortWalk');
}

//USE - MIDDLEWARE FOR express
app.use(bodyParser.json());

// VIP - YOU HAVE TO REMEMBER TO PLACE THE APP.USE CALL BEFORE THE ROUTES CALL
routes(app);

//POSTOPERATION MIDDLEWARE
app.use((err, req, res, next) => {
  res.status(422)
  .send({
    status: 'failure',
    message: 'Something went wrong',
    response: {
      authToken: '',
      err,
    },
  });
});

module.exports = app;
