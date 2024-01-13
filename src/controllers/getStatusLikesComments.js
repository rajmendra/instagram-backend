
/**
 * Fetches the total number of likes and comments for each status.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
// Use MongoDB Aggregation Framework to get total likes and comments for each status
const getAllStatusLikesAndComments = async (req, res) => {
  try {
    const statusCounts = await Status.aggregate([
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "statusId",
          as: "likes",
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "statusId",
          as: "comments",
        },
      },
      {
        $project: {
          _id: 1,
          totalLikes: { $size: "$likes" },
          totalComments: { $size: "$comments" },
        },
      },
    ]);

    // Respond with the aggregated data containing total likes and comments for each status
    res.json(statusCounts);
  } catch (error) {
    // Log the error for debugging purposes
    console.error(error);
    // Respond with a 500 Internal Server Error status and error message
    res.status(500).json({ error: "Internal server error" });
  }
};
