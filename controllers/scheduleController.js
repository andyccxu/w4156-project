const moment = require('moment');

const scheduling = require('../services/scheduling');
const {Schedule, ScheduleEntry} = require('../models/Schedule');
const Employee = require('../models/Employee');
const Facility = require('../models/Facility');
const User = require('../models/User');


/**
 * Controller for route GET /schedules
 *
 * @param {*} req Express.js request object
 * @param {*} res Express.js response object
 */
async function getAllController(req, res) {
  try {
    // get the facility registered by user
    const user = await User.findById(req.user._id);
    if (!user.managedFacility) {
      return res.status(404).json({
        message: 'No facility managed by this user'});
    }

    const facilityId = user.managedFacility;

    const schedules = await Schedule.find({facilityId: facilityId});
    res.json(schedules);
  } catch (err) {
    res.status(500).json({message: err.message});
  }
}

/**
 * Controller for route GET /schedules/{:id}
 *
 * @param {*} req Express.js request object
 * @param {*} res Express.js response object
 */
async function getOneController(req, res) {
  // return 200 ok
  res.status(200).json({
    schedule: res.schedule,
  });
}

/**
 * Controller for route CREATE /schedules
 * @param {*} req Express.js request object
 * @param {*} res Express.js response object
 */
async function createController(req, res) {
  // Find the facility by ID
  const facility = await Facility.findOne({_id: req.body.facility});
  if (!facility) {
    res.status(404).json({message: 'Cannot find the facility',
      facility: req.body.facility});
    return;
  }

  // Create a new schedule for the facility
  schedule = new Schedule({
    facilityId: facility._id,
  });

  // Compute shifts based on operating hours
  const shifts = scheduling.computeShifts(facility.operatingHours.start,
      facility.operatingHours.end,
      facility.numberShifts);

  // Check for employee availability
  const employeeIds = facility.employees;
  if (employeeIds.length === 0) {
    return res.status(400).json({
      message: 'No employees available for scheduling',
    });
  }

  // Determine the strategy based on the number of shifts and employees
  if (shifts.length < employeeIds.length) {
    // Case 1: Fewer shifts than employees
    // Assign each shift to a different employee
    const assignedEmployees = new Set();
    shifts.forEach((shift, index) => {
      if (index < employeeIds.length) {
        schedule.shifts.push(new ScheduleEntry({
          employeeId: employeeIds[index],
          start: shift.start,
          end: shift.end,
        }));
        assignedEmployees.add(employeeIds[index]);
      }
    });

    // Randomly assign remaining employees to the available shifts
    const unassignedEmployees = employeeIds.filter(
        (id) => !assignedEmployees.has(id),
    );
    unassignedEmployees.forEach((employeeId) => {
      const randomShiftIndex = Math.floor(Math.random() * shifts.length);
      const shift = shifts[randomShiftIndex];
      schedule.shifts.push(new ScheduleEntry({
        employeeId: employeeId,
        start: shift.start,
        end: shift.end,
      }));
    });
  } else {
    // Case 2: As many or more shifts than employees
    // Assign each employee to a shift sequentially
    let assignedShifts = 0;
    for (const employeeId of employeeIds) {
      if (assignedShifts < shifts.length) {
        const shift = shifts[assignedShifts++];
        schedule.shifts.push(new ScheduleEntry({
          employeeId: employeeId, start: shift.start, end: shift.end,
        }));
      }
    }

    // Fetch employee details including skill levels
    const employees = await Employee.find({_id: {$in: employeeIds}})
        .sort({skillLevel: -1});

    // Randomly assign remaining shifts, prioritizing higher skill levels
    while (assignedShifts < shifts.length) {
      const weightedIndex = weightedRandomIndex(employees);
      const shift = shifts[assignedShifts++];
      schedule.shifts.push(new ScheduleEntry({
        employeeId: employees[weightedIndex]._id,
        start: shift.start, end: shift.end,
      }));
    }
  }

  // Helper function for weighted random selection
  // eslint-disable-next-line require-jsdoc
  function weightedRandomIndex(employees) {
    const totalSkillLevel = employees.reduce(
        (acc, cur) => acc + cur.skillLevel, 0,
    );
    let randomNum = Math.random() * totalSkillLevel;
    for (let i = 0; i < employees.length; i++) {
      randomNum -= employees[i].skillLevel;
      if (randomNum <= 0) return i;
    }
    return employees.length - 1; // Fallback in case of rounding errors
  }


  // const shifts = scheduling.computeShifts(facility.operatingHours.start,
  //     facility.operatingHours.end,
  //     facility.numberShifts);

  // // create a new schedule entry for each staff
  // for (const employeeId of facility.employees) {
  //   const employee = await Employee.findOne({_id: employeeId});
  //   // randomly select a shift
  //   const shift = shifts[Math.floor(Math.random() * shifts.length)];

  //   const scheduleEntry = new ScheduleEntry({
  //     employeeId: employee._id,
  //     start: shift.start,
  //     end: shift.end,
  //   });

  //   // we fill the shifts field of the schedule
  //   schedule.shifts.push(scheduleEntry);
  // }


  try {
    const newSchedule = await schedule.save();
    res.status(201).json(newSchedule);
  } catch (err) {
    // something wrong with the user input
    res.status(400).json({message: err.message});
  }
}

/**
 * Controller for route PATCH /schedules/{:id}
 *
 * @param {*} req Express.js request object
 * @param {*} res Express.js response object
 */
async function patchController(req, res) {
  schedule = res.schedule;
  facility = res.facility;

  // loop over the shifts in the request body
  for (const shift of req.body.shifts) {
    // validate the input
    const instance = new ScheduleEntry({
      employeeId: shift.employeeId,
      start: shift.start,
      end: shift.end,
      days: shift.days,
    });

    try {
      await instance.validate();
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
      return;
    }

    // check if the employee exists
    if (!facility.employees.includes(shift.employeeId)) {
      res.status(400).json({
        employeeId: shift.employeeId,
        message: 'Error: Employee does not work at the facility.',
      });
      return;
    }

    // check input time format
    if (!moment(shift.start, 'HH:mm', true).isValid() ||
    !moment(shift.end, 'HH:mm', true).isValid()) {
      res.status(400).json({
        start: shift.start,
        end: shift.end,
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
        {_id: res.schedule._id},
        {$set: {shifts: req.body.shifts}},
    );
  } catch (err) {
    res.status(500).json({message: err.message});
    return;
  }

  res.status(200).json({
    message: 'Success: shifts schedule updated',
  });
}

/**
 * Controller for route DELETE /schedules/{:id}
 *
 * @param {*} req Express.js request object
 * @param {*} res Express.js response object
 */
async function deleteController(req, res) {
  try {
    await res.schedule.deleteOne();
    return res.status(204).end();
  } catch (err) {
    res.status(500).json({message: err.message});
  }
}

// export all functions
module.exports = {
  getAllController,
  getOneController,
  createController,
  patchController,
  deleteController,
};
