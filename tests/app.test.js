// use supertest to test the API endpoints
// perform concurrency testing
//

const app = require('../app');
const request = require('supertest');
const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config({path: '../config/config.env'});


beforeAll(async () => {
  const url = process.env.MONGO_URI_TEST;
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // clean up the testing database
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Concurrency testing', () => {
  const jwtTokens = {};
  const userIds = {}; // TODO

  it('should register a few new users', async () => {
    const response = await request(app).post('/auth/signup')
        .send({
          name: 'user1',
          email: 'user1@example.com',
          password: '12345',
        });

    expect(response.statusCode).toBe(201);

    const response2 = await request(app).post('/auth/signup')
        .send({
          name: 'user2',
          email: 'user2@example.com',
          password: '12345',
        });

    expect(response2.statusCode).toBe(201);

    const response3 = await request(app).post('/auth/signup')
        .send({
          name: 'user3',
          email: 'user3@example.com',
          password: '12345',
        });

    expect(response3.statusCode).toBe(201);
  });

  it('should login a few users and obtain JWT tokens', async () => {
    const response = await request(app).post('/auth/login')
        .send({
          email: 'user1@example.com',
          password: '12345',
        });
    expect(response.statusCode).toBe(200);
    jwtTokens.user1 = response.body.token;

    const response2 = await request(app).post('/auth/login')
        .send({
          email: 'user2@example.com',
          password: '12345',
        });
    expect(response2.statusCode).toBe(200);
    jwtTokens.user2 = response2.body.token;

    const response3 = await request(app).post('/auth/login')
        .send({
          email: 'user3@example.com',
          password: '12345',
        });
    expect(response3.statusCode).toBe(200);
    jwtTokens.user3 = response3.body.token;
  });

  it('should let users know their own information', async () => {
    // retrieve user id
    const response = await request(app).get('/users')
        .set('Authorization', 'Bearer ' + jwtTokens.user1);
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe('user1');
    userIds.user1 = response.body._id;

    const response2 = await request(app).get('/users')
        .set('Authorization', 'Bearer ' + jwtTokens.user2);
    expect(response2.statusCode).toBe(200);
    expect(response2.body.name).toBe('user2');
    userIds.user2 = response2.body._id;

    const response3 = await request(app).get('/users')
        .set('Authorization', 'Bearer ' + jwtTokens.user3);
    expect(response3.statusCode).toBe(200);
    expect(response3.body.name).toBe('user3');
    userIds.user3 = response3.body._id;
  });

  it('should let users register their facilities', async () => {
    const response = await request(app).post('/facilities')
        .set('Authorization', 'Bearer ' + jwtTokens.user1)
        .send({
          facilityName: 'facility1',
          facilityType: 'hospital',
          operatingHours: {
            start: '00:00',
            end: '24:00',
          },
          manager: userIds.user1,
        });
    expect(response.statusCode).toBe(201);

    const response2 = await request(app).post('/facilities')
        .set('Authorization', 'Bearer ' + jwtTokens.user2)
        .send({
          facilityName: 'facility2',
          facilityType: 'restaurant',
          operatingHours: {
            start: '10:00',
            end: '20:00',
          },
          manager: userIds.user2,
        });
    expect(response2.statusCode).toBe(201);

    const response3 = await request(app).post('/facilities')
        .set('Authorization', 'Bearer ' + jwtTokens.user3)
        .send({
          facilityName: 'facility3',
          facilityType: 'other',
          operatingHours: {
            start: '01:00',
            end: '12:00',
          },
          manager: userIds.user3,
        });
    expect(response3.statusCode).toBe(201);
  });

  it('should handle GET /facilities from users concurrently', async () => {
    const promises = [];
    // GET /facilities
    for (const user of Object.keys(jwtTokens)) {
      promises.push(request(app).get('/facilities')
          .set('Authorization', 'Bearer ' + jwtTokens[user]));
    }

    const responses = await Promise.all(promises);
    // check user1
    expect(responses[0].statusCode).toBe(200);
    expect(responses[0].body.facilityName).toBe('facility1');
    expect(responses[0].body.facilityType).toBe('hospital');

    // check user2
    expect(responses[1].statusCode).toBe(200);
    expect(responses[1].body.facilityName).toBe('facility2');
    expect(responses[1].body.facilityType).toBe('restaurant');

    // check user3
    expect(responses[2].statusCode).toBe(200);
    expect(responses[2].body.facilityName).toBe('facility3');
    expect(responses[2].body.facilityType).toBe('other');
  });
});
