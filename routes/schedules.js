const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

const {Schedule} = require('../models/Schedule');
const Facility = require('../models/Facility');

const scheduleController = require('../controllers/scheduleController');


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
  try {
    schedule = await Schedule.findById(req.params.id);
    if (schedule == null) {
      // cannot find the schedule
      return res.status(404).json({message: 'Cannot find the schedule'});
    }
  } catch (err) {
    return res.status(500).json({message: err.message});
  }

  res.schedule = schedule;
  next();
}

/**
 * Middleware that get one facility by _id.
 *
 * @async
 * @param {*} req The request object.
 * @param {*} res The response object.
 * @param {*} next The next function executes the succeeding
 * middleware when invoked.
 * @return {int}
 */
async function getFacility(req, res, next) {
  try {
    facility = await Facility.findById(res.schedule.facilityId);
    if (facility == null) {
      return res.status(404).json({message: 'Cannot find the facility'});
    }
  } catch (err) {
    return res.status(500).json({message: err.message});
  }

  res.facility = facility;
  next();
}

module.exports = {router, getSchedule};
