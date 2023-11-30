const httpMocks = require('node-mocks-http');
const mongoose = require('mongoose');

const Facility = require('../../models/Facility');
const User = require('../../models/User');

// middleware function
const {getFacility} = require('../../routes/facilities');

// controller functions
const {
  getController,
  createController,
  patchController,
  deleteController,
} = require('../../controllers/facilityController');


describe('Middleware: getFacility', () => {
  let req; let res; let next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();

    Facility.findOne = jest.fn((filter) => {
      // we find the facility by the manager id
      if (filter.manager === '123') {
        return Promise.resolve({
          _id: '123',
          facilityName: 'facility 123',
        });
      } else {
        return Promise.resolve(null);
      }
    });
  });

  it('should return facility with id 123', async () => {
    req.user = {_id: '123'};

    await getFacility(req, res, next);

    expect(res.facility).toEqual({
      _id: '123',
      facilityName: 'facility 123',
    });
  });

  it('should return 404 when facility not found', async () => {
    req.user = {_id: '456'};

    await getFacility(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({
      message: 'No facility managed by this user',
    });
  });

  it('should return 500 when database error', async () => {
    Facility.findOne = jest.fn().mockRejectedValue(new Error('Database error'));

    req.user = {_id: '456'};

    await getFacility(req, res, next);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({
      message: 'Database error',
    });
  });
});


describe('Facility Controller', () => {
  let req; let res;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('deleteController', () => {
    beforeEach(() => {
      // mock user.findById
      User.findById = jest.fn().mockReturnValue({
        name: 'mockedName',
        managedFacility: new mongoose.Types.ObjectId(),
        save: jest.fn().mockReturnThis(),
      });

      req.user = {_id: 'mockedUserId'};

      Facility.deleteOne = jest.fn();
    });

    it('should delete the facility', async () => {
      await deleteController(req, res);
      expect(res.statusCode).toBe(204);
    });

    it('should return 404 when facility not found', async () => {
      User.findById = jest.fn().mockReturnValue({
        name: 'mockedName',
        managedFacility: null,
        save: jest.fn().mockReturnThis(),
      });

      await deleteController(req, res);

      expect(res.statusCode).toBe(404);
    });


    it('should return 500 when database error', async () => {
      // simulate error when calling Facility.deleteOne()
      Facility.deleteOne = jest.fn().mockRejectedValue(
          new Error('Database error'));

      await deleteController(req, res);

      expect(res.statusCode).toBe(500);
    });
  });

  describe('patchController', () => {
    beforeEach(() => {
      // mock res.facility
      res.facility = {
        facilityName: 'mockedFacilityName',
        facilityType: 'mockedFacilityType',
        operatingHours: {
          start: 'mockedStart',
          end: 'mockedEnd',
        },
        numberShifts: 1,
        numberDays: 5,
        manager: 'mockedUserId',
        employees: [],
      };

      // mock res.facility.save()
      res.facility.save = jest.fn().mockReturnThis();
    });

    it('should update the facility', async () => {
      req.body = {
        facilityName: 'facility-test',
        facilityType: 'hospital',
        operatingHours: {
          start: '01:00',
          end: '23:00',
        },
        numberShifts: 1,
        numberDays: 5,
        employees: [new mongoose.Types.ObjectId()],
      };

      await patchController(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(expect.objectContaining({
        facilityName: 'facility-test',
        facilityType: 'hospital',
        operatingHours: {
          start: '01:00',
          end: '23:00',
        },
        numberShifts: 1,
        numberDays: 5,
      }));
    });

    it('should return 400 when database error', async () => {
      res.facility.save = jest.fn().mockRejectedValue(new Error('mockedError'));

      await patchController(req, res);

      expect(res.statusCode).toBe(400);
    });
  });

  describe('createController', () => {
    beforeEach(() => {
      req.body = {
        facilityName: 'facility-test',
        facilityType: 'hospital',
        operatingHours: {
          start: '01:00',
          end: '23:00',
        },
        numberShifts: 1,
        numberDays: 5,
      };

      req.user = {_id: 'mockedUserId'};

      // mock User.findById
      User.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          managedFacility: null,
        }),
        save: jest.fn().mockReturnThis(),
        name: 'mockedName',
      });
    });

    it('should create a new facility', async () => {
      // mock facility.save()
      Facility.prototype.save = jest.fn().mockReturnThis();

      await createController(req, res);

      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toEqual(expect.objectContaining({
        facilityName: 'facility-test',
        facilityType: 'hospital',
        operatingHours: {
          start: '01:00',
          end: '23:00',
        },
        numberShifts: 1,
        numberDays: 5,
      }));
    });

    it('should return 400 when req.body is missing', async () => {
      req.body = null;

      await createController(req, res);

      expect(res.statusCode).toBe(400);
    });
  });

  describe('getController', () => {
    it('should retrieve the facility managed by the user', async () => {
      req.user = {_id: 'mockedUserId'};
      mockedFacility = {
        facilityName: 'mockedFacilityName',
        facilityType: 'mockedFacilityType',
        operatingHours: {
          start: 'mockedStart',
          end: 'mockedEnd',
        },
        numberShifts: 1,
        numberDays: 5,
        manager: 'mockedUserId',
      };
      // mock User.findById by return value
      User.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          managedFacility: mockedFacility,
        }),
        name: 'mockedName',
      });

      await getController(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toStrictEqual(mockedFacility);
    });

    it('should return status code 500 for internal server error', async () => {
      // we leave req.user undefined to trigger an error
      await getController(req, res);
      expect(res.statusCode).toBe(500);
    });

    it('should return status code 404 if the user does not manage a facility',
        async () => {
          req.user = {_id: 'mockedUserId'};
          User.findById = jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
              managedFacility: null,
            }),
            name: 'mockedName',
          });

          await getController(req, res);

          expect(res.statusCode).toBe(404);
        });
  });
});
