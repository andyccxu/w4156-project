const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const Staff = require('../models/Staff');

// CREATE
router.post('/', async (req, res) => {
  const staff = new Staff({
    name: req.body.name,
    location: req.body.location,
    skill: req.body.skill,
    phoneNumber: req.body.phoneNumber,
    assignedFacility: req.body.assignedFacility,
  });
  try {
    const newStaff = await staff.save();
    res.status(201).json(newStaff);
  } catch (err) {
    res.status(400).json({message: err.message});
  }
});

// READ
router.get('/', async (req, res) => {
  try {
    const staff = await Staff.find();
    res.json(staff);
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});

router.get('/:id', getStaff, (req, res) => {
  res.send(res.staff);
});

// UPDATE
router.patch('/:id', getStaff, async (req, res) => {
  if (req.body.name != null) {
    res.staff.name = req.body.name;
  }
  if (req.body.location != null) {
    res.staff.location = req.body.location;
  }
  if (req.body.skill != null) {
    res.staff.skill = req.body.skill;
  }
  if (req.body.phoneNumber != null) {
    res.staff.phoneNumber = req.body.phoneNumber;
  }

  try {
    const updatedStaff = await res.staff.save();
    res.json(updatedStaff);
  } catch (err) {
    res.status(400).json({message: err.message});
  }
});

// DELETE
router.delete('/:id', getStaff, async (req, res) => {
  try {
    await res.staff.deleteOne();
    res.json({message: 'Deleted staff'});
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});


/**
 * Middleware function to get specific staff by ID. If staff member is found,
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
async function getStaff(req, res, next) {
  let staff;
  try {
    staff = await Staff.findById(req.params.id);
    if (staff == null) {
      return res.status(404).json({message: 'Cannot find the staff'});
    }
  } catch (err) {
    return res.status(500).json({message: err.message});
  }

  res.staff = staff;
  next();
}


module.exports = {router, getStaff};
