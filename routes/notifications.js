const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const Notification = require('../models/Notification');
// Get all schedules
// http://localhost:3000/schedules

router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.json(notifications);
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});

// Getting one
router.get('/:id', getNotification, (req, res) => {
  res.send(res.notification);
});

// Creating one
router.post('/', async (req, res) => {
  const notification = new Notification({
    title: req.body.title,
    content: req.body.content,
  });
  try {
    const newNotification = await notification.save();
    res.status(201).json(newNotification);
  } catch (err) {
    res.status(400).json({message: err.message});
  }
});

// Updating one
router.patch('/:id', getNotification, async (req, res) => {
  if (req.body.title != null) {
    res.notification.title = req.body.title;
  }
  if (req.body.content != null) {
    res.notification.content = req.body.content;
  }

  try {
    const updatedNotification = await res.notification.save();
    res.json(updatedNotification);
  } catch (err) {
    res.status(400).json({message: err.message});
  }
});

// Deleting one
router.delete('/:id', getNotification, async (req, res) => {
  try {
    await res.notification.deleteOne();
    res.json({message: 'Deleted notification!'});
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});

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
    notification = await Notification.findById(req.params.id);
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
