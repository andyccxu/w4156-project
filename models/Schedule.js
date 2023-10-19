const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
  // a schedule is created for each facility
  facilityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Facility',
  },

  // a list of staff working at the facility
  //   staffList: [{
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Staff'
  //   }],

  // date when the schedule gets generated
  dateGenerated: {
    type: Date,
    default: Date.now,
  },
  shifts: {
    start: String,
    end: String,
  },
  // shifts: [{
  //   staffId: mongoose.Schema.Types.ObjectId,
  //   start: String,
  //   end: String,
  // }],
  target_hours: {
    type: Number,
    default: 6,
  },

});


// when calling .model() on a schema, Mongoose compiles a model
module.exports = mongoose.model('Schedule', ScheduleSchema);
