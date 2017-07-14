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

    MainDB.findOne({ username })
      .then((valueOuter) => {

        returnVal.totalScore = valueOuter.totalScore;
        returnVal.streakLength = valueOuter.streakLength;

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
