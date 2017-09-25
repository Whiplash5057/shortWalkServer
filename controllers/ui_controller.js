const MainDB = require('../models/main_db');
const AddWalke = require('../models/user_addWalk_schema');

let maxDistanceValue = 20000;

module.exports = {
  index(req, res, next) {
    // res.send({ hi: 'there' });
    const { lng, lat } = req.body;
    const returnVal = new Object();
    const userName = req.body.username;
    let resultLocationArray = [];

    // console.log(userName);
    MainDB.geoNear(
      { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
      { spherical: true, maxDistance:  maxDistanceValue }
    ).then((users) => {
      returnVal.message = 'success';

      // console.log(users);

      let requests = users.reduce((promiseChain, item) => {
        return promiseChain.then(() => new Promise((resolve) => {
          asyncFunction(item, resolve);
        }));
      }, Promise.resolve());

      requests.then(() => {
        returnVal.response = resultLocationArray;
        // console.log(returnVal);
        res.send(returnVal);
      });

    }).catch(next);

    function asyncFunction(item, cb) {

      // setTimeout(() => {
      //   console.log('done with', item);
      //   cb();
      // }, 100);

      let { username } = item.obj;
      // console.log(username);
      if (username != userName) {
        MainDB.findOne({ username }, { addNewLocations: 1 })
          .then((value) => {
            // console.log(value);
            AddWalke.find({ _id: { $in: value.addNewLocations }, isValid: true }).sort({ date: -1 })
              .then((valueInner) => {
                // console.log(valueInner);

                if (resultLocationArray.length == 0)
                  resultLocationArray = [...valueInner];
                else
                  resultLocationArray = [...resultLocationArray, ...valueInner];

                cb();
              });
          }).catch(next);
      } else {
        cb();
      }

    }

  },

  getFrogs(req, res, next) {
    const { username } = req.body;
    const returnVal = new Object();

    MainDB.findOne({ username })
      .then((valueOuter) => {

        returnVal.totalScore = valueOuter.totalScore;
        returnVal.streakLength = valueOuter.streakLength;
        returnVal.completedNearByFrogs = valueOuter.completedNearByFrogs;

        MainDB.findOne({ username }, { addNewLocations: 1 })
        .then((value) => {
          // console.log(value.addNewLocations[0]);

          AddWalke.find({ _id: { $in: value.addNewLocations }, isValid: true }).sort({ date: -1 })
          .then((valueInner) => {

            returnVal.message = 'success';
            returnVal.response = valueInner;

            MainDB.findOne({ username }, { addNewLocations: 1 })
              .then((valueInnerInner) => {

                  let date1Object = new Date();
                  let date1 = date1Object.getDate();

                  AddWalke.find({ _id: { $in: value.addNewLocations }, isComplete: true })
                    .sort({ date: -1 })
                      .then((valueInnerInnerInner) => {
                        if (valueInnerInnerInner.length > 0) {
                          let date2 = valueInnerInnerInner[0].date.getDate();
                          let dateDifferenceOne = date1 - date2;
                          returnVal.nextWalkDate =
                            dateDifferenceOne + '#'
                            + valueInnerInnerInner[0].locationName;
                        }else {
                          returnVal.nextWalkDate = '0#-';
                        }

                        AddWalke.find(
                          { _id: { $in: value.addNewLocations }, isComplete: false, isValid: true })
                          .sort({ date: -1 })
                          .then((valueImBored) => {
                            // res.send(returnVal);
                            if (valueImBored.length > 0)
                            {
                              let date3 = valueImBored[0].date.getDate();
                              let dateDifferenceTwo = date1 - date3;
                              console.log(dateDifferenceTwo);
                              returnVal.nextWalkDate +=
                               '%' + dateDifferenceTwo
                                + '#' + valueImBored[0].locationName;
                            }else { returnVal.nextWalkDate += '%0#-'; }

                            res.send(returnVal);
                          }).catch(next);
                      }).catch(next);
                }).catch(next);
          }).catch(next);
        }).catch(next);
      }).catch(next);

  },
};
