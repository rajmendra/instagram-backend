const express = require("express");
const router = express.Router();
const statusController = require("../controllers/statusController");
const likeController = require("../controllers/likeController");
const commentController = require("../controllers/commentController");
const checkFollowingMiddleware = require("../middlewares/checkFollowingMiddleware");
const authenticateMiddleware = require("../middlewares/authMiddleware");
const { check } = require("express-validator");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Input validation for postStatus route
const postStatusValidation = [
  check("type").notEmpty().isString().isIn(["text", "image", "video"]),
  check("content").optional().isString(),
];

// Input validation for likeStatus route
const likeStatusValidation = [
  check("userId").notEmpty().isString(),
  check("statusId").notEmpty().isString(),
];

// Input validation for commentStatus route
const commentStatusValidation = [
  check("userId").notEmpty().isString(),
  check("statusId").notEmpty().isString(),
  check("content").notEmpty().isString(),
];

/**
 * @swagger
 * tags:
 *   name: Status
 *   description: Status operations
 */

/**
 * @swagger
 * /status:
 *   get:
 *     summary: Get the list of statuses
 *     tags: [Status]
 *     responses:
 *       '200':
 *         description: List of statuses
 *       '500':
 *         description: Internal Server Error
 */
router.get("/", statusController.getStatuses);

/**
 * @swagger
 * /status/{userId}:
 *   post:
 *     summary: Post a new status
 *     tags: [Status]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user posting the status
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: ['text', 'image', 'video']
 *               content:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '201':
 *         description: Status uploaded successfully
 *       '500':
 *         description: Internal Server Error
 */
router.post(
  "/:userId",
  authenticateMiddleware,
  upload.single("file"),
  postStatusValidation,
  statusController.createStatus
);

/**
 * @swagger
 * /status/{userId}/like/{statusId}:
 *   post:
 *     summary: Like a status
 *     tags: [Status]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user liking the status
 *         schema:
 *           type: string
 *       - in: path
 *         name: statusId
 *         required: true
 *         description: The ID of the status being liked
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               statusId:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Status liked successfully
 *       '500':
 *         description: Internal Server Error
 */
router.post(
  "/:userId/like/:statusId",
  authenticateMiddleware,
  checkFollowingMiddleware,
  likeStatusValidation,
  likeController.likeStatus
);

/**
 * @swagger
 * /status/{userId}/comment/{statusId}:
 *   post:
 *     summary: Comment on a status
 *     tags: [Status]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user commenting on the status
 *         schema:
 *           type: string
 *       - in: path
 *         name: statusId
 *         required: true
 *         description: The ID of the status being commented on
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               statusId:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Status commented successfully
 *       '500':
 *         description: Internal Server Error
 */
router.post(
  "/:userId/comment/:statusId",
  authenticateMiddleware,
  checkFollowingMiddleware,
  commentStatusValidation,
  commentController.commentStatus
);

module.exports = router;