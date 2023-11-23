const Notification = require('../models/Notification');
const Employee = require('../models/Employee');
const {sendSMS} = require('../services/twilioClient');
require('dotenv').config({path: '../config/config.env'});

/**
 * Controller for route GET /notifications
 *
 * @param {*} req Express.js request object
 * @param {*} res Express.js response object
 */
async function getAllController(req, res) {
  try {
    const notifications = await Notification.find();
    res.json(notifications);
  } catch (err) {
    res.status(500).json({message: err.message});
  }
}

/**
 * Controller for route GET /notifications/{:id}
 *
 * @param {*} req Express.js request object
 * @param {*} res Express.js response object
 */
function getOneController(req, res) {
  res.json({
    notification: res.notification,
  });
}

/**
 * Controller for route POST /notifications
 * @param {*} req Express.js request object
 * @param {*} res Express.js response object
 */
async function createController(req, res) {
  const notification = new Notification({
    employeeId: req.body.employeeId,
    message: req.body.message,
    manager: req.user._id,
  });

  const employee = await Employee.findById(req.body.employeeId);

  try {
    const newNotification = await notification.save();

    const message = newNotification.message;
    const toPhoneNumber = '+1' + employee.phoneNumber.replace(/-/g, '');
    try {
      sendSMS(message, toPhoneNumber);
    } catch (error) {
      console.error('SMS sending failed:', error);
    }

    res.status(201).json(newNotification);
  } catch (err) {
    res.status(400).json({message: err.message});
  }
}

/**
 * Controller for route PATCH /notifications/{:id}
 *
 * @param {*} req Express.js request object
 * @param {*} res Express.js response object
 */
async function patchController(req, res) {
  if (req.body.message != null) {
    res.notification.message = req.body.message;
  }

  try {
    const updatedNotification = await res.notification.save();
    res.json(updatedNotification);
  } catch (err) {
    res.status(400).json({message: err.message});
  }
}

/**
 * Controller for route DELETE /notifications/{:id}
 *
 * @param {*} req Express.js request object
 * @param {*} res Express.js response object
 */
async function deleteController(req, res) {
  try {
    await res.notification.deleteOne();
    res.json({message: 'Deleted notification!'});
  } catch (err) {
    res.status(500).json({message: err.message});
  }
}

module.exports = {
  getAllController,
  getOneController,
  createController,
  patchController,
  deleteController,
};
