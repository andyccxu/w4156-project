const {getFacility} = require('../routes/facilities');
const Facility = require('../models/Facility');
const httpMocks = require('node-mocks-http');

jest.mock('../models/Facility');

describe('getFacility Middleware', () => {
  let req; let res; let next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it('finds a facility by ID', async () => {
    const facility = {facilityName: 'Facility 1'};

    Facility.findById.mockResolvedValue(facility);
    req.params = {id: 'someFacilityId'};

    await getFacility(req, res, next);

    expect(res.facility).toBeDefined();
    expect(next).toBeCalled();
  });

  it('returns 404 if facility not found', async () => {
    Facility.findById.mockResolvedValue(null);

    req.params = {id: 'someInvalidId'};

    await getFacility(req, res, next);

    expect(res.statusCode).toBe(404);
    const data = res._getJSONData();
    expect(data).toMatchObject({message: 'Cannot find the facility'});
  });

  it('returns 500 for database errors', async () => {
    Facility.findById.mockRejectedValue(new Error('Database error'));

    req.params = {id: 'someId'};

    await getFacility(req, res, next);

    expect(res.statusCode).toBe(500);
  });
});
