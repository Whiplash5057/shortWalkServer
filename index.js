const app = require('./app');

var port = process.env.PORT || 3050;

app.listen(port, () => {
  console.log('Running on port 3050');
});
