const httpMocks = require('node-mocks-http');

const Schedule = require('../models/Schedule').Schedule;

// middleware function
const {getSchedule} = require('../routes/schedules');


describe('getSchedule Middleware', () => {
  // these objects are all mocked
  let req; let res; let next;

  beforeAll(() => {
    jest.mock('../models/Schedule');
  });

  afterAll(() => {
    // restore the original implementation
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();

    Schedule.findById = jest.fn((id) => {
      if (id === '123') {
        // Mock that the schedule id 123 is in the database
        return Promise.resolve({
          _id: '123',
          shifts: ['some mysterious shifts'],
        });
      } else {
        // Return a promise that resolves with null when the ID is not '123'
        return Promise.resolve(null);
      }
    });
  });

  it('should return schedule with id 123', async () => {
    // mock a request with :id = 123
    req.params.id = '123';

    await getSchedule(req, res, next);

    expect(res.schedule._id).toEqual('123');
    expect(res.schedule.shifts).toEqual(['some mysterious shifts']);
    expect(next).toBeCalled();
  });

  it('should not find schedule with id 456', async () => {
    // mock a request with :id = 456
    req.params.id = '456';

    await getSchedule(req, res, next);

    expect(res.schedule).toBeUndefined();
    // we expect status code 404, id not found
    expect(res.statusCode).toBe(404);
  });
});
