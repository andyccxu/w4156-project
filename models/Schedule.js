const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
  // name of the employee
  name: {
    type: String,
    required: true,
  },
  // unavailable time slots
  unavailable_hours: {
    type: [[Date]],
  },
  // working hours scheduled for this employee
  working_hours: {
    type: [[Date]],
  },
  // targeted working hours per day
  target_hours: {
    type: Number,
    default: 6,
  },
});


// when calling .model() on a schema, Mongoose compiles a model
module.exports = mongoose.model('Schedule', ScheduleSchema);
