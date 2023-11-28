const express = require('express');
const cors = require('cors');
const verifyAuth = require('./middlewares/verifyAuth');


const app = express();
// We want express to parse user input json
app.use(express.json());
// use cors for cross origin resource sharing
app.use(cors());


// Routes
const authRouter = require('./routes/auth');
app.use('/auth', authRouter);

const usersRouter = require('./routes/users');
app.use('/users', verifyAuth, usersRouter);

const {router: facilitiesRouter} = require('./routes/facilities');
app.use('/facilities', verifyAuth, facilitiesRouter);

const {router: notificationsRouter} = require('./routes/notifications');
app.use('/notifications', verifyAuth, notificationsRouter);

const {router: schedulesRouter} = require('./routes/schedules');
app.use('/schedules', verifyAuth, schedulesRouter);

const {router: employeesRouter} = require('./routes/employees');
app.use('/employees', verifyAuth, employeesRouter);


app.get('/', (req, res) => {
  res.send('Index page. Nothing to see here. Try /facilities etc.');
});

// export app
module.exports = app;
