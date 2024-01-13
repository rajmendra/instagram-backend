const Status = require("../models/Status");
const Follow = require("../models/Follow");
const Like = require("../models/Like");
const Comment = require("../models/Comment");
const uploadImage = require("../utils/uploadImage");

/**
 * Controller function to post a status.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
exports.createStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { type, content } = req.body;

    // Check if the content is empty for text type or if file is not provided for other types
    if ((type === "text" && !content.trim()) || (type !== "text" && !req.file)) {
      return next("Content cannot be empty");
    }

    // If a file is provided, upload it using the utility function
    const data = req.file ? await uploadImage(req.file) : content;

    // Create a new status
    const newStatus = new Status({ postedBy: userId, type, content: data });
    await newStatus.save();

    res.status(201).json({ message: "Status uploaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Controller function to get statuses with additional counts.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.getStatuses = async (req, res) => {
  try {
    const { page, pageSize } = req.query;
    const pageNumber = parseInt(page, 10) || 1;
    const size = parseInt(pageSize, 10) || 10;
    const skip = (pageNumber - 1) * size;

    // Retrieve statuses with additional counts
    const [statuses, totalStatuses] = await Promise.all([
      Status.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(size)
        .populate({
          path: "postedBy",
          select: "username fullName profilePicture followerCount",
        })
        .populate("likes comments")
        .populate({ path: "likes", populate: { path: "userId" } })
        .populate({ path: "comments", populate: { path: "userId" } })
        .lean(),
      Status.countDocuments({}),
    ]);

    // Map statuses to include totalLikes and totalComments
    const statusWithCounts = statuses.map((status) => ({
      ...status,
      totalLikes: status.likes.length,
      totalComments: status.comments.length,
    }));

    const totalPages = Math.ceil(totalStatuses / size);

    res.status(200).json({
      statuses: statusWithCounts,
      totalPages,
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
