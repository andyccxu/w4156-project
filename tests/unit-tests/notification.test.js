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
        employeeId: '123',
        message: 'Message 1!',
        manager: '01',
      },
      {
        employeeId: '456',
        message: 'Message 2!',
        manager: '02',
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
          employeeId: '123',
          message: 'Message 1!',
          manager: '01',
        },
        {
          employeeId: '456',
          message: 'Message 2!',
          manager: '02',
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
      // const req = httpMocks.createRequest();
      // const res = httpMocks.createResponse();

      // req.params.id = '123';

      res.notification = {
        employeeId: '123',
        message: 'Message 1!',
        manager: '01',
      };

      await getOneController(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData().notification).toStrictEqual({
        employeeId: '123',
        message: 'Message 1!',
        manager: '01',
      });
    });
  });


  
  // describe('createController', () => {
  //   it('should create a new notification', async () => {
  //     // const req = httpMocks.createRequest();
  //     // const res = httpMocks.createResponse();
      
  //     // req.user = {
  //     //   _id: '655c1788b99cfc1a85683f0f', // Replace with a valid user ID
  //     // };
  //     //  req.user._id = '01';

  //     // req.body = {
  //     //   employeeId: '123',
  //     //   message: 'Message 1!',
  //     //   manager: '01',
  //     // };

  //     // Notification.prototype.save = jest.fn().mockResolvedValue({
  //     //   employeeId: '123',
  //     //   message: 'Message 1!',
  //     //   manager: '01',
  //     // });

  //     await createController(req, res);

  //     expect(res.statusCode).toBe(201);
  //     expect(res._getJSONData()).toStrictEqual({
  //       employeeId: '12',
  //       message: 'Message 1!',
  //       manager: '01',
  //     });
  //   });

  //   it('should return 404 when database error during creation', async () => {
  //     Notification.prototype.save = jest.fn().mockRejectedValue(
  //         new Error('Database error'),
  //     );

  //     await createController(req, res);

  //     expect(res.statusCode).toBe(401);
  //     expect(res._getJSONData()).toStrictEqual({
  //       message: 'Database error',
  //     });
  //   });
  // });



  describe('patchController', () => {
    beforeEach(() => {
      res.notification = {
        employeeId: '123',
        message: 'Original message!',
        manager: '01',
        
        save: jest.fn().mockResolvedValue({
          employeeId: '123',
          message: 'Updated message!',
          manager: '01',
        }),
      };
    });

    it('should update notification properties', async () => {
      req.params.id = '123';
      req.body = {
        employeeId: '123',
        message: 'Updated message!',
        manager: '01',
      };

      await patchController(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toStrictEqual({
        employeeId: '123',
        message: 'Updated message!',
        manager: '01',
      });
    });

    it('should return 400 on database error during update', async () => {
      res.notification.save = jest.fn().mockRejectedValue(
          new Error('Database error!'),
      );

      await patchController(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toStrictEqual({
        message: 'Database error!',
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
        deleteOne: jest.fn().mockRejectedValue(new Error('Database error!')),
      };

      req.params.id = '123';
      await deleteController(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toStrictEqual({
        message: 'Database error!',
      });
    });
  });


  describe('Middleware: getNotification', () => {
    let req;
    let res;
    let next;
  
    beforeAll(() => {
      jest.mock('../../models/Notification');
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
            employeeId: '123',
            message: 'Message 1!',
            manager: '01',
          });
        } else {
          return Promise.resolve(null);
        }
      });
    });
  
    it('should return notification with id 123', async () => {
      req.params.id = '123';
  
      await getNotification(req, res, next);
  
      expect(res.notification.employeeId).toEqual('123');
      expect(res.notification.message).toEqual('Message 1!');
      expect(res.notification.manager).toEqual('01');
      expect(next).toBeCalled();
    });
  
    it('should not find notification with id 456', async () => {
      req.params.id = '456';
  
      await getNotification(req, res, next);
  
      expect(res.notification).toBeUndefined();
      expect(res.statusCode).toBe(404);
    });
  });
    

});
