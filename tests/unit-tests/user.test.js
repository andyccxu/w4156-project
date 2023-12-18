const httpMocks = require('node-mocks-http');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');

const {
  getCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
} = require('../../controllers/userController');

jest.mock('../../models/User');
jest.mock('bcryptjs', () => ({
  genSalt: jest.fn(),
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('User Controller', () => {
  let req; let res; let next; let mockUserId;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    mockUserId = 'mock-user-id';
    req.user = {_id: mockUserId};
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCurrentUser', () => {
    it('should get current user', async () => {
      User.findById.mockResolvedValue({
        _id: mockUserId,
        name: 'John Doe',
        email: 'john.doe@example.com',
      });

      await getCurrentUser(req, res, next);

      expect(User.findById).toHaveBeenCalledWith(mockUserId);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({
        _id: mockUserId,
        name: 'John Doe',
        email: 'john.doe@example.com',
      });
    });

    it('should return 500 if database operation fails', async () => {
      User.findById.mockRejectedValue(new Error('Database error'));

      await getCurrentUser(req, res, next);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({message: 'Database error'});
    });
  });

  describe('updateCurrentUser', () => {
    it('should update user and return updated data', async () => {
      const updatedUserData = {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
      };
      req.body = updatedUserData;
      User.findById.mockResolvedValue({
        _id: mockUserId,
        name: 'John Doe',
        email: 'john.doe@example.com',
        save: jest.fn().mockResolvedValue({
          _id: mockUserId,
          ...updatedUserData,
          toObject: function() {
            return this;
          }, // Mock toObject method
        }),
      });
      User.findOne.mockResolvedValue(null);
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashed-password');

      await updateCurrentUser(req, res, next);

      expect(User.findById).toHaveBeenCalledWith(mockUserId);
      expect(User.findOne).toHaveBeenCalledWith({email: updatedUserData.email});
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({
        _id: mockUserId,
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
      });
    });

    it('should return 400 if email is already in use', async () => {
      const updatedUserData = {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
      };
      req.body = updatedUserData;

      // Mocking User.findById to return a user with the same ID
      User.findById.mockResolvedValue({
        _id: mockUserId,
        email: 'john.doe@example.com',
        save: jest.fn(),
      });

      User.findOne.mockResolvedValue({
        _id: 'different-user-id',
        email: updatedUserData.email,
      });

      await updateCurrentUser(req, res, next);

      expect(User.findById).toHaveBeenCalledWith(mockUserId);
      expect(User.findOne).toHaveBeenCalledWith({email: updatedUserData.email});
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({message: 'Email already in use.'});
    });

    it('should return 500 if database operation fails', async () => {
      req.body = {name: 'Jane Doe'};
      User.findById.mockRejectedValue(new Error('Database error'));

      await updateCurrentUser(req, res, next);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({message: 'Database error'});
    });
  });


  describe('deleteCurrentUser', () => {
    it('should delete current user', async () => {
      User.findById.mockResolvedValue({
        _id: mockUserId,
        deleteOne: jest.fn().mockResolvedValue({}),
      });

      await deleteCurrentUser(req, res, next);

      expect(User.findById).toHaveBeenCalledWith(mockUserId);
      expect(res.statusCode).toBe(204);
    });

    it('should return 500 if database operation fails', async () => {
      User.findById.mockResolvedValue({
        _id: mockUserId,
        deleteOne: jest.fn().mockRejectedValue(new Error('Database error')),
      });

      await deleteCurrentUser(req, res, next);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({message: 'Database error'});
    });
  });

  // Additional test cases can be added here.
});
