// unit tests for ../routes/schedules.js

const {getSchedule} = require('../routes/schedules');
const Schedule = require('../models/Schedule');
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
      facilityId: 'fhsfafs194u90fs',
      shifts: {
        start: '9:00 AM',
        end: '3:00 PM',
      },
    };
    Schedule.findById.mockResolvedValue(schedule);
    req.params.id = 'someScheduleId';

    await getSchedule(req, res, next);

    expect(res.schedule).toEqual(schedule);
    expect(next).toBeCalled();
  });
});
