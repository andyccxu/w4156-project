const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const Facility = require('../models/Facility');
const User = require('../models/User');

// Getting the user's managed facility
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('managedFacility');
    if (!user.managedFacility) {
      // eslint-disable-next-line max-len
      return res.status(404).json({message: 'No facility managed by this user'});
    }
    res.json(user.managedFacility);
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});

// Creating a facility
router.post('/', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.managedFacility) {
      return res.status(400).json({message: 'User already manages a facility'});
    }

    const facility = new Facility({
      facilityName: req.body.facilityName,
      facilityType: req.body.facilityType,
      operatingHours: req.body.operatingHours,
      numberEmployees: req.body.numberEmployees,
      numberShifts: req.body.numberShifts,
      numberDays: req.body.numberDays,
      manager: req.user._id,
    });

    const newFacility = await facility.save();
    user.managedFacility = newFacility._id;
    await user.save();

    res.status(201).json(newFacility);
  } catch (err) {
    res.status(400).json({message: err.message});
  }
});

// Updating the user's managed facility
router.patch('/', getFacility, async (req, res) => {
  try {
    // Update the fields
    if (req.body.facilityName != null) {
      res.facility.facilityName = req.body.facilityName;
    }
    if (req.body.facilityType != null) {
      res.facility.facilityType = req.body.facilityType;
    }
    if (req.body.operatingHours != null) {
      res.facility.operatingHours = req.body.operatingHours;
    }
    if (req.body.numberEmployees != null) {
      res.facility.numberEmployees = req.body.numberEmployees;
    }
    if (req.body.numberShifts != null) {
      res.facility.numberShifts = req.body.numberShifts;
    }
    if (req.body.numberDays != null) {
      res.facility.numberDays = req.body.numberDays;
    }
    if (req.body.employees != null) {
      res.facility.employees = req.body.employees;
    }
    // ... other fields later ...

    const updatedFacility = await res.facility.save();
    res.json(updatedFacility);
  } catch (err) {
    res.status(400).json({message: err.message});
  }
});

// Deleting the user's managed facility
router.delete('/', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.managedFacility) {
      // eslint-disable-next-line max-len
      return res.status(404).json({message: 'No facility managed by this user'});
    }

    await Facility.deleteOne({_id: user.managedFacility});
    user.managedFacility = null;
    await user.save();

    res.json({message: 'Deleted facility'});
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});


/**
 * Middleware that get one facility by _id.
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
    facility = await Facility.findOne({manager: req.user._id});
    if (!facility) {
      // eslint-disable-next-line max-len
      return res.status(404).json({message: 'No facility managed by this user'});
    }
    res.facility = facility;
    next();
  } catch (err) {
    return res.status(500).json({message: err.message});
  }
}


module.exports = {router, getFacility};
