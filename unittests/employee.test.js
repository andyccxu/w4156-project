const {getEmployee} = require('../routes/employees');
const Employee = require('../models/Employee');
const httpMocks = require('node-mocks-http');

jest.mock('../models/Employee');

describe('getEmployee Middleware', () => {
  let req; let res; let next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it('finds an employee member by ID', async () => {
    const employee = {name: 'Alice'};
    Employee.findById.mockResolvedValue(employee);
    req.params.id = 'someEmployeeId';

    await getEmployee(req, res, next);

    expect(res.employee).toEqual(employee);
    expect(next).toBeCalled();
  });
});
