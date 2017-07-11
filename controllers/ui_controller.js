const MainDB = require('../models/main_db');
const AddWalke = require('../models/user_addWalk_schema');

let maxDistanceValue = 2000;

module.exports = {
  index(req, res, next) {
    // res.send({ hi: 'there' });
    const { lng, lat } = req.query;
    MainDB.geoNear(
      { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
      { spherical: true, maxDistance:  maxDistanceValue }
    ).then((users) => res.send(users))
      .catch(next);

  },

  getFrogs(req, res, next) {
    const { username } = req.body;
    const returnVal = new Object();
    MainDB.findOne({ username }, { addNewLocations: 1 })
    .then((value) => {
      // console.log(value.addNewLocations[0]);
      AddWalke.find({ _id: { $in: value.addNewLocations } })
      .then((valueInner) => {
        returnVal.message = 'success';
        returnVal.response = valueInner;
        res.send(returnVal);
      })
      .catch(next);
    })
    .catch(next);
  },
};
