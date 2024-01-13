const express = require("express");
const request = require("supertest");
const mongoose = require("mongoose");
const app = express();

// Import your router and other necessary modules
const statusRouter = require("../../src/routes/statusRoutes");
const statusController = require("../../src/controllers/statusController");
const likeController = require("../../src/controllers/likeController");
const commentController = require("../../src/controllers/commentController");
const checkFollowingMiddleware = require("../../src//middlewares/checkFollowingMiddleware");
const authenticateMiddleware = require("../../src/middlewares/authMiddleware");

// Mock middleware and controller functions
jest.mock("../../src/middlewares/authMiddleware", () => (req, res, next) => next());
jest.mock("../../src/middlewares/checkFollowingMiddleware", () => (req, res, next) => next());
jest.mock("../../src/controllers/statusController", () => ({
  getStatuses: jest.fn(),
  createStatus: jest.fn(),
}));
jest.mock("../../src/controllers/likeController", () => ({
  likeStatus: jest.fn(),
}));
jest.mock("../../src/controllers/commentController", () => ({
  commentStatus: jest.fn(),
}));

// Use the router in the app
app.use(express.json());
app.use("/status", statusRouter);

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

describe("Status Router", () => {
  describe("GET /status", () => {
    it("should get the list of statuses", async () => {
      // Mock the behavior of the statusController.getStatuses function
      statusController.getStatuses.mockImplementation(async (req, res) => {
        res.status(200).json({ data: "List of statuses" });
      });

      const response = await request(app).get("/status");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ data: "List of statuses" });
    });
  });

  describe("POST /status/:userId", () => {
    it("should create a new status", async () => {
      // Mock the behavior of the statusController.createStatus function
      statusController.createStatus.mockImplementation(async (req, res) => {
        res.status(201).json({ message: "Status uploaded successfully" });
      });

      const response = await request(app)
        .post(`/status/${testUser._id}`)
        .set("Authorization", "Bearer mockAuthToken")
        .field("type", "text")
        .field("content", "Some text content");

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ message: "Status uploaded successfully" });
    });
  });

  describe("POST /status/:userId/like/:statusId", () => {
    it("should like a status", async () => {
      // Mock the behavior of the likeController.likeStatus function
      likeController.likeStatus.mockImplementation(async (req, res) => {
        res.status(200).json({ message: "Status liked successfully" });
      });

      const response = await request(app)
        .post(`/status/${testUser._id}/like/someStatusId`)
        .set("Authorization", "Bearer mockAuthToken")
        .send({ userId: testUser._id.toString(), statusId: "someStatusId" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Status liked successfully" });
    });
  });

  describe("POST /status/:userId/comment/:statusId", () => {
    it("should comment on a status", async () => {
      // Mock the behavior of the commentController.commentStatus function
      commentController.commentStatus.mockImplementation(async (req, res) => {
        res.status(201).json({ message: "Status commented successfully" });
      });

      const response = await request(app)
        .post(`/status/${testUser._id}/comment/someStatusId`)
        .set("Authorization", "Bearer mockAuthToken")
        .send({
          userId: testUser._id.toString(),
          statusId: "someStatusId",
          content: "Some comment content",
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ message: "Status commented successfully" });
    });
  });
});
