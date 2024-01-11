const jwt = require("jsonwebtoken");
const config = require("../../config");

module.exports = (req, res, next) => {
  // Get the token from the request header
  const token = req.header("auth-token");

  // Check if token is present
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. Token not provided." });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};
