const {getEmployee} = require('../routes/employees');
const Employee = require('../models/Employee');
const httpMocks = require('node-mocks-http');

jest.mock('../models/Employee');

describe('Middleware getEmployee', () => {
  let req; let res; let next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it('should find an employee member', async () => {
    // eslint-disable-next-line max-len
    const employee = {name: 'Alice', _id: 'some_employee_id', manager: 'some_user_id'};

    Employee.findOne.mockResolvedValue(employee);
    req.params = {id: 'some_employee_id'};
    req.user = {_id: 'some_user_id'};

    await getEmployee(req, res, next);

    expect(res.employee).toBeDefined();
    expect(res.employee).toBe(employee);
    expect(next).toBeCalled();
  });
});
