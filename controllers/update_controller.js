const MainDB = require('../models/main_db');
const AddWalke = require('../models/user_addWalk_schema');

module.exports = {
  create(req, res, next) {
    let newAddWalk;
    const returnVal = new Object();
    const userName = req.body.username;
    const { lng, lat } = req.body;
    console.log(lng + lat + ' are the lat lngs');

    // newAddWalk = new AddWalke({ coordinates: [lng, lat] });
    AddWalke.create({ coordinates: [lng, lat] })
      .then((value) => {
        console.log(value);
        MainDB.update(
          { username: userName },
          { $push: { addNewLocations: newAddWalk } })
          .then((output) => {
            returnVal.message = 'success';
            returnVal.response = output;
            res.send(returnVal);
          })
          .catch((err) => {
            next(err);
          });
      })
      .catch((err) => { next(err); });

    // MainDB.findOne({ $text: { $search: req.body.username } })
    //   .then((value) => {});
    // MainDB.update(
    //   { username: userName },
    //   { $push: { addNewLocations: newAddWalk } })
    //   .then((output) => {
    //     returnVal.message = 'success';
    //     returnVal.response = output;
    //     res.send(returnVal);
    //   })
    //   .catch((err) => {
    //     next(err);
    //   });
  },
};
