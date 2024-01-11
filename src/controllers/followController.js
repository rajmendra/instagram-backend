const Follow = require("../models/Follow");
const User = require("../models/User");

// Function to update follower count in the User table
async function updateFollowerCount(userId) {
  try {
    const followerCount = await Follow.countDocuments({ followingId: userId });
    await User.findByIdAndUpdate(userId, { $set: { followerCount } });
  } catch (error) {
    console.error("Error updating follower count:", error);
  }
}

exports.followUser = async (req, res) => {
  try {
    const { followerId, followingId } = req.body;

    // Check if the follow relationship already exists
    const existingFollow = await Follow.findOne({ followerId, followingId });

    if (existingFollow) {
      // If already following, unfollow
      await Follow.deleteOne({ _id: existingFollow._id });
    }else{
    // If not following, follow
    const newFollow = new Follow({ followerId, followingId });
    await newFollow.save();
    }


    await updateFollowerCount(followingId);

    res.status(201).json({ message: "ok" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getFollowingList = async (req, res) => {
  try {
    const { userId } = req.params;

    const followingList = await Follow.find({ followerId: userId });

    res.status(200).json({ followingList });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
