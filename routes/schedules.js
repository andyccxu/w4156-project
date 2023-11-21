const express = require('express');
const moment = require('moment');

// eslint-disable-next-line new-cap
const router = express.Router();

const {Schedule, ScheduleEntry} = require('../models/Schedule');
const Facility = require('../models/Facility');
const Employee = require('../models/Employee');

const scheduling = require('../service/scheduling');


// GET all shifting schedules
router.get('/', async (req, res) => {
  try {
    const schedules = await Schedule.find();
    res.json(schedules);
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});

// GET one shifting schedule
router.get('/:id', getSchedule, (req, res) => {
  res.json({
    sid: req.params.id,
    schedule: res.schedule,
  });
});

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
router.patch('/:id', getSchedule, getFacility, async (req, res) => {
  schedule = res.schedule;
  facility = res.facility;

  // loop over the shifts in the request body
  for (const shift of req.body.shifts) {
    // validate the input
    const instance = new ScheduleEntry({
      staffId: shift.staffId,
      start: shift.start,
      end: shift.end,
      days: shift.days,
    });

    try {
      await instance.validate();
    } catch (error) {
      res.status(400).json({
        error: error.message,
        message: 'Error: Invalid input format.',
      });
      return;
    }

    // check input time format
    if (!moment(shift.start, 'HH:mm', true).isValid() ||
    !moment(shift.end, 'HH:mm', true).isValid()) {
      res.status(400).json({
        input_start: shift.start,
        input_end: shift.end,
        message: 'Error: Invalid start/end time format. ' +
        'Strict parsing with format HH:mm.',
      });
      return;
    }

    // check start time < end time
    if (moment(shift.start, 'HH:mm').isAfter(moment(shift.end, 'HH:mm'))) {
      res.status(400).json({
        start: shift.start,
        end: shift.end,
        message: 'Error: Start time must be before end time.',
      });
      return;
    }

    // check the facility opening time
    startValid = scheduling.isOperatingTime(shift.start,
        facility.operatingHours.start,
        facility.operatingHours.end);
    endValid = scheduling.isOperatingTime(shift.end,
        facility.operatingHours.start,
        facility.operatingHours.end);

    if (!startValid || !endValid) {
      res.status(400).json({
        start: shift.start,
        end: shift.end,
        message: 'Error: Start/end time is out of the operating hours.',
      });
      return;
    }
  };

  // update the shifts property of the schedule
  try {
    await Schedule.findOneAndUpdate(
        {_id: req.params.id},
        {shifts: req.body.shifts},
    );
  } catch (err) {
    res.status(500).json({message: err.message});
    return;
  }

  res.status(200).json({
    message: 'Success: shifts schedule updated',
  });
});

// DELETE one schedule
router.delete('/:id', getSchedule, async (req, res) => {
  try {
    await res.schedule.deleteOne();
    res.json({message: 'Deleted schedule'});
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});


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
