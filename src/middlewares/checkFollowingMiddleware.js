const Follow = require("../models/Follow");
const Status = require("../models/Status");

/**
 * Middleware to check if the user is following the user who posted a specific status.
 * If the user is not following, it returns a 403 Forbidden response.
 * If the user is following or is the poster, it continues to the next middleware or route handler.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const checkFollowing = async (req, res, next) => {
  try {
    const { userId, statusId } = req.params;

    // Fetch the status to get the postedBy user
    const status = await Status.findById(statusId).populate("postedBy");

    if (!status || !status.postedBy) {
      return res.status(404).json({ error: "Status not found" });
    }

    const posterId = status.postedBy._id.toString();

    // If the user is the poster, allow the operation
    if (posterId === userId) {
      return next();
    }

    // Check if the user is following the poster
    const isFollowing = await Follow.exists({
      followerId: userId,
      followingId: posterId,
    });

    if (!isFollowing) {
      return res.status(403).json({ error: "Please follow the user first" });
    }

    // Attach status and posterId to the request for future use
    req.status = status;
    req.posterId = posterId;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = checkFollowing;
