const {getEmployee} = require('../../routes/employees');
const Employee = require('../../models/Employee');
const httpMocks = require('node-mocks-http');
const mongoose = require('mongoose');
const User = require('../../models/User');
const Facility = require('../../models/Facility');

const {
  getAllController,
  getOneController,
  createController,
  patchController,
  deleteController,
} = require('../../controllers/employeeController');

describe('Controller functions for /employees', () => {
  let req;
  let res;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    Employee.find = jest.fn().mockResolvedValue([
      {
        _id: '123',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phoneNumber: '123-456-7890',
        address: {
          street: '123 Main St',
          city: 'Springfield',
          state: 'IL',
          postalCode: '62704',
          country: 'USA',
        },
        skillLevel: 7,
        employeeOf: '888',
        manager: '999',
      },
      {
        _id: '456',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phoneNumber: '321-654-0987',
        address: {
          street: '456 Elm St',
          city: 'Anytown',
          state: 'CA',
          postalCode: '90210',
          country: 'USA',
        },
        skillLevel: 5,
        employeeOf: '888',
        manager: '999',
      },
    ]);
    Facility.find = jest.fn().mockResolvedValue([
      {
        _id: '888',
        facilityName: 'metro boomin want some more',
        facilityType: 'restaurant',
        operatingHours: {
          start: '11:00',
          end: '12:00',
        },
        employees: [
          '123',
          '456',
        ],
        manager: '999',
      },
    ]);
    User.find = jest.fn().mockResolvedValue([
      {
        _id: '999',
        name: '21 savage',
        email: '4l@email.com',
        password: 'firstpersonshootermode',
        managedFacility: '888',
      },
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllController', () => {
    beforeEach(() => {
      req = httpMocks.createRequest({
        user: {
          _id: '999',
        },
      });
      res = httpMocks.createResponse();
    });

    it('should retrieve all employees for the user-managed facility',
        async () => {
          User.findById = jest.fn().mockResolvedValue({
            _id: '999',
            managedFacility: '888',
          });

          await getAllController(req, res);

          expect(User.findById).toHaveBeenCalledWith('999');
          expect(Employee.find).toHaveBeenCalledWith({employeeOf: '888'});
          expect(res.statusCode).toBe(200);
          expect(res._getJSONData()).toStrictEqual([
            {
              _id: '123',
              name: 'John Doe',
              email: 'john.doe@example.com',
              phoneNumber: '123-456-7890',
              address: {
                street: '123 Main St',
                city: 'Springfield',
                state: 'IL',
                postalCode: '62704',
                country: 'USA',
              },
              skillLevel: 7,
              employeeOf: '888',
              manager: '999',
            },
            {
              _id: '456',
              name: 'Jane Smith',
              email: 'jane.smith@example.com',
              phoneNumber: '321-654-0987',
              address: {
                street: '456 Elm St',
                city: 'Anytown',
                state: 'CA',
                postalCode: '90210',
                country: 'USA',
              },
              skillLevel: 5,
              employeeOf: '888',
              manager: '999',
            },
          ]);
        });

    it('should return 404 when the user does not manage a facility',
        async () => {
          User.findById = jest.fn().mockResolvedValue({
            _id: '999',
            // No managedFacility in this mock
          });

          await getAllController(req, res);

          expect(res.statusCode).toBe(404);
          expect(res._getJSONData()).toEqual({
            message: 'No facility managed by this user',
          });
        });

    it('should return 500 on database error', async () => {
      User.findById = jest.fn().mockRejectedValue(new Error('Database error'));

      await getAllController(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({message: 'Database error'});
    });
  });

  describe('getOneController', () => {
    it('should return employee with id 123', async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      req.params.id = '123';

      res.employee = {
        _id: '123',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phoneNumber: '123-456-7890',
        address: {
          street: '123 Main St',
          city: 'Springfield',
          state: 'IL',
          postalCode: '62704',
          country: 'USA',
        },
        skillLevel: 7,
      };

      await getOneController(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData().employee).toStrictEqual({
        _id: '123',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phoneNumber: '123-456-7890',
        address: {
          street: '123 Main St',
          city: 'Springfield',
          state: 'IL',
          postalCode: '62704',
          country: 'USA',
        },
        skillLevel: 7,
      });
    });
  });

  describe('createController', () => {
    let req; let res;
    let mockUserId; let mockFacilityId;

    beforeEach(() => {
      mockUserId = new mongoose.Types.ObjectId();
      mockFacilityId = new mongoose.Types.ObjectId();

      req = httpMocks.createRequest({
        user: {
          _id: mockUserId,
        },
        body: {
          name: 'New Employee',
          email: 'new.employee@example.com',
          phoneNumber: '123-456-7890',
          address: {
            street: '100 New St',
            city: 'New City',
            state: 'NC',
            postalCode: '10000',
            country: 'Newland',
          },
          skillLevel: 6,
        },
      });
      res = httpMocks.createResponse();

      User.findById = jest.fn().mockResolvedValue({
        _id: mockUserId,
        managedFacility: mockFacilityId,
      });

      Employee.prototype.save = jest.fn().mockResolvedValue({
        _id: new mongoose.Types.ObjectId(),
        ...req.body,
        employeeOf: mockFacilityId,
        manager: mockUserId,
      });

      Facility.findByIdAndUpdate = jest.fn().mockResolvedValue({});
    });

    it('should create a new employee and add them to a facility', async () => {
      await createController(req, res);

      expect(User.findById).toHaveBeenCalledWith(mockUserId);
      expect(Employee.prototype.save).toHaveBeenCalled();
      expect(Facility.findByIdAndUpdate).toHaveBeenCalledWith(
          mockFacilityId,
          {$push: {employees: expect.any(mongoose.Types.ObjectId)}},
      );
      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toEqual(expect.objectContaining({
        name: 'New Employee',
        email: 'new.employee@example.com',
        phoneNumber: '123-456-7890',
        address: {
          street: '100 New St',
          city: 'New City',
          state: 'NC',
          postalCode: '10000',
          country: 'Newland',
        },
        skillLevel: 6,
      }));
    });

    it('should return 400 when user does not manage a facility', async () => {
      User.findById = jest.fn().mockResolvedValue({
        _id: mockUserId,
      });

      await createController(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({
        message: 'User does not manage a facility',
      });
    });

    it('should return 400 on database error during employee creation',
        async () => {
          Employee.prototype.save = jest.fn().mockRejectedValue(
              new Error('Database error'));

          await createController(req, res);

          expect(res.statusCode).toBe(400);
          expect(res._getJSONData()).toEqual({message: 'Database error'});
        });
  });

  describe('patchController', () => {
    const mockEmployeeOfId = new mongoose.Types.ObjectId();
    const mockManagerId = new mongoose.Types.ObjectId();
    beforeEach(() => {
      res.employee = {
        _id: '123',
        name: 'original',
        email: 'original@email.com',
        phoneNumber: '000-000-0000',
        address: {
          street: 'originalstreet',
          city: 'originalcity',
          state: 'OG',
          postalCode: '11111',
          country: 'USA',
        },
        skillLevel: 1,
        employeeOf: mockEmployeeOfId,
        manager: mockManagerId,
        save: jest.fn().mockResolvedValue({
          _id: '123',
          name: 'updated',
          email: 'updated@email.com',
          phoneNumber: '111-111-1111',
          address: {
            street: 'newstreet',
            city: 'new york',
            state: 'NY',
            postalCode: '22222',
            country: 'USA',
          },
          skillLevel: 10,
        // employeeOf: mockEmployeeOfId,
        // manager: mockManagerId,
        }),
      };
    });

    it('should update employee properties', async () => {
      req.params.id = '123';
      req.body = {
        name: 'updated',
        email: 'updated@email.com',
        phoneNumber: '111-111-1111',
        address: {
          street: 'newstreet',
          city: 'new york',
          state: 'NY',
          postalCode: '22222',
          country: 'USA',
        },
        skillLevel: 10,
      };

      await patchController(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toStrictEqual({
        _id: '123',
        name: 'updated',
        email: 'updated@email.com',
        phoneNumber: '111-111-1111',
        address: {
          street: 'newstreet',
          city: 'new york',
          state: 'NY',
          postalCode: '22222',
          country: 'USA',
        },
        skillLevel: 10,
      // employeeOf: mockEmployeeOfId,
      // manager: mockManagerId,
      });
    });

    it('should return 400 on database error during update', async () => {
      res.employee.save = jest.fn().mockRejectedValue(
          new Error('Database error'),
      );

      await patchController(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toStrictEqual({
        message: 'Database error',
      });
    });
  });

  describe('deleteController', () => {
    let req; let res;
    let mockFacilityId; let mockEmployeeId;

    beforeEach(() => {
      mockFacilityId = '888'; // Mock facility ID from overall setup
      mockEmployeeId = '123'; // Mock employee ID for the first test

      req = httpMocks.createRequest({
        params: {
          id: mockEmployeeId,
        },
      });
      res = httpMocks.createResponse();

      // Mock the specific employee that will be deleted
      res.employee = {
        _id: mockEmployeeId,
        employeeOf: mockFacilityId,
        deleteOne: jest.fn().mockResolvedValue({}),
      };

      // Mock the Facility.findByIdAndUpdate specifically for this test
      Facility.findByIdAndUpdate = jest.fn().mockResolvedValue({});
    });

    it('should delete an employee and update facility', async () => {
      await deleteController(req, res);

      expect(res.employee.deleteOne).toHaveBeenCalled();
      expect(Facility.findByIdAndUpdate).toHaveBeenCalledWith(
          mockFacilityId,
          {$pull: {employees: mockEmployeeId}},
      );
      expect(res.statusCode).toBe(204);
    });

    it('should return 500 on database error during deletion', async () => {
      // Changing the employee ID for the second test
      req.params.id = '420';
      res.employee._id = '420';
      res.employee.deleteOne = jest.fn().mockRejectedValue(
          new Error('Database error'));

      await deleteController(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toStrictEqual({
        message: 'Database error',
      });
    });
  });

  describe('Middleware: getEmployee', () => {
    let req;
    let res;
    let next;

    beforeAll(() => {
      jest.mock('../../models/Employee');
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    beforeEach(() => {
      req = httpMocks.createRequest();
      res = httpMocks.createResponse();
      next = jest.fn();

      Employee.findById = jest.fn((id) => {
        if (id === '123') {
          return Promise.resolve({
            _id: '123',
            name: 'John Doe',
            email: 'john.doe@example.com',
            phoneNumber: '123-456-7890',
            address: {
              street: '123 Main St',
              city: 'Springfield',
              state: 'IL',
              postalCode: '62704',
              country: 'USA'},
            employeeOf: new mongoose.Types.ObjectId(),
            manager: new mongoose.Types.ObjectId(),
          });
        } else {
          return Promise.resolve(null);
        }
      });
    });

    it('should return employee with id 123', async () => {
      req.params.id = '123';

      await getEmployee(req, res, next);

      expect(res.employee._id).toEqual('123');
      expect(res.employee.name).toEqual('John Doe');
      expect(res.employee.email).toEqual('john.doe@example.com');
      expect(res.employee.phoneNumber).toEqual('123-456-7890');
      expect(res.employee.address.street).toEqual('123 Main St');
      expect(res.employee.address.city).toEqual('Springfield');
      expect(res.employee.address.state).toEqual('IL');
      expect(res.employee.address.postalCode).toEqual('62704');
      expect(res.employee.address.country).toEqual('USA');
      expect(res.employee.employeeOf).toBeInstanceOf(mongoose.Types.ObjectId);
      expect(res.employee.manager).toBeInstanceOf(mongoose.Types.ObjectId);
      expect(next).toBeCalled();
    });

    it('should not find employee with id 456', async () => {
      req.params.id = '456';

      await getEmployee(req, res, next);

      expect(res.employee).toBeUndefined();
      expect(res.statusCode).toBe(404);
    });
  });
});
