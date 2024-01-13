const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const followController = require("../controllers/followController");
const authenticateMiddleware = require("../middlewares/authMiddleware");

// Input validation for follow route
const followValidation = [
  check("followerId").notEmpty().isString(),
  check("followingId").notEmpty().isString(),
];


/**
 * @swagger
 * tags:
 *   name: Follow
 *   description: User follow operations
 */

/**
 * @swagger
 * /follow/{userId}/following:
 *   get:
 *     summary: Get the list of users that a user is following
 *     tags: [Follow]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: List of users followed by the specified user
 *       '500':
 *         description: Internal Server Error
 */
router.get("/:userId/following", authenticateMiddleware, followController.getFollowingList);

/**
 * @swagger
 * /follow:
 *   post:
 *     summary: Follow or unfollow a user
 *     tags: [Follow]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               followerId:
 *                 type: string
 *               followingId:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Followed or unfollowed successfully
 *       '500':
 *         description: Internal Server Error
 */
router.post("/", authenticateMiddleware, followValidation, followController.followUser);


module.exports = router;
