// import moment
const moment = require('moment');


/**
 * Given the start and end time in "HH:mm" format, and the
 * number of shifts, return a list of shifts
 *
 * @async
 * @param {*} start The start time of hours of operation.
 * @param {*} end The end time of hours of operation.
 * @param {*} numShifts The number of shifts required by a facility.
 * @return {[Object]} A list of evenly splitted shifts.
 */
function computeShifts(start, end, numShifts) {
  // convert the start and end time to moment objects
  start = moment(start, 'HH:mm');
  end = moment(end, 'HH:mm');

  // compute the length of each shift
  shiftLength = end.diff(start, 'minutes') / numShifts;

  // create a list of shifts
  shifts = [];
  for (let i = 0; i < numShifts; i++) {
    shifts.push({
      start: start.format('HH:mm'),
      end: start.add(shiftLength, 'minutes').format('HH:mm'),
    });
  }

  return shifts;
}


/**
 * Check that the time under check is within the operating hours
 * @date 11/6/2023 - 10:36:33 PM
 *
 * @param {*} timeUnderCheck
 * @param {*} start
 * @param {*} end
 * @return {*}
 */
function isOperatingTime(timeUnderCheck, start, end) {
  // convert the start and end time to moment objects
  start = moment(start, 'HH:mm');
  end = moment(end, 'HH:mm');

  // convert the time under check to a moment object
  timeUnderCheck = moment(timeUnderCheck, 'HH:mm');

  // check if the time under check is within the operating hours
  return timeUnderCheck.isBetween(start, end, undefined, '[]');
}

// export the function
module.exports = {
  computeShifts,
  isOperatingTime,
};
