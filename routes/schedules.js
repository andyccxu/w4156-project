const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

const {Schedule} = require('../models/Schedule');
const User = require('../models/User');
const scheduleController = require('../controllers/scheduleController');
const {getFacility} = require('./facilities');


// GET all shifting schedules
router.get('/', scheduleController.getAllController);

// GET one shifting schedule
router.get('/:id', getSchedule, scheduleController.getOneController);

// POST new schedule for a facility
router.post('/', scheduleController.createController);

// PATCH update a specific schedule entry
router.patch('/:id', getSchedule, getFacility,
    scheduleController.patchController);

// DELETE one schedule
router.delete('/:id', getSchedule, scheduleController.deleteController);


/**
 * Middleware that get one schedule by _id.
 *
 * @async
 * @param {*} req The request object.
 * @param {*} res The response object.
 * @param {*} next The next function executes the succeeding
 * middleware when invoked.
 * @return {int}
 */
async function getSchedule(req, res, next) {
  let schedule;
  try {
    schedule = await Schedule.findById(req.params.id);
    if (schedule == null) {
      // cannot find the schedule
      return res.status(404).json({message: 'Cannot find the schedule'});
    }
  } catch (err) {
    return res.status(500).json({message: err.message});
  }

  let userFacility;
  try {
    // get the facility registered by user
    const user = await User.findById(req.user._id);
    if (!user.managedFacility) {
      return res.status(403).json({
        message: 'Forbidden to access'});
    }

    userFacility = user.managedFacility;
  } catch (err) {
    res.status(500).json({message: err.message});
  }
  // check if the schedule belongs to user's facility
  if (userFacility.toString() != schedule.facilityId.toString()) {
    return res.status(403).json({message: 'Forbidden to access'});
  }

  res.schedule = schedule;
  // set req.params.id for the next middleware
  req.params.id = schedule.facilityId;
  next();
}

module.exports = {router, getSchedule};
