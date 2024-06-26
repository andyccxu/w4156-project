const express = require('express');
const cors = require('cors');
const verifyAuth = require('./middlewares/verifyAuth');

const dotenv = require('dotenv');
// Load config file
dotenv.config({ path: './config/config.env' });

const app = express();
// We want express to parse user input json
app.use(express.json());
// use cors for cross origin resource sharing
app.use(cors());

// Routes
const authRouter = require('./routes/auth');
app.use('/auth', authRouter);

const usersRouter = require('./routes/users');
app.use('/profile', verifyAuth, usersRouter);

const { router: facilitiesRouter } = require('./routes/facilities');
app.use('/facilities', verifyAuth, facilitiesRouter);

// const { router: notificationsRouter } = require('./routes/notifications');
// app.use('/notifications', verifyAuth, notificationsRouter);

const { router: schedulesRouter } = require('./routes/schedules');
app.use('/schedules', verifyAuth, schedulesRouter);

const { router: employeesRouter } = require('./routes/employees');
app.use('/employees', verifyAuth, employeesRouter);

// export app
module.exports = app;
