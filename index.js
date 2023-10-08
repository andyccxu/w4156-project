const express = require('express');
const mongoose = require('mongoose')
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
  });

// connect to mongodb
const uri = "mongodb+srv://fourloop:fourloop_thebest@cluster0.o08w0ip.mongodb.net/?retryWrites=true&w=majority"

async function connect() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }
}

connect();

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
