const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Will add other later for notifications if needed
  // For example, might want to associate notifications
  // with specific facilities, users, or other related data.
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
