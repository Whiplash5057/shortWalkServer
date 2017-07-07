const MainDB = require('../models/main_db');

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
};
