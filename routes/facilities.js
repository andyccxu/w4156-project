const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const Facility = require('../models/Facility');
const facilityController = require('../controllers/facilityController');

// Getting the user's managed facility
router.get('/', facilityController.getController);

// Creating a facility
router.post('/', facilityController.createController);

// Updating the user's managed facility
router.patch('/', getFacility, facilityController.patchController);

// Deleting the user's managed facility
router.delete('/', facilityController.deleteController);


/**
 * Middleware that get one facility by _id.
 *
 * @async
 * @function
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {function} next - The next middleware function in the stack.
 * @throws {Object} - Returns a 404 status code if staff is not found.
 * @throws {Object} - Returns a 500 status code if a server error occurs.
 * @return {void}
 */
async function getFacility(req, res, next) {
  let facility;
  try {
    facility = await Facility.findOne({manager: req.user._id});
    if (!facility) {
      // eslint-disable-next-line max-len
      return res.status(404).json({message: 'No facility managed by this user'});
    }
    res.facility = facility;
    next();
  } catch (err) {
    return res.status(500).json({message: err.message});
  }
}

module.exports = {router, getFacility};
