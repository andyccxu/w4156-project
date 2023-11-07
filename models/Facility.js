const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema({
  facilityName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  facilityType: {
    type: String,
    enum: ['hospital', 'restaurant', 'retail', 'office', 'school', 'other'],
    required: true,
  },
  operatingHours: {
    start: {
      type: String,
      required: true,
    },
    end: {
      type: String,
      required: true,
    },
  },
  numberEmployees: {
    type: String,
    // required: true,
  },
  numberShifts: {
    type: String,
    // required: true,
  },
  numberDays: {
    type: String,
    // required: true,
  },
  managedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: true,
  },
  staffAssigned: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
  }],
  // peakHours: {
  //   start: String,
  //   end: String,
  // },
  // staffRequirements: [{
  //   position: String,
  //   count: Number,
  //   skillLevel: String
  // }],
  // location: {
  //   type: {
  //     type: String,
  //     default: 'Point'
  //   },
  //   coordinates: {
  //     type: [Number]
  //   //   required: true
  //   }
  // },
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
Facility.createIndexes();

module.exports = Facility;
