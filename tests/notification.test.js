const {getNotification} = require('../routes/notifications');
const Notification = require('../models/Notification');
const httpMocks = require('node-mocks-http');

jest.mock('../models/Notification');

describe('getStaff Middleware', () => {
  let req; let res; let next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it('finds a notification by ID', async () => {
    const notification = {name: 'Alice'};
    Notification.findById.mockResolvedValue(notification);
    req.params.id = 'someNotificationId';

    await getNotification(req, res, next);

    expect(res.notification).toEqual(notification);
    expect(next).toBeCalled();
  });
});
