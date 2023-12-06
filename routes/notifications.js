const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const Notification = require('../models/Notification');

const notificationController = require('../controllers/notificationController');


// GET all notifications
router.get('/', notificationController.getAllController);

// GET one notification
router.get('/:id', getNotification, notificationController.getOneController);

// POST one notification
router.post('/', notificationController.createController);

// PATCH update one notification
router.patch('/:id', getNotification, notificationController.patchController);

// DELETE one notification
router.delete('/:id', getNotification, notificationController.deleteController);

/**
 * Middleware function to get a notification by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @throws {Object} - Returns a 404 status code if staff is not found.
 * @throws {Object} - Returns a 500 status code if a server error occurs.
 * @return {Promise<void>}
 */
async function getNotification(req, res, next) {
  let notification;
  try {
    notification = await Notification.findOne({manager: req.user._id,
      _id: req.params.id});
    if (notification == null) {
      return res.status(404).json({message: 'Cannot find the notification'});
    }
  } catch (err) {
    return res.status(500).json({message: err.message});
  }

  res.notification = notification;
  next();
}


module.exports = {router, getNotification};
