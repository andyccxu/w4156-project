const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

const {Schedule, ScheduleEntry} = require('../models/Schedule');
const Facility = require('../models/Facility');
const Employee = require('../models/Employee');

const scheduleController = require('../controllers/scheduleController');


// GET all shifting schedules
router.get('/', scheduleController.getAllController);

// GET one shifting schedule
router.get('/:id', getSchedule, scheduleController.getOneController);

// POST new schedule for a facility
router.post('/', async (req, res) => {
  // query the facility by name
  const fname = req.body.facility;
  const facility = await Facility.findOne({facilityName: fname});
  if (!facility) {
    // cannot find the facility
    res.status(404).json({message: 'Cannot find the facility: ', fname});
    return;
  }

  // get all the employees working at the facility
  let employees;
  try {
    employees = await Employee.find({assignedFacility: facility._id});
  } catch (err) {
    res.status(500).json({message: err.message});
    return;
  }

  // create a new schedule
  schedule = new Schedule({
    facilityId: facility._id,
  });

  const shifts = scheduling.computeShifts(facility.operatingHours.start,
      facility.operatingHours.end,
      facility.numberShifts);

  // create a new schedule entry for each staff
  for (const employee of employees) {
    // randomly select a shift
    const shift = shifts[Math.floor(Math.random() * shifts.length)];

    const scheduleEntry = new ScheduleEntry({
      staffId: employee._id,
      start: shift.start,
      end: shift.end,
    });

    // we fill the shifts field of the schedule
    schedule.shifts.push(scheduleEntry);
  }


  try {
    const newSchedule = await schedule.save();
    res.status(201).json(newSchedule);
  } catch (err) {
    // something wrong with the user input
    res.status(400).json({message: err.message});
  }
});

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
  // set req.params.id for the next middleware
  req.params.id = schedule.facilityId;
  next();
}

module.exports = {router, getSchedule};
