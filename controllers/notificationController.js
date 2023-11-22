const Notification = require('../models/Notification');

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
    title: req.body.title,
    content: req.body.content,
  });

  try {
    const newNotification = await notification.save();
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
