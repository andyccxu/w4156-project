const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const verifyAuth = require('./middleware/verifyAuth');
// const cors = require('cors');
// const bcrypt = require('bcryptjs');
// const morgan = require('morgan');
// const jwt = require('jsonwebtoken');

// Load config file
dotenv.config({path: './config/config.env'});

const app = express();
// We want express to parse user input json
app.use(express.json());

// app.use(morgan('dev'));
// app.use(cors());
// app.use(bcrypt());
// app.use(jwt());


// Routes
const authRouter = require('./routes/auth');
app.use('/auth', authRouter);

const {router: facilitiesRouter} = require('./routes/facilities');
app.use('/facilities', verifyAuth, facilitiesRouter);

const {router: notificationsRouter} = require('./routes/notifications');
app.use('/notifications', verifyAuth, notificationsRouter);

const {router: schedulesRouter} = require('./routes/schedules');
app.use('/schedules', verifyAuth, schedulesRouter);

const {router: staffRouter} = require('./routes/staff');
app.use('/staff', verifyAuth, staffRouter);


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
