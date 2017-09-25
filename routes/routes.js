const MainController = require('../controllers/main_controller');
const UiController = require('../controllers/ui_controller');
const UpdateController = require('../controllers/update_controller');

module.exports = (app) => {
  app.get('/api', MainController.greeting);

  app.post('/api/newuser', MainController.create);

  app.post('/api/login', MainController.login);

  app.post('/api/closestCompitition', UiController.index);

  app.post('/api/completedNearByFrogs', UpdateController.completedNearByFrogs);

  app.put('/api/getAllFrogs', UiController.getFrogs);

  app.put('/api/addNewLocation', UpdateController.create);

  app.put('/api/updateHomeLocation', UpdateController.updateHome);

  app.put('/api/updateNewFrogFound', UpdateController.updateNewFrogFound);

  app.put('/api/updateNewFrogValid', UpdateController.updateNewFrogValid);

};
