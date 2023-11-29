const httpMocks = require('node-mocks-http');
const mongoose = require('mongoose');

const Facility = require('../../models/Facility');
const User = require('../../models/User');

// middleware function
const {getFacility} = require('../../routes/facilities');

const {
  getController,
  createController,
  patchController,
  deleteController,
} = require('../../controllers/facilityController');

jest.mock('../../models/User');
jest.mock('../../models/Facility');

describe('Facility Controller', () => {
  let req; let res; let mockUserId; let mockFacilityId;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    mockUserId = new mongoose.Types.ObjectId();
    mockFacilityId = new mongoose.Types.ObjectId();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getController', () => {
    beforeEach(() => {
      req.user = {_id: mockUserId};
    });

    it('should retrieve the facility managed by the user', async () => {
      const mockManagedFacility = {
        _id: mockFacilityId,
        facilityName: 'Example Facility',
        // other facility details
      };

      User.findById = jest.fn().mockResolvedValue({
        _id: mockUserId,
        managedFacility: mockManagedFacility,
      });

      await getController(req, res);

      expect(User.findById).toHaveBeenCalledWith(mockUserId);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(mockManagedFacility);
    });

    it('should return 404 when the user does not manage a facility',
        async () => {
          User.findById = jest.fn().mockResolvedValue({
            _id: mockUserId,
            // No managedFacility
          });

          await getController(req, res);

          expect(User.findById).toHaveBeenCalledWith(mockUserId);
          expect(res.statusCode).toBe(404);
          expect(res._getJSONData()).toEqual({message: 'No facility managed by this user'});
        });

    it('should return 500 on database error', async () => {
      User.findById = jest.fn().mockRejectedValue(new Error('Database error'));

      await getController(req, res);

      expect(User.findById).toHaveBeenCalledWith(mockUserId);
      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({message: 'Database error'});
    });

    // Add any other test cases if needed
  });


  describe('createController', () => {
    beforeEach(() => {
      req.user = {_id: mockUserId};
      req.body = {
        facilityName: 'New Facility',
        facilityType: 'other',
        operatingHours: {start: '08:00', end: '17:00'},
        numberEmployees: 10,
        numberShifts: 1,
        numberDays: 5,
        // Add other facility details as required
      };
    });

    it('should create a new facility', async () => {
      User.findById = jest.fn().mockResolvedValue({
        _id: mockUserId,
        managedFacility: null, // Assuming the user does not manage any facility
      });

      Facility.prototype.save = jest.fn().mockResolvedValue({
        _id: mockFacilityId,
        ...req.body,
        manager: mockUserId,
      });

      User.prototype.save = jest.fn();

      await createController(req, res);

      expect(User.findById).toHaveBeenCalledWith(mockUserId);
      expect(Facility.prototype.save).toHaveBeenCalled();
      expect(User.prototype.save).toHaveBeenCalled();
      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toEqual({
        _id: mockFacilityId,
        ...req.body,
        manager: mockUserId,
      });
    });

    it('should return 400 when user already manages a facility', async () => {
      User.findById = jest.fn().mockResolvedValue({
        _id: mockUserId,
        managedFacility: mockFacilityId, // User already manages a facility
      });

      await createController(req, res);

      expect(User.findById).toHaveBeenCalledWith(mockUserId);
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({message: 'User already manages a facility'});
    });

    it('should return 400 on database error', async () => {
      User.findById = jest.fn().mockResolvedValue({
        _id: mockUserId,
        managedFacility: null,
      });

      Facility.prototype.save = jest.fn().mockRejectedValue(new Error('Database error'));

      await createController(req, res);

      expect(User.findById).toHaveBeenCalledWith(mockUserId);
      expect(Facility.prototype.save).toHaveBeenCalled();
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({message: 'Database error'});
    });

    // Add any other test cases if needed
  });

  describe('patchController', () => {
    beforeEach(() => {
      req.params = {id: mockFacilityId};
      req.body = {
        facilityName: 'Updated Facility Name',
        // Add other fields that you want to update
      };

      req.facility = {
        _id: mockFacilityId,
        facilityName: 'Original Facility Name',
        save: jest.fn().mockResolvedValue({
          _id: mockFacilityId,
          ...req.body,
        }),
        // Include original fields of the facility
      };
    });

    it('should update facility properties', async () => {
      await patchController(req, res);

      expect(req.facility.save).toHaveBeenCalled();
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({
        _id: mockFacilityId,
        ...req.body,
      });
    });

    it('should handle no updates gracefully', async () => {
      // Assuming no fields are updated
      req.body = {};

      await patchController(req, res);

      expect(req.facility.save).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(req.facility);
    });

    it('should return 400 on database error during update', async () => {
      req.facility.save = jest.fn().mockRejectedValue(new Error('Database error'));

      await patchController(req, res);

      expect(req.facility.save).toHaveBeenCalled();
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({message: 'Database error'});
    });

    // Add any other test cases if needed
  });


  describe('deleteController', () => {
    beforeEach(() => {
      req.user = {_id: mockUserId};
    });

    it('should delete the facility managed by the user', async () => {
      User.findById = jest.fn().mockResolvedValue({
        _id: mockUserId,
        managedFacility: mockFacilityId,
      });

      Facility.deleteOne = jest.fn().mockResolvedValue({});

      await deleteController(req, res);

      expect(User.findById).toHaveBeenCalledWith(mockUserId);
      expect(Facility.deleteOne).toHaveBeenCalledWith({_id: mockFacilityId});
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({message: 'Deleted facility'});
    });

    it('should return 404 when the user does not manage a facility', async () => {
      User.findById = jest.fn().mockResolvedValue({
        _id: mockUserId,
        // No managedFacility
      });

      await deleteController(req, res);

      expect(User.findById).toHaveBeenCalledWith(mockUserId);
      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toEqual({message: 'No facility managed by this user'});
    });

    it('should return 500 on database error', async () => {
      User.findById = jest.fn().mockRejectedValue(new Error('Database error'));

      await deleteController(req, res);

      expect(User.findById).toHaveBeenCalledWith(mockUserId);
      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({message: 'Database error'});
    });

    // Add any other test cases if needed
  });


  // Add any other helper or middleware tests if needed

  describe('Middleware: findFacility', () => {
    let req; let res; let next; let mockFacilityId;

    beforeAll(() => {
      jest.mock('../models/Facility'); // Mock the Facility model
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    beforeEach(() => {
      req = httpMocks.createRequest();
      res = httpMocks.createResponse();
      next = jest.fn();
      mockFacilityId = new mongoose.Types.ObjectId();

      Facility.findById = jest.fn();
      req.params = {id: mockFacilityId};
    });

    it('should find a facility and attach it to the request object', async () => {
      const mockFacility = {
        _id: mockFacilityId,
        facilityName: 'Test Facility',
        // other facility details
      };

      Facility.findById.mockResolvedValue(mockFacility);

      await getFacility(req, res, next);

      expect(Facility.findById).toHaveBeenCalledWith(mockFacilityId);
      expect(req.facility).toEqual(mockFacility);
      expect(next).toHaveBeenCalled();
    });

    it('should handle facility not found', async () => {
      Facility.findById.mockResolvedValue(null);

      await findFacility(req, res, next);

      expect(Facility.findById).toHaveBeenCalledWith(mockFacilityId);
      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toEqual({message: 'Facility not found'});
    });

    it('should handle errors', async () => {
      Facility.findById.mockRejectedValue(new Error('Database error'));

      await findFacility(req, res, next);

      expect(Facility.findById).toHaveBeenCalledWith(mockFacilityId);
      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({message: 'Database error'});
    });

    // Add any other test cases if needed
  });
});
