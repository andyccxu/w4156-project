const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const Employee = require('../models/Employee');

const employeeController = require('../controllers/employeeController');


// GET all employees
router.get('/', employeeController.getAllController);

// GET one employee
router.get('/:id', getEmployee, employeeController.getOneController);

// POST one employee
router.post('/', employeeController.createController);

// PATCH update one employee
router.patch('/:id', getEmployee, employeeController.patchController);

// DELETE one employee
router.delete('/:id', getEmployee, employeeController.deleteController);

/**
 * Middleware function to get a employee by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @throws {Object} - Returns a 404 status code if staff is not found.
 * @throws {Object} - Returns a 500 status code if a server error occurs.
 * @return {Promise<void>}
 */
async function getEmployee(req, res, next) {
  let employee;
  try {
    employee = await Employee.findById(req.params.id);
    if (employee == null) {
      return res.status(404).json({message: 'Cannot find the employee'});
    }
  } catch (err) {
    return res.status(500).json({message: err.message});
  }

  res.employee = employee;
  next();
}

module.exports = {router, getEmployee};
