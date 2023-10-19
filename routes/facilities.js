const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const Facility = require('../models/Facility');

// Getting all
router.get('/', async (req, res) => {
  try {
    const facilities = await Facility.find();
    res.json(facilities);
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});

// Getting one
router.get('/:id', getFacility, (req, res) => {
  res.send(res.facility);
});

// Creating one
router.post('/', async (req, res) => {
  const facility = new Facility({
    facilityName: req.body.facilityName,
    facilityType: req.body.facilityType,
    operatingHours: req.body.operatingHours,
    numberEmployees: req.body.numberEmployees,
    numberShifts: req.body.numberShifts,
    numberDays: req.body.numberDays,
  });
  try {
    const newFacility = await facility.save();
    res.status(201).json(newFacility);
  } catch (err) {
    res.status(400).json({message: err.message});
  }
});

// Updating one
router.patch('/:id', getFacility, async (req, res) => {
  if (req.body.facilityName != null) {
    res.facility.facilityName = req.body.facilityName;
  }
  if (req.body.facilityType != null) {
    res.facility.facilityType = req.body.facilityType;
  }
  if (req.body.operatingHours != null) {
    res.facility.operatingHours = req.body.operatingHours;
  }
  // ... other fields later ...

  try {
    const updatedFacility = await res.facility.save();
    res.json(updatedFacility);
  } catch (err) {
    res.status(400).json({message: err.message});
  }
});

// Deleting one
router.delete('/:id', getFacility, async (req, res) => {
  try {
    await res.facility.deleteOne();
    res.json({message: 'Deleted facility'});
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});

/**
 * Middleware that get one schedule by _id.
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
async function getFacility(req, res, next) {
  let facility;
  try {
    facility = await Facility.findById(req.params.id);
    if (facility == null) {
      return res.status(404).json({message: 'Cannot find the facility'});
    }
  } catch (err) {
    return res.status(500).json({message: err.message});
  }

  res.facility = facility;
  next();
}


module.exports = router;
