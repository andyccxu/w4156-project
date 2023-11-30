const mongoose = require('mongoose');

// Define the ScheduleEntry subdocument schema
const scheduleEntrySchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  start: {
    type: String,
    required: true,
  },
  end: {
    type: String,
    required: true,
  },
  days: {
    type: [String],
    default: ['Mo', 'Tu', 'We', 'Th', 'Fr'],
    enum: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
  },
});


const ScheduleSchema = new mongoose.Schema({
  // a schedule is created for a specific facility
  facilityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Facility',
    required: true,
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

  // a list of shift entries, whose schema is defined above
  shifts: {
    type: [scheduleEntrySchema],
    default: [],
  },

});


// when calling .model() on a schema, Mongoose compiles a model
const Schedule = mongoose.model('Schedule', ScheduleSchema);
const ScheduleEntry = mongoose.model('ScheduleEntry', scheduleEntrySchema);

module.exports = {Schedule, ScheduleEntry};
