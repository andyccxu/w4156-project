// unit tests for ../routes/schedules.js

const {getSchedule} = require('../routes/schedules');
const Schedule = require('../models/Schedule').Schedule;
const httpMocks = require('node-mocks-http');

jest.mock('../models/Schedule');

describe('getSchedule Middleware', () => {
  let req; let res; let next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it('finds a schedule by ID', async () => {
    const schedule = {
      facilityId: 'someFacilityId',
      shifts: [],
    };
    Schedule.findById.mockResolvedValue(schedule);
    req.params.id = 'someScheduleId';

    await getSchedule(req, res, next);

    expect(res.schedule).toEqual(schedule);
    expect(next).toBeCalled();
  });
});
