const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

const User = require('../models/User');

// Getting the user's information
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});

module.exports = router;
