const express = require('express');
const router = express.Router();

// Get all schedules
// http://localhost:3000/schedules

router.get('/', (req, res) => {
  res.send('Hello from /notifications');
});

router.get('/:id', (req, res) => {
  res.send(req.params.id);
});

module.exports = router;
