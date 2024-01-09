const Follow = require("../models/Follow");

exports.followUser = async (req, res) => {
  try {
    const { followerId, followingId } = req.body;

    // Check if the follow relationship already exists
    const existingFollow = await Follow.findOne({ followerId, followingId });

    if (existingFollow) {
      // If already following, unfollow
      await Follow.deleteOne({ _id: existingFollow._id });
      return res.status(200).json({ message: "User unfollowed successfully" });
    }

    // If not following, follow
    const newFollow = new Follow({ followerId, followingId });
    await newFollow.save();

    res.status(201).json({ message: "User followed successfully" });
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
