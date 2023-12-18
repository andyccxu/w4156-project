const User = require('../models/User');
const bcrypt = require('bcryptjs');

/**
 * Retrieve the authenticated user's details.
 *
 * @param {object} req - Request object with user ID.
 * @param {object} res - Response object to return user data.
 */
async function getCurrentUser(req, res) {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

/**
 * Update details of the authenticated user.
 *
 * @param {object} req - Request with user details to update.
 * @param {object} res - Response object to return updated data.
 */
async function updateCurrentUser(req, res) {
  try {
    const user = await User.findById(req.user._id);
    if (req.body.name) {
      user.name = req.body.name;
    }

    if (req.body.email) {
      const emailExists = await User.findOne({email: req.body.email});
      if (emailExists && emailExists._id.toString() !== user._id.toString()) {
        return res.status(400).json({message: 'Email already in use.'});
      }
      user.email = req.body.email;
    }

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }
    const updatedUser = await user.save();

    const userObject = updatedUser.toObject();
    delete userObject.password;
    res.status(200).json(userObject);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

/**
 * Delete the authenticated user's account.
 *
 * @param {object} req - Request with user ID of account to delete.
 * @param {object} res - Response object to confirm deletion.
 */
async function deleteCurrentUser(req, res) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({message: 'User not found.'});
    }
    await user.deleteOne();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

module.exports = {
  getCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
};
