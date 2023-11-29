const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema({
  facilityName: {
    type: String,
    required: true,
    // unique: true,
    trim: true,
  },
  facilityType: {
    type: String,
    enum: ['hospital', 'restaurant', 'retail', 'office', 'school', 'other'],
    required: true,
  },
  operatingHours: {
    start: {type: String, required: true},
    end: {type: String, required: true},
  },
  numberEmployees: {
    type: Number,
    default: 0,
  },
  numberShifts: {
    type: Number,
    default: 1,
    // required: true,
  },
  numberDays: {
    type: String,
    default: 5,
    // required: true,
  },
  employees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
  }],
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // peakHours: {
  //   start: String,
  //   end: String,
  // },
  // staffRequirements: [{
  //   position: String,
  //   count: Number,
  //   skillLevel: String
  // }],
  // currentSchedules: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Schedule'
  // }],
  // notifications: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Notification'
  // }]
}, {strict: true});

const Facility = mongoose.model('Facility', facilitySchema);

// indexes need to be built so that mongodb can ensure
// the unique property
// we check that the database connection is open before
// calling createIndexes()
const db = mongoose.connection;
db.once('open', function() {
  Facility.createIndexes()
      .catch((err) => {
        console.error('Facility.createIndexes(): ', err);
      });
});

module.exports = Facility;
