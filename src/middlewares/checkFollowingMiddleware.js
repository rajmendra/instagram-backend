const Follow = require("../models/Follow");
const Status = require("../models/Status");

const checkFollowing = async (req, res, next) => {
  try {
    const { userId, statusId } = req.params;

    // Fetch the status to get the postedBy user
    const status = await Status.findById(statusId).populate("postedBy");
    if (!status || !status.postedBy) {
      return res.status(404).json({ error: "Status not found" });
    }

    const posterId = status.postedBy._id.toString();
    if(posterId === userId){
      next();
      return;
    }
    // Check if the user is following the poster
    const isFollowing = await Follow.exists({ followerId: userId, followingId: posterId });
    if (!isFollowing) {
      return res.status(403).json({ error: "Please follow the user first" });
    }

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
