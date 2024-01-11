const Like = require("../models/Like");
const Status = require("../models/Status");
const Follow = require("../models/Follow");
const ObjectId = require("mongodb").ObjectId;

exports.likeStatus = async (req, res) => {
  try {
    const { userId, statusId } = req.params;

    const existingLike = await Like.findOneAndDelete({ userId, statusId });
    if (existingLike) {
      res.status(200).json({ message: "Status unliked successfully" });
    } else {
      const newLike = await Like.create({ userId, statusId });
      await Status.findByIdAndUpdate(statusId, {
        $push: { likes: newLike._id },
      });
      res.status(201).json({ message: "Status liked successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
