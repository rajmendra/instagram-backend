const Like = require("../models/Like");
const Status = require("../models/Status");

/**
 * Handles the liking or unliking of a status by a user.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.likeStatus = async (req, res) => {
  try {
    const { userId, statusId } = req.params;

    // Check if the user has already liked the status
    const existingLike = await Like.findOneAndDelete({ userId, statusId });

    if (existingLike) {
      // If like exists, user unlikes the status
      res.status(200).json({ message: "Status unliked successfully" });
    } else {
      // If like doesn't exist, user likes the status
      const newLike = await Like.create({ userId, statusId });

      // Update the Status model to include the new like ID in the likes array
      await Status.findByIdAndUpdate(statusId, {
        $push: { likes: newLike._id },
      });

      res.status(201).json({ message: "Status liked successfully" });
    }
  } catch (error) {
    // Log and respond with a 500 Internal Server Error status and error message
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
