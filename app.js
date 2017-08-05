const CronController = require('./controllers/cron_controller');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const routes = require('./routes/routes');
const cron = require('node-cron');

//THE EXPRESS IS A WRAPPER WHICH RETURNS A FUNCTION

const app = express();

//THE PROMISE PROVIDED BY MONGOOSE HAS BEEN DEPRICATED
mongoose.Promise = global.Promise;

// setInterval(function () {
//   console.log('Hello');
// }, 2000);
cron.schedule('1 * * * *', function () {
  console.log('abc');
  CronController.updateWeeklyCronJob();
});

// cron.schedule('* * * * *', function () {
//   CronController.updateWeeklyCronJob();
// });

if (process.env.NODE_ENV != 'test')
{
  // mongoose.connect('mongodb://localhost/ShortWalk', { useMongoClient: true })
  //   .then(() => console.log('connected'))
  //   .catch(err => console.error(err));

  mongoose.connect(
      'mongodb://frog1:frogNumber1@ds055872.mlab.com:55872/findthefrog',
       { useMongoClient: true })
      .then(() => console.log('connected'))
      .catch(err => console.error(err));

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
