const express = require("express");
const request = require("supertest");
const mongoose = require("mongoose");
const app = express();

// Import your router and other necessary modules
const userRouter = require("../../src/routes/userRoutes");
const userController = require("../../src/controllers/userController");
const authenticateMiddleware = require("../../src/middlewares/authMiddleware");

// Mock middleware and controller functions
jest.mock("../../src/middlewares/authMiddleware", () => (req, res, next) => next());
jest.mock("../../src/controllers/userController", () => ({
  getUserProfile: jest.fn(),
  getUserLikes: jest.fn(),
  updateUser: jest.fn(),
}));

// Use the router in the app
app.use(express.json());
app.use("/user", userRouter);

// Define a test user for testing purposes
const testUser = {
  _id: new mongoose.Types.ObjectId(),
  username: "test_user",
  // Add other necessary user properties
};

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  mongoose.connection.close();
});

describe("User Router", () => {
  describe("GET /user/:userId", () => {
    it("should get the user profile by ID", async () => {
      // Mock the behavior of the userController.getUserProfile function
      userController.getUserProfile.mockImplementation(async (req, res) => {
        res.status(200).json({ data: "User profile" });
      });

      const response = await request(app)
        .get(`/user/${testUser._id}`)
        .set("Authorization", "Bearer mockAuthToken");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ data: "User profile" });
    });
  });

  describe("GET /user/:userId/likes", () => {
    it("should get user likes", async () => {
      // Mock the behavior of the userController.getUserLikes function
      userController.getUserLikes.mockImplementation(async (req, res) => {
        res.status(200).json({ data: "List of user likes" });
      });

      const response = await request(app)
        .get(`/user/${testUser._id}/likes`)
        .set("Authorization", "Bearer mockAuthToken");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ data: "List of user likes" });
    });
  });

  describe("PUT /user/:userId", () => {
    it("should update user profile", async () => {
      // Mock the behavior of the userController.updateUser function
      userController.updateUser.mockImplementation(async (req, res) => {
        res.status(200).json({ message: "User profile updated successfully" });
      });

      const response = await request(app)
        .put(`/user/${testUser._id}`)
        .set("Authorization", "Bearer mockAuthToken")
        .field("fullName", "New Full Name")
        .field("bio", "New Bio Content");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "User profile updated successfully" });
    });
  });
});
