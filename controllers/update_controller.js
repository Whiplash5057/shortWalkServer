const MainDB = require('../models/main_db');
const AddWalke = require('../models/user_addWalk_schema');
const UpdateFixedWalk = require('../models/user_fixed_schema');

module.exports = {
  create(req, res, next) {
    let newAddWalk;
    const returnVal = new Object();
    const userName = req.body.username;
    const { questions } = req.body;
    const { answers } = req.body;
    const locationName = req.body.locationName;
    const { lng, lat } = req.body;

    // console.log(lng + lat + ' are the lat lngs');

    // newAddWalk = new AddWalke({ coordinates: [lng, lat] });
    // verifyIfUserValid(userName, tokenId)
    //   .then((innerThen) => {
    //     console.log(innerThen);
    //   })
    //   .catch((err) => { next(err); });

    AddWalke.create({ coordinates: [lng, lat],
      locationName, username: userName, questions, answers, })
      .then((value) => {
        // console.log(value);
        MainDB.update(
          { username: userName },
          { $push: { addNewLocations: value } })
          .then((output) => {
            returnVal.message = 'success';
            returnVal.locationName = locationName;
            returnVal.response = output;
            returnVal.dateTime = new Date();
            returnVal.response.latLngId = value._id;
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

  updateHome(req, res, next) {
    let newAddWalk;
    const returnVal = new Object();
    const userName = req.body.username;
    const { lng, lat } = req.body;

    // console.log(lng + ' ' +  lat + ' are the lng lat');

    value = { coordinates: [lng, lat] };
    MainDB.update(
      { username: userName },
      { geometry: value }
    )
      .then((output) => {
        returnVal.message = 'success';
        returnVal.response = output;
        res.send(returnVal);
      })
      .catch((err) => {
        next(err);
      });;
  },

  updateNewFrogFound(req, res, next) {
    const returnVal = new Object();
    const userName = req.body.username;
    const { latLngId } = req.body;
    const distanceFromHome = req.body.distanceFromHome;
    let ptsAdded;

    if (distanceFromHome <= 500)
    {
      console.log('added 100 pts');
      ptsAdded = 100;
    }else if (500 < distanceFromHome <= 1000)
    {
      console.log('added 200 pts');
      ptsAdded = 200;
    }else if (1000 < distanceFromHome <= 2000)
    {
      console.log('added 400 pts');
      ptsAdded = 400;
    }else if (distanceFromHome > 2000) {
      console.log('added 800 pts');
      ptsAdded = 800;
    }

    MainDB.findOne({ username: userName })
          .then((value) => {
            let futureTotalScore = value.totalScore + ptsAdded;
            let presentStreak = value.streakLength + 1;
            console.log(value.streakLength);
            MainDB.update({ username: userName },
               { totalScore:  futureTotalScore, streakLength: presentStreak })
              .then((valueInnerOne) => {
                AddWalke.findByIdAndUpdate({ _id: latLngId }, { isComplete: true })
                .then((output) => {
                  returnVal.message = 'success';
                  returnVal.totalScore = futureTotalScore;
                  returnVal.streakLength = presentStreak;
                  res.send(returnVal);
                })
                .catch(next);
              }).catch(next);
          })
          .catch(next);
  },

  completedNearByFrogs(req, res, next) {
    console.log('entered');
    const returnVal = new Object();

    const { eventId } = req.body;
    const { username } = req.body;
    const { isCorrect } = req.body;

    if (isCorrect) {
      MainDB.findOneAndUpdate({ username: username },
        {
          $push: { completedNearByFrogs: eventId },
          $inc: { totalScore: 100 },
        }
      )
        .then((value) => {
          // console.log(value);
          returnVal.message = 'success';
          res.send(returnVal);
        }).catch(next);
    } else {
      MainDB.findOneAndUpdate({ username: username },
        {
          $inc: { totalScore: -50 },
        }
      )
        .then((value) => {
          // console.log(value);
          returnVal.message = 'success';
          res.send(returnVal);
        }).catch(next);
    }

  },

  updateNewFrogValid(req, res, next) {
    const returnVal = new Object();
    const userName = req.body.username;
    const { latLngId } = req.body;
    AddWalke.findByIdAndUpdate({ _id: latLngId }, { isValid: false })
    .then((output) => {
      returnVal.message = 'success';
      res.send(returnVal);
    })
    .catch((err) => {
      next(err);
    });;
  },

};

function verifyIfUserValid(userName, tokenId) {
  let tempBool = true;
  return new Promise((resolve, reject) => {

    MainDB.findOne({ $text: { $search: userName } })
      .then((value) => {
        // console.log(value.password + ' asking value ' + tokenId);
        let decryptPass = value.password + value._id;
        if (tokenId == decryptPass) {
          resolve('Go on');
        } else {
          resolve('Go on');
        }
      })
      .catch((err) => next(err));

  });
}
