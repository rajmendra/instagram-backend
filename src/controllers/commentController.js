const Status = require("../models/Status");
const Follow = require("../models/Follow");
const Comment = require("../models/Comment");

/**
 * Controller function to add a comment to a status.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.commentStatus = async (req, res) => {
  try {
    const { userId, statusId } = req.params;
    const { content } = req.body;

    // Create a new comment
    const newComment = await Comment.create({ userId, statusId, content });

    
      // Update the Status model to include the new comment ID in the comments array
      await Status.findByIdAndUpdate(statusId, { $push: { comments: newComment._id } }).lean();

    // Respond with a success message
    res.status(201).json({ message: "Status commented successfully" });
  } catch (error) {
    // Log the error for debugging purposes
    console.error(error);
    // Respond with a 500 Internal Server Error status and error message
    res.status(500).json({ error: "Internal server error" });
  }
};
