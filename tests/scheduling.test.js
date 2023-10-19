const scheduling = require('../service/scheduling');

test('parseTime() should return [Hour, Minute] for "HH:MM"', () => {
  // parse 08:00
  expect(scheduling.parseTime('8:00')).toEqual([8, 0]);
  // parse 12:22
  expect(scheduling.parseTime('12:22')).toEqual([12, 22]);
  // parse 28:00
  expect(scheduling.parseTime('28:00')).toEqual([]);
  // parse 12:122
  expect(scheduling.parseTime('12:122')).toEqual([]);
  // parse 1:1:1
  expect(scheduling.parseTime('1:1:1')).toEqual([]);
});

test('parseTime() should return [Hour, Minute] for "HH:MM AM/PM"', () => {
  // parse 9:13 AM
  expect(scheduling.parseTime('9:13 AM')).toEqual([9, 13]);
  // parse 8:12 PM
  expect(scheduling.parseTime('8:12 PM')).toEqual([20, 12]);
  // parse 13:12 PM
  expect(scheduling.parseTime('13:12 PM')).toEqual([]);
});

