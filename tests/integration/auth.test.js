
const { app, server } = require('../../server');
const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../../src/models/User');
const saltRounds = 10;

const userName = "test_user_instgram";
const fullName = "test_user_instgram User";
const userEmail = "test_user_instgram@example.com";
let hashedPassword;
beforeAll(async () => {
  
  hashedPassword = await bcrypt.hash(userName, saltRounds);
});

afterAll(async () => {
  await User.deleteMany({ username: userName});

  mongoose.connection.close();
  server.close();
});

beforeEach(async () => {
  await User.deleteMany({ username: userName});
});


afterEach(async () => {
});

describe('Auth', () => {
  it('should register a new user', async () => {
    const signup_response = await request(app)
    .post("/auth/register")
    .send({
      username: userName,
      password: hashedPassword,
      fullName: fullName,
      email: userEmail,
    });
  expect(signup_response.status).toBe(201);


  });

  it("should login an existing user", async () => {

    const signup_response = await request(app)
    .post("/auth/register")
    .send({
      username: userName,
      password: hashedPassword,
      fullName: fullName,
      email: userEmail,
    });
  expect(signup_response.status).toBe(201);

    const loginCredentials = {
      username: userName,
      password: hashedPassword,
    };
    const user_name = await User.findOne({ username: userName});
    // Make an API request to login an existing user
    const response = await request(app)
      .post("/auth/login")
      .send(loginCredentials);
    // Assert that the response has a 200 status code
    expect(response.status).toBe(200);

    // Assert that the response contains a token
    expect(response.body.token).toBeDefined();
  });
});
