const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateMiddleware = require("../middlewares/authMiddleware");
const multer = require("multer");
const { check } = require("express-validator");

// Input validation for updateUser route
const updateUserValidation = [
  check("fullName").notEmpty().isString(),
  check("bio").notEmpty().isString(),
];

const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User operations
 */

/**
 * @swagger
 * /user/{userId}:
 *   get:
 *     summary: Get user profile by ID
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User profile
 *       '500':
 *         description: Internal Server Error
 */
router.get("/:userId", authenticateMiddleware, userController.getUserProfile);

/**
 * @swagger
 * /user/{userId}/likes:
 *   get:
 *     summary: Get user likes
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: List of user likes
 *       '500':
 *         description: Internal Server Error
 */
router.get("/:userId/likes", authenticateMiddleware, userController.getUserLikes);

/**
 * @swagger
 * /user/{userId}:
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               bio:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: User profile updated successfully
 *       '500':
 *         description: Internal Server Error
 */
router.put(
  "/:userId",
  authenticateMiddleware,
  upload.single("file"),
  updateUserValidation,
  userController.updateUser
);

module.exports = router;
