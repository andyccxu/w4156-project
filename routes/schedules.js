const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

const Schedule = require('../models/Schedule');
const Facility = require('../models/Facility');
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
  const schedule = new Schedule({
    facilityId: req.body.facility,
  });

  try {
    const newSchedule = await schedule.save();
    res.status(201).json(newSchedule);
  } catch (err) {
    // something wrong with the user input
    res.status(400).json({message: err.message});
  }
});

// PATCH update new shift hours
router.patch('/:id', scheduleShifts, (req, res) => {
  res.status(200).json({
    status: 'Success: new shifts scheduled',
    // message: 'new shifts scheduled: ' + res.schedule.shifts,
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
 * @date 10/15/2023 - 7:32:32 PM
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
 * Make a new shift schedule for an employee
 * @date 10/15/2023 - 7:33:37 PM
 *
 * @async
 * @param {*} req The request object.
 * @param {*} res The response object.
 * @param {*} next The next function executes the succeeding
 * middleware when invoked.
 * @return {unknown}
 */
async function scheduleShifts(req, res, next) {
  try {
    schedule = await Schedule.findById(req.params.id);
    facility = await Facility.findById(schedule.facilityId);

    if (schedule == null) {
      return res.status(404).json({
        message: 'Error: Cannot find the schedule'});
    }
    if (facility == null) {
      return res.status(404).json({
        message: 'Error: Cannot find the facility refered by the schedule'});
    }
    if (schedule.shifts['start'] != undefined) {
      return res.status(405).json({
        message: 'Error: Shifts are already scheduled'});
    }
  } catch (err) {
    return res.status(500).json({message: err.message});
  }


  // compute the shifts hour based on the starting time
  // of the facility and the target working hours for the
  // employee
  start = new Date();
  const [startHour, startMinute] = scheduling.parseTime(
      facility.operatingHours.start);
  start.setHours(startHour);
  start.setMinutes(startMinute);
  start.setSeconds(0);

  end = new Date(start.getTime());
  end.setHours(start.getHours() + schedule.target_hours);

  workingHours = {
    start: start.toLocaleTimeString(),
    end: end.toLocaleTimeString(),
  };

  // find the one schedule and fill up its shifts field
  const filter = {_id: req.params.id};
  const update = {shifts: workingHours};

  await Schedule.findOneAndUpdate(filter, update);

  res.schedule = schedule;
  next();
}


module.exports = router;
