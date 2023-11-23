const httpMocks = require('node-mocks-http');

const Notification = require('../../models/Notification');
const {getNotification} = require('../../routes/notifications');

const {
  getAllController,
  getOneController,
  createController,
  patchController,
  deleteController,
} = require('../../controllers/notificationController');

describe('Controller functions for /notifications', () => {
  let req;
  let res;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();

    Notification.find = jest.fn().mockResolvedValue([
      {
        _id: '123',
        message: 'Notification 1',
      },
      {
        _id: '456',
        message: 'Notification 2',
      },
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllController', () => {
    it('should return all notifications', async () => {
      await getAllController(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toStrictEqual([
        {
          _id: '123',
          message: 'Notification 1',
        },
        {
          _id: '456',
          message: 'Notification 2',
        },
      ]);
    });

    it('should return 500 when database error', async () => {
      Notification.find = jest.fn().mockRejectedValue(
          new Error('Database error'),
      );

      await getAllController(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toStrictEqual({
        message: 'Database error',
      });
    });
  });

  describe('getOneController', () => {
    it('should return notification with id 123', async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      req.params.id = '123';

      res.notification = {
        _id: '123',
        message: 'Notification 1',
      };

      await getOneController(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData().notification).toStrictEqual({
        _id: '123',
        message: 'Notification 1',
      });
    });
  });

  describe('createController', () => {
    it('should create a new notification', async () => {
      req.body = {
        employeeId: 'New Notification',
        message: 'New Content',
      };

      Notification.prototype.save = jest.fn().mockResolvedValue({
        _id: '789',
        message: 'New Notification',
      });

      await createController(req, res);

      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toStrictEqual({
        _id: '789',
        title: 'New Notification',
        content: 'New Content',
      });
    });

    it('should return 404 when database error during creation', async () => {
      Notification.prototype.save = jest.fn().mockRejectedValue(
          new Error('Database error'),
      );

      await createController(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toStrictEqual({
        message: 'Database error',
      });
    });
  });

  describe('patchController', () => {
    beforeEach(() => {
      res.notification = {
        _id: '123',
        title: 'Original Title',
        content: 'Original Content',
        save: jest.fn().mockResolvedValue({
          _id: '123',
          title: 'Updated Title',
          content: 'Updated Content',
        }),
      };
    });

    it('should update notification properties', async () => {
      req.params.id = '123';
      req.body = {
        title: 'Updated Title',
        content: 'Updated Content',
      };

      await patchController(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toStrictEqual({
        _id: '123',
        title: 'Updated Title',
        content: 'Updated Content',
      });
    });

    it('should return 400 on database error during update', async () => {
      res.notification.save = jest.fn().mockRejectedValue(
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
    it('should delete a notification', async () => {
      req.params.id = '123';
      res.notification = {
        deleteOne: jest.fn().mockResolvedValue({}),
      };

      await deleteController(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toStrictEqual({
        message: 'Deleted notification!',
      });
    });

    it('should return 500 on database error during deletion', async () => {
      res.notification = {
        deleteOne: jest.fn().mockRejectedValue(new Error('Database error')),
      };

      req.params.id = '123';
      await deleteController(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toStrictEqual({
        message: 'Database error',
      });
    });
  });
});

describe('Middleware: getNotification', () => {
  let req;
  let res;
  let next;

  beforeAll(() => {
    jest.mock('../models/Notification');
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();

    Notification.findById = jest.fn((id) => {
      if (id === '123') {
        return Promise.resolve({
          _id: '123',
          title: 'Notification 1',
          content: 'Content 1',
        });
      } else {
        return Promise.resolve(null);
      }
    });
  });

  it('should return notification with id 123', async () => {
    req.params.id = '123';

    await getNotification(req, res, next);

    expect(res.notification._id).toEqual('123');
    expect(res.notification.title).toEqual('Notification 1');
    expect(res.notification.content).toEqual('Content 1');
    expect(next).toBeCalled();
  });

  it('should not find notification with id 456', async () => {
    req.params.id = '456';

    await getNotification(req, res, next);

    expect(res.notification).toBeUndefined();
    expect(res.statusCode).toBe(404);
  });
});
