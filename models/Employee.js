const mongoose = require('mongoose');

const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

const EmployeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: (email) => emailRegex.test(email),
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  phoneNumber: {
    type: String,
    required: true,
    validate: {
      validator: (v) => phoneRegex.test(v),
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  address: {
    street: {type: String, trim: true},
    city: {type: String, trim: true},
    state: {type: String, trim: true},
    postalCode: {type: String, trim: true},
    country: {type: String, trim: true},
  },
  skillLevel: {
    type: Number,
    min: 1,
    max: 10,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value',
    },
    default: 5,
  },
  employeeOf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Facility',
    required: true,
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Employee = mongoose.model('Employee', EmployeeSchema);

module.exports = Employee;
