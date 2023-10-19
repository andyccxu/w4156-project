const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

const Schedule = require('../models/Schedule');

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
  res.send(res.schedule.name);
});

// POST personal schedule of one employee
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

// Put newly scheduled working/shift hours
router.patch('/scheduleshifts', scheduleShifts, (req, res) => {
  res.send('success: shifts made = ' + res.schedule.shifts);
});

// Delete one schedule
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
 * ? varies for each day
 * ? based on employer's need on different time slots
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
    schedule = await Schedule.findById(req.body.sid);
    if (schedule == null) {
      return res.status(404).json({message: 'Cannot find the schedule'});
    }
  } catch (err) {
    return res.status(500).json({message: err.message});
  }

  start = new Date(2023, 0, 0, 8, 0); // 8:00 am
  end = new Date(start.getTime());
  end.setHours(start.getHours() + schedule.target_hours);
  // TODO: update this naive scheduling algorithm
  workingHours = {
    start: start.toLocaleTimeString(),
    end: end.toLocaleTimeString(),
  };

  const filter = {_id: req.body.sid};
  const update = {shifts: workingHours};

  await Schedule.findOneAndUpdate(filter, update);

  res.schedule = schedule;
  next();
}


module.exports = router;
