const Employee = require('../models/Employee');
const User = require('../models/User');
const Facility = require('../models/Facility');

/**
 * Controller for route GET /employees
 *
 * @param {*} req Express.js request object
 * @param {*} res Express.js response object
 */
async function getAllController(req, res) {
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
}

/**
 * Controller for route GET /employees/{:id}
 *
 * @param {*} req Express.js request object
 * @param {*} res Express.js response object
 */
function getOneController(req, res) {
  res.json({
    employee: res.employee,
  });
}

/**
 * Controller for route POST /employees
 * @param {*} req Express.js request object
 * @param {*} res Express.js response object
 */
async function createController(req, res) {
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
}

/**
 * Controller for route PATCH /employees/{:id}
 *
 * @param {*} req Express.js request object
 * @param {*} res Express.js response object
 */
async function patchController(req, res) {
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
}

/**
 * Controller for route DELETE /employees/{:id}
 *
 * @param {*} req Express.js request object
 * @param {*} res Express.js response object
 */
async function deleteController(req, res) {
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
}

module.exports = {
  getAllController,
  getOneController,
  createController,
  patchController,
  deleteController,
};
