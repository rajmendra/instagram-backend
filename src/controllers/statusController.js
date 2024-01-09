const Status = require("../models/Status");
const Follow = require("../models/Follow");
const Like = require("../models/Like");
const Comment = require("../models/Comment");
const uploadImage = require("../utils/uploadImage");

exports.postStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { type, content } = req.body;

    let data = content;
    if (req.file) {
      data = await uploadImage(req.file);
    }
    const newStatus = new Status({ postedBy: userId, type, content: data });
    await newStatus.save();

    res.status(201).json({ message: "Status uploaded successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getStatuses = async (query, res) => {
  try {
    const statuses = await Status.find(query)
      .populate({
        path: "postedBy",
        select: "username fullName profilePicture",
      })
      .populate("likes comments")
      .populate({ path: "likes", populate: { path: "userId" } })
      .populate({ path: "comments", populate: { path: "userId" } })
      .sort({ createdAt: -1 });

    const statusWithCounts = statuses.map((status) => {
      const totalLikes = status.likes.length;
      const totalComments = status.comments.length;
      return { ...status.toObject(), totalLikes, totalComments };
    });

    res.status(200).json({ statuses: statusWithCounts });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUserStatuses = async (req, res) => {
  await getStatuses({}, res);
};

exports.getViewableStatuses = async (req, res) => {
  const { userId } = req.user;

  const following = await Follow.find({ followerId: userId }, "followingId");
  const followers = await Follow.find({ followingId: userId }, "followerId");

  const followingUserIds = following.map((follow) => follow.followingId);
  const followersUserIds = followers.map((follow) => follow.followerId);

  const viewableUserIds = [...followingUserIds, ...followersUserIds];

  await getStatuses({ userId: { $in: viewableUserIds } }, res);
};
