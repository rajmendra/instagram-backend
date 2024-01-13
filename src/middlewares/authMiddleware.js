const jwt = require("jsonwebtoken");
const config = require("../../config");

/**
 * Middleware to authenticate requests using JSON Web Tokens (JWT).
 * It extracts the token from the request header, verifies it, and attaches the decoded user information to the request object.
 * If the token is missing or invalid, it returns an appropriate error response.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
module.exports = (req, res, next) => {
  // Get the token from the request header
  const token = req.header("auth-token");

  // Check if token is present
  if (!token) {
    return res.status(401).json({ error: { message: "Access denied. Token not provided." } });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || config.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err);
    res.status(400).json({ error: { message: "Invalid token" } });
  }
};
