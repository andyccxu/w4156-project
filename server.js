const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = express();
const cors = require('cors')
const bcrypt = require('bcryptjs')
const morgan = require('morgan')
const jwt = require('jsonwebtoken')

// MIDDLEWEARES
dotenv.config({ path: './config/config.env' })
app.use(express.json())
// app.use(morgan('dev'))
// app.use(cors())

// ROUTES
const authRoute = require('./routes/auth')
const facilitiesRouter = require('./routes/facilities')
app.use('/facilities', facilitiesRouter)


app.get('/', (req, res) => {
    res.send('Index page. Nothing to see here. Try /facilities etc.');
  });

  // Connect to MongoDB
const uri = process.env.MONGO_URI;
async function connect() {
  try {
    await mongoose.connect(uri)
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }
}

connect();
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
