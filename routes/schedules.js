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
    // TODO: to be filled
    name: req.body.name,
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
router.put('/makeshifts/:id', findShiftHours, (req, res) => {
  console.log('makeshifts: ', res.schedule.working_hours);
  res.send('success');
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
async function findShiftHours(req, res, next) {
  try {
    schedule = await Schedule.findById(req.params.id);
    if (schedule == null) {
      return res.status(404).json({message: 'Cannot find the schedule'});
    }
  } catch (err) {
    return res.status(500).json({message: err.message});
  }

  workingHours = [];
  // hardcoded: working hours range in consideration
  start = new Date(2023, 0, 0, 8, 0);
  end = new Date(2023, 0, 0, 20, 59);

  // TODO: algorithms to be filled
  workingHours = [[start, end]];

  const filter = {_id: req.params.id};
  const update = {working_hours: workingHours};

  await Schedule.findOneAndUpdate(filter, update);

  res.schedule = schedule;
  next();
}


module.exports = router;
