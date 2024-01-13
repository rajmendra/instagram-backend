const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { check } = require("express-validator");

// // Input validation for registration
const registerValidation = [
  check("username").notEmpty().isString(),
  check("password").notEmpty().isString(),
  check("fullName").notEmpty().isString(),
  check("email").notEmpty().isEmail(),
];
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication operations
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       '201':
 *         description: User registered successfully
 *       '500':
 *         description: Internal Server Error
 */
router.post("/register", registerValidation, authController.registerUser);

// Input validation for login
const loginValidation = [
  check("username").notEmpty().isString(),
  check("password").notEmpty().isString(),
];

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User logged in successfully
 *       '401':
 *         description: Invalid username or password
 *       '500':
 *         description: Internal Server Error
 */
router.post("/login", loginValidation, authController.loginUser);

module.exports = router;
