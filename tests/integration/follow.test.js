const express = require("express");
const request = require("supertest");
const mongoose = require("mongoose");
const app = express();

// Import your router and other necessary modules
const followRouter = require("../../src/routes/followRoutes");
const followController = require("../../src/controllers/followController");
const authenticateMiddleware = require("./../../src/middlewares/authMiddleware");

// Mock the authenticateMiddleware to bypass authentication for testing purposes
jest.mock("./../../src/middlewares/authMiddleware", () => (req, res, next) => next());

app.use(express.json());
app.use("/follow", followRouter);

// Define a test user for testing purposes
const testUser = {
  _id: new mongoose.Types.ObjectId(),
  username: "test_user",
  // Add other necessary user properties
};

// Mock the followController functions
jest.mock("../../src/controllers/followController", () => ({
  getFollowingList: jest.fn(),
  followUser: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  mongoose.connection.close();
});

describe("Follow Router", () => {
  describe("GET /follow/:userId/following", () => {
    it("should get the list of users that a user is following", async () => {
      // Mock the behavior of the followController.getFollowingList function
      followController.getFollowingList.mockImplementation(async (req, res) => {
        res.status(200).json({ data: "List of users followed by the specified user" });
      });

      const response = await request(app)
        .get(`/follow/${testUser._id}/following`)
        .set("Authorization", "Bearer mockAuthToken");

      expect(response.status).toBe(200);
      // Add more assertions if needed
    });
  });

  describe("POST /follow", () => {
    it("should follow or unfollow a user", async () => {
      // Mock the behavior of the followController.followUser function
      followController.followUser.mockImplementation(async (req, res) => {
        res.status(201).json({ message: "Followed or unfollowed successfully" });
      });

      const requestBody = {
        followerId: testUser._id.toString(),
        followingId: "some_other_user_id",
      };

      const response = await request(app)
        .post("/follow")
        .set("Authorization", "Bearer mockAuthToken")
        .send(requestBody);

      expect(response.status).toBe(201);
      // Add more assertions if needed
    });
  });
});
