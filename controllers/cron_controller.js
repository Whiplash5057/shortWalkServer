const MainDB = require('../models/main_db');
const AddWalk = require('../models/user_addWalk_schema');

module.exports = {

  updateWeeklyCronJob() {
    // console.log('entered inside');

    AddWalk.find({ isValid: true, isComplete: false })
      .then((value) => {
        // console.log(value);
        value.forEach(function (innerValue) {

          console.log('cronjob running');
          let date1Object = new Date();
          let date1 = date1Object.getDate();
          let date2 = innerValue.date.getDate();
          let dateDifference = date1 - date2;

          if (dateDifference >= 7)
          {
            console.log(date1 - date2 + ' ');
            AddWalk.update(
              { _id: innerValue._id },
              { isValid: false })
              .then((value) => {console.log(value);})
              .catch((err) => console.log(err));

            MainDB.findOne(
              { username: innerValue.username }
            ).then((value) => {
              console.log(value.totalScore);
              let newTotalScore = value.totalScore;
              if (newTotalScore > 0)
              {
                newTotalScore = newTotalScore - 50;
              }

              MainDB
              .findOneAndUpdate(
                { username: innerValue.username }, { totalScore: newTotalScore, streakLength: 0 }
              )
                .then((valueInside) => console.log(valueInside));
            }).catch((err) => console.log(err));

          }

        });

        // value.isValid = false;
        // value.save();
      })
      .catch((err) => {
        console.log(err);
      });

    // AddWalk.find({ isValid: true }).forEach(function (doc) {
    //   // doc.isValid = false;
    //   // AddWalk.save(doc);
    // });

  },

};
