const Follow = require("../models/Follow");
const User = require("../models/User");

/**
 * Updates the follower count in the User table.
 *
 * @function
 * @async
 * @param {string} userId - The user ID for whom the follower count needs to be updated.
 * @returns {Promise<void>} A Promise that resolves when the follower count is updated.
 */
async function updateFollowerCount(userId) {
  try {
    // Count the number of followers for the specified user
    const followerCount = await Follow.countDocuments({ followingId: userId });
    
    // Use findOneAndUpdate for atomic update of followerCount
    await User.findOneAndUpdate({ _id: userId }, { $set: { followerCount } });
  } catch (error) {
    // Log any errors that occur during the update process
    console.error("Error updating follower count:", error);
    throw error; // Re-throw the error for higher-level handling
  }
}

/**
 * Follows or unfollows a user based on the existing relationship.
 * Also updates the follower count for the user being followed.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.followUser = async (req, res) => {
  try {
    const { followerId, followingId } = req.body;

    // Check if the follow relationship already exists
    const existingFollow = await Follow.findOne({ followerId, followingId }).lean();

    if (existingFollow) {
      // If already following, unfollow
      await Follow.deleteOne({ _id: existingFollow._id });
    } else {
      // If not following, follow
      const newFollow = new Follow({ followerId, followingId });
      await newFollow.save();
    }

    // Update the follower count for the user being followed
    await updateFollowerCount(followingId);

    // Respond with a success message
    res.status(201).json({ message: "ok" });
  } catch (error) {
    // Log any errors that occur during the process
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Gets the list of users that a user is following.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.getFollowingList = async (req, res) => {
  try {
    const { userId } = req.params;

    // Use lean for reduced memory overhead
    const followingList = await Follow.find({ followerId: userId }).lean();

    // Respond with the following list
    res.status(200).json({ followingList });
  } catch (error) {
    // Respond with a 500 Internal Server Error status and error message
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
