const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const Employee = require('../models/Employee');
const User = require('../models/User');
const Facility = require('../models/Facility');

// READ - Get all employees of the facility managed by the current user
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.managedFacility) {
      // eslint-disable-next-line max-len
      return res.status(404).json({message: 'No facility managed by this user'});
    }

    const employees = await Employee.find({employeeOf: user.managedFacility});
    res.json(employees);
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});

// READ - Get a specific employee by ID
router.get('/:id', getEmployee, (req, res) => {
  res.json(res.employee);
});

// CREATE - Add a new employee to the facility managed by the user
router.post('/', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.managedFacility) {
      return res.status(400).json({message: 'User does not manage a facility'});
    }

    const employee = new Employee({
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      skillLevel: req.body.skillLevel,
      employeeOf: user.managedFacility,
      manager: req.user._id,
    });

    const newEmployee = await employee.save();
    await Facility.findByIdAndUpdate(user.managedFacility, {
      $push: {employees: newEmployee._id},
    });

    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(400).json({message: err.message});
  }
});

// UPDATE - Modify details of a specific employee
router.patch('/:id', getEmployee, async (req, res) => {
  if (req.body.name != null) {
    res.employee.name = req.body.name;
  }
  if (req.body.email != null) {
    res.employee.email = req.body.email;
  }
  if (req.body.phoneNumber != null) {
    res.employee.phoneNumber = req.body.phoneNumber;
  }
  if (req.body.address != null) {
    res.employee.address = req.body.address;
  }
  if (req.body.skillLevel != null) {
    res.employee.skillLevel = req.body.skillLevel;
  }

  try {
    const updatedEmployee = await res.employee.save();
    res.json(updatedEmployee);
  } catch (err) {
    res.status(400).json({message: err.message});
  }
});

// DELETE
router.delete('/:id', getEmployee, async (req, res) => {
  try {
    const facilityId = res.employee.employeeOf;
    await res.employee.deleteOne();

    await Facility.findByIdAndUpdate(facilityId, {
      $pull: {employees: req.params.id},
    });

    res.json({message: 'Deleted employee'});
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});


/**
 * Middleware function to get specific employee by ID. If staff member is found,
 * it is attached to the response object, otherwise an error is returned.
 *
 * @async
 * @function
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {function} next - The next middleware function in the stack.
 * @throws {Object} - Returns a 404 status code if staff is not found.
 * @throws {Object} - Returns a 500 status code if a server error occurs.
 * @return {void}
 */
async function getEmployee(req, res, next) {
  let employee;
  try {
    // eslint-disable-next-line max-len
    employee = await Employee.findOne({_id: req.params.id, manager: req.user._id});
    if (!employee) {
      return res.status(404).json({message: 'Cannot find the employee'});
    }
    res.employee = employee;
    next();
  } catch (err) {
    console.error(err );
    return res.status(500).json({message: err.message});
  }
}


module.exports = {router, getEmployee};
