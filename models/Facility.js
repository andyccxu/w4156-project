const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema({
  facilityName: {
    type: String,
    required: true,
    trim: true
  },
  facilityType: {
    type: String,
    enum: ['hospital', 'restaurant', 'retail'],
    required: true
  },
  operatingHours: {
    start: {
      type: String,
      required: true
    },
    end: {
      type: String,
      required: true
    }
  }
//   peakHours: {
//     start: String,
//     end: String
//   },
//   staffRequirements: [{
//     position: String,
//     count: Number,
//     skillLevel: String
//   }],
//   location: {
//     type: {
//       type: String,
//       default: 'Point'
//     },
//     coordinates: {
//       type: [Number]
//     //   required: true
//     }
//   },
//   staffAssigned: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Staff'
//   }],
//   currentSchedules: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Schedule'
//   }],
//   notifications: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Notification'
//   }]
});

const Facility = mongoose.model('Facility', facilitySchema);

module.exports = Facility;
