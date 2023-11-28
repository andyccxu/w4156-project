const mongoose = require('mongoose');
const dotenv = require('dotenv');
// Load config file
dotenv.config({path: './config/config.env'});

const app = require('./app');


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
