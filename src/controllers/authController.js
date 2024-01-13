const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config = require("../config");

/**
 * Registers a new user in the system.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.registerUser = async (req, res) => {
  try {
    const { username, password, fullName, email, bio } = req.body;

    // Check if the username and email already exist in the database
    const [alreadyExists, emailExists] = await Promise.all([
      User.exists({ username }),
      User.exists({ email }),
    ]);

    // If the username or email already exists, return an error response
    if (alreadyExists) {
      return res.status(500).json({ error: "Username already exists" });
    }

    if (emailExists) {
      return res.status(500).json({ error: "Email already exists" });
    }

    // Hash the user's password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      fullName,
      email,
      bio,
    });

    // Save the new user to the database
    await newUser.save();

    // Respond with a success message
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    // Handle internal server error
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Authenticates and logs in a user.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).lean();

    // Check if the user exists and the provided password is correct
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Generate a JWT token for the authenticated user
    const token = jwt.sign({ userId: user._id }, config.jwtSecret, {
      expiresIn: "10d",
    });

    // Respond with the user's ID and the generated token
    res.status(200).json({ userId: user._id, token });
  } catch (error) {
    console.log('error', error)
    res.status(500).json({ error: "Internal Server Error" });
  }
};
