const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const userController = require('../controllers/userController');

// Get the current user's information
router.get('/', userController.getCurrentUser);

// Update the current user's information
router.patch('/', userController.updateCurrentUser);

// Delete the user's account
router.delete('/', userController.deleteCurrentUser);

module.exports = router;
