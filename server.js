const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');

// Load config file
dotenv.config({path: './config/config.env'});

const app = express();
// We want express to parse user input json
app.use(express.json());

// app.use(morgan('dev'))
// app.use(cors())

// Routes
// const authRoute = require('./routes/auth');
const facilitiesRouter = require('./routes/facilities');
app.use('/facilities', facilitiesRouter);

const notificationsRouter = require('./routes/notifications');
app.use('/notifications', notificationsRouter);

<<<<<<< Updated upstream
const schedulesRouter = require('./routes/schedules');
app.use('/schedules', schedulesRouter);
=======
const staffRouter = require('./routes/staffs');
app.use('/staffs', staffRouter);

>>>>>>> Stashed changes

app.get('/', (req, res) => {
  res.send('Index page. Nothing to see here. Try /facilities etc.');
});


const uri = process.env.MONGO_URI;
/**
 * Connect to MongoDB
 */
async function connect() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }
}

connect();

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});