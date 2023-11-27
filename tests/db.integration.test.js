// write integration test for mongoose
const mongoose = require('mongoose');
const User = require('../models/User.js');

const dotenv = require('dotenv');
dotenv.config({path: './config/config.env'});

beforeAll(async () => {
  const url = process.env.MONGO_URI_TEST;
  await mongoose.connect(url);
  // clean the test database before starting the test
  await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  await mongoose.connection.close();
});

test('should save a user', async () => {
  const user = new User({
    name: 'John Doe',
    email: 'john@example.com',
    password: '12345',
  });

  const savedUser = await user.save();

  // Check if the object is successfully saved to MongoDB.
  expect(savedUser._id).toBeDefined();
  expect(savedUser.name).toBe(user.name);
  expect(savedUser.email).toBe(user.email);
  expect(savedUser.password).toBe(user.password);
});
