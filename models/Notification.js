const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  // Will add other later for notifications if needed
  // For example, might want to associate notifications
  // with specific facilities, users, or other related data.
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
