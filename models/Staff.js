const mongoose = require('mongoose');


const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

const StaffSchema = new mongoose.Schema({
  // need this to match the staff to the shift
  name: {
    type: String,
    required: true,
  },


  location: {
    type: String,
  },

  // rating from 1-10 for simplicity
  skill: {
    type: Number,
    min: 1,
    max: 10,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value',
    },
  },

  // to send notification
  phoneNumber: {
    type: String, // Changed to String to make use of regex pattern
    validate: {
      validator: function(v) {
        return phoneRegex.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: [true, 'User phone number required'],
  },

  // ---Assign staff to facility
  assignedFacility: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Facility',
  },

  // -------- available hours - include in further iterations -----//
  // hours: {
  //     type: Map,
  //     of: [TimeSlotSchema],
  //     required: true,
  //     validate: {
  //         validator: function (key) {
  //             return validDays.includes(key);
  //         },
  //         message: props => `${props.value} is not a valid day of the week!`
  //     }
  // },
  // {
  //     "hours": {
  //         "Monday": [
  //             {"start": "3:00 PM", "end": "5:00 PM"},
  //             {"start": "6:00 PM", "end": "9:00 PM"}
  //         ],
  //         "Tuesday": [
  //             {"start": "8:00 AM", "end": "11:00 AM"},
  //             {"start": "3:00 PM", "end": "6:00 PM"}
  //         ],
  //         // ... and so on for other days of the week
  //     }
  // }
  // --------------------------------------------//

  // ---- store staff's availability hours - include in further iterations --//
  // const TimeSlotSchema = new mongoose.Schema({
  //     start: {
  //         type: String,
  //         required: true
  //     },
  //     end: {
  //         type: String,
  //         required: true
  //     }
  // }, { _id: false });

});

const Staff = mongoose.model('Staff', StaffSchema);

module.exports = Staff;
