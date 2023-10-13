const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = express();


// Load config file
dotenv.config({ path: './config/config.env' })

app.get('/', (req, res) => {
    res.send('Hello World!');
  });

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
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
