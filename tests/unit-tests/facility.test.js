const {getFacility} = require('../../routes/facilities');
const Facility = require('../../models/Facility');
// const User = require('../models/User');
const httpMocks = require('node-mocks-http');

jest.mock('../../models/Facility');
jest.mock('../../models/User');

describe('getFacility Middleware', () => {
  let req; let res; let next;

  beforeEach(() => {
    req = httpMocks.createRequest({
      user: {
        _id: 'userId',
        managedFacility: 'facilityId',
      },
    });
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it('finds a facility by ID and managed by the user', async () => {
    // eslint-disable-next-line max-len
    const facility = {facilityName: 'Facility 1', _id: 'facilityId', manager: 'userId'};

    Facility.findOne.mockResolvedValue(facility);
    req.params = {id: 'facilityId'};

    await getFacility(req, res, next);

    expect(res.facility).toBeDefined();
    expect(res.facility.facilityName).toBe('Facility 1');
    expect(next).toBeCalled();
  });

  // eslint-disable-next-line max-len
  it('returns 404 if facility not found or not managed by the user', async () => {
    Facility.findOne.mockResolvedValue(null);

    req.params = {id: 'someInvalidId'};

    await getFacility(req, res, next);

    expect(res.statusCode).toBe(404);
    const data = res._getJSONData();
    expect(data).toMatchObject({message: 'No facility managed by this user'});
  });

  it('returns 500 for database errors', async () => {
    Facility.findOne.mockRejectedValue(new Error('Database error'));

    req.params = {id: 'someId'};

    await getFacility(req, res, next);

    expect(res.statusCode).toBe(500);
    const data = res._getJSONData();
    expect(data.message).toBe('Database error');
  });
});
