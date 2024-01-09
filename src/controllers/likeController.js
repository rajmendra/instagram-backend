const Like = require("../models/Like");
const Status = require("../models/Status");
const ObjectId = require("mongodb").ObjectId;

exports.likeStatus = async (req, res) => {
  try {
    const { userId, statusId } = req.params;

    const status = await Status.findById(statusId);
    if (!status || !status.posterId) {
      return res.status(404).json({ error: "Status not found" });
    }

    const posterId = status.postedBy.toString();
    const isFollowing = await User.exists({ _id: userId, following: posterId });

    if (!isFollowing) {
      return res.status(403).json({ error: "Please follow the user first" });
    }

    // Check if the user has already liked the status
    const existingLike = await Like.findOne({ userId, statusId });
    console.log("existingLike", existingLike);
    if (existingLike) {
      // Remove the like from the status
      await Status.findByIdAndUpdate(statusId, {
        $pull: { likes: existingLike._id },
      });
      await Like.deleteOne({ _id: new ObjectId(existingLike._id) });

      res.status(200).json({ message: "Status unliked successfully" });
    } else {
      // If the user has not liked the status, like it
      const newLike = new Like({ userId, statusId });
      await newLike.save();
      console.log("statusId", statusId);
      // Add the like to the status
      await Status.findByIdAndUpdate(statusId, {
        $push: { likes: newLike._id },
      });

      res.status(201).json({ message: "Status liked successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};
