const {getStaff} = require('../routes/staff');
const Staff = require('../models/Staff');
const httpMocks = require('node-mocks-http');

jest.mock('../models/Staff');

describe('getStaff Middleware', () => {
  let req; let res; let next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it('finds a staff member by ID', async () => {
    const staff = {name: 'Alice'};
    Staff.findById.mockResolvedValue(staff);
    req.params.id = 'someStaffId';

    await getStaff(req, res, next);

    expect(res.staff).toEqual(staff);
    expect(next).toBeCalled();
  });
});
