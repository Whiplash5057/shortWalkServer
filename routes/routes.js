const MainController = require('../controllers/main_controller');
const UiController = require('../controllers/ui_controller');
const UpdateController = require('../controllers/update_controller');

module.exports = (app) => {
  app.get('/api', MainController.greeting);

  app.post('/api/newuser', MainController.create);

  app.post('/api/login', MainController.login);

  app.get('/api/closestCompitition', UiController.index);

  app.put('/api/addNewLocation', UpdateController.create);

  app.put('/api/updateHomeLocation', UpdateController.updateHome);
};
