// external integration tests for MongoDB
//

const mongoose = require('mongoose');
const User = require('../models/User.js');
const Facility = require('../models/Facility.js');
const Employee = require('../models/Employee.js');
const Notification = require('../models/Notification.js');
const {Schedule, ScheduleEntry} = require('../models/Schedule.js');

const dotenv = require('dotenv');
dotenv.config({path: './config/config.env'});

beforeAll(async () => {
  const url = process.env.MONGO_URI_TEST;
  await mongoose.connect(url);
  // Clean the database before all tests
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

// Define global variables for the tests
let userId;
let facilityId;
let employeeId;

test('should save a user', async () => {
  const user = new User({
    name: 'John Doe',
    email: 'john@example.com',
    password: '12345',
  });

  const savedUser = await user.save();

  userId = savedUser._id;

  // Check if the object is successfully saved to MongoDB.
  expect(savedUser._id).toBeDefined();
  expect(savedUser.name).toBe(user.name);
  expect(savedUser.email).toBe(user.email);
  expect(savedUser.password).toBe(user.password);
});

test('should not save a user with duplicate email address', async () => {
  const user = new User({
    name: 'John Doe',
    email: 'john@example.com',
    password: '1',
  });

  let savedUser;
  // Check if the object is successfully saved to MongoDB.
  try {
    savedUser = await user.save();
  } catch (error) {
    expect(error).toBeTruthy();
  }

  expect(savedUser).toBeUndefined();
});

test('should have persistent data storage', async () => {
  const user = new User({
    name: 'John',
    email: 'john2@example.com',
    password: '12345',
  });

  await user.save();

  await mongoose.connection.close();

  // sleep 1 second
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // connect
  const url = process.env.MONGO_URI_TEST;
  await mongoose.connect(url);

  const savedUser = await User.findOne({name: 'John'}).select('+password');
  expect(savedUser.name).toBe('John');
  expect(savedUser.email).toBe('john2@example.com');
  expect(savedUser.password).toBe('12345');
});


test('should save a facility', async () => {
  const facility = new Facility({
    facilityName: 'Test Facility',
    facilityType: 'restaurant',
    operatingHours: {
      start: '08:00',
      end: '17:00',
    },
    manager: userId,
  });

  const savedFacility = await facility.save();

  facilityId = savedFacility._id;

  // Check if the object is successfully saved to MongoDB.
  expect(savedFacility._id).toBeDefined();
  expect(savedFacility.facilityName).toBe(facility.facilityName);
  expect(savedFacility.facilityType).toBe(facility.facilityType);
  expect(savedFacility.operatingHours.start).toBe(
      facility.operatingHours.start);
  expect(savedFacility.operatingHours.end).toBe(
      facility.operatingHours.end);
});

test('should save an employee', async () => {
  const employee = new Employee({
    name: 'John Doe',
    email: 'john@examp.com',
    phoneNumber: '1234567890',
    employeeOf: facilityId,
    manager: userId,
  });

  const savedEmployee = await employee.save();

  employeeId = savedEmployee._id;

  // Check if the object is successfully saved to MongoDB.
  expect(savedEmployee._id).toBeDefined();
  expect(savedEmployee.name).toBe(employee.name);
  expect(savedEmployee.email).toBe(employee.email);
  expect(savedEmployee.phoneNumber).toBe(employee.phoneNumber);
  expect(savedEmployee.employeeOf).toBe(employee.employeeOf);
  expect(savedEmployee.manager).toBe(employee.manager);
});

test('should not save an employee with invalid information', async () => {
  // duplicate email
  const employee = new Employee({
    name: 'John Doe',
    email: 'john@examp.com',
    phoneNumber: '1234567890',
    employeeOf: facilityId,
    manager: userId,
  });

  let savedEmployee;
  // Check if the object is successfully saved to MongoDB.
  try {
    savedEmployee = await employee.save();
  } catch (error) {
    expect(error).toBeTruthy();
  }

  expect(savedEmployee).toBeUndefined();

  // invalid email
  const employee2 = new Employee({
    name: 'John Doe',
    email: 'invalid',
    phoneNumber: '1234567890',
    employeeOf: facilityId,
    manager: userId,
  });

  let savedEmployee2;
  try {
    savedEmployee2 = await employee2.save();
  } catch (error) {
    expect(error).toBeTruthy();
  }

  expect(savedEmployee2).toBeUndefined();

  // invalid phone number
  const employee3 = new Employee({
    name: 'John Doe',
    email: 'john@examp.com',
    phoneNumber: 'invalid',
    employeeOf: facilityId,
    manager: userId,
  });

  let savedEmployee3;
  try {
    savedEmployee3 = await employee3.save();
  } catch (error) {
    expect(error).toBeTruthy();
  }

  expect(savedEmployee3).toBeUndefined();
});

test('should save a notification', async () => {
  const notification = new Notification({
    employeeId: employeeId,
    message: 'Test Message',
    manager: userId,
  });

  const savedNotification = await notification.save();

  // Check if the object is successfully saved to MongoDB.
  expect(savedNotification._id).toBeDefined();
  expect(savedNotification.EmployeeId).toBe(notification.EmployeeId);
  expect(savedNotification.message).toBe(notification.message);
  expect(savedNotification.manager).toBe(notification.manager);
  expect(savedNotification.timestamp).toBeDefined();
});


test('should save a schedule', async () => {
  const scheduleEntry = new ScheduleEntry({
    employeeId: employeeId,
    start: '08:00',
    end: '17:00',
    days: ['Mo', 'Tu', 'We', 'Th', 'Fr'],
  });

  const schedule = new Schedule({
    facilityId: facilityId,
    shifts: [scheduleEntry],
  });

  const savedSchedule = await schedule.save();

  // Check if the object is successfully saved to MongoDB.
  expect(savedSchedule._id).toBeDefined();
  expect(savedSchedule.facilityId).toBe(schedule.facilityId);
  expect(savedSchedule.shifts[0].employeeId).toBe(
      schedule.shifts[0].employeeId);
  expect(savedSchedule.shifts[0].start).toBe(
      schedule.shifts[0].start);
  expect(savedSchedule.shifts[0].end).toBe(
      schedule.shifts[0].end);
  expect(savedSchedule.shifts[0].days).toBe(
      schedule.shifts[0].days);
});
