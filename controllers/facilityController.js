const Facility = require('../models/Facility');
const User = require('../models/User');

/**
 * Controller for route GET /facilities
 *
 * @param {*} req Express.js request object
 * @param {*} res Express.js response object
 */
async function getController(req, res) {
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
}

/**
 * Controller for route POST /facilities
 *
 * @param {*} req Express.js request object
 * @param {*} res Express.js response object
 */
async function createController(req, res) {
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
}

/**
 * Controller for route PATCH /facilities
 *
 * @param {*} req Express.js request object
 * @param {*} res Express.js response object
 */
async function patchController(req, res) {
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
}

/**
 * Controller for route DELETE /facilities
 *
 * @param {*} req Express.js request object
 * @param {*} res Express.js response object
 */
async function deleteController(req, res) {
  try {
    const user = await User.findById(req.user._id);
    if (!user.managedFacility) {
      // eslint-disable-next-line max-len
      return res.status(404).json({message: 'No facility managed by this user'});
    }

    await Facility.deleteOne({_id: user.managedFacility});
    user.managedFacility = null;
    await user.save();

    res.status(204);
  } catch (err) {
    res.status(500).json({message: err.message});
  }
}

module.exports = {
  getController,
  getController,
  createController,
  patchController,
  deleteController,
};
