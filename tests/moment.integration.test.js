// external integration tests
// for the third-party library: moment.js

const {isOperatingTime, computeShifts} = require('../services/scheduling');

describe('isOperatingTime', () => {
  test('should return true if the time is within the operating hours', () => {
    expect(isOperatingTime('09:00', '08:00', '17:00')).toBe(true);
  });

  test('should return false if the time is outside the operating hours', () => {
    expect(isOperatingTime('07:00', '08:00', '17:00')).toBe(false);
  });

  // edge cases
  test('should return true if the time is at the start', () => {
    expect(isOperatingTime('08:00', '08:00', '17:00')).toBe(true);
  });

  test('should return true if the time is at the end', () => {
    expect(isOperatingTime('17:00', '08:00', '17:00')).toBe(true);
  });
}); ;

describe('computeShifts', () => {
  test('should return a list of evenly splitted shifts', () => {
    const shifts = computeShifts('08:00', '17:00', 3);
    expect(shifts).toEqual([
      {start: '08:00', end: '11:00'},
      {start: '11:00', end: '14:00'},
      {start: '14:00', end: '17:00'},
    ]);
  });

  test('should return the operating hours if no need to split', () => {
    const shifts = computeShifts('08:00', '17:00', 1);
    expect(shifts).toEqual([
      {start: '08:00', end: '17:00'},
    ]);
  });
});
