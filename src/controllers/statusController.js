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

exports.getStatuses = async (req, res) => {
  try {
    const { page, pageSize } = req.query;
    const pageNumber = parseInt(page, 10) || 1;
    const size = parseInt(pageSize, 10) || 10;

    const skip = (pageNumber - 1) * size;
    
    const statuses = await Status.find({})
      .populate({
        path: "postedBy",
        select: "username fullName profilePicture",
      })
      .populate("likes comments")
      .populate({ path: "likes", populate: { path: "userId" } })
      .populate({ path: "comments", populate: { path: "userId" } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(size);

      
    const totalStatuses = await Status.countDocuments({});

    const statusWithCounts = statuses.map((status) => {
      const totalLikes = status.likes.length;
      const totalComments = status.comments.length;
      return { ...status.toObject(), totalLikes, totalComments };
    });

    res.status(200).json({
      statuses: statusWithCounts,
      totalPages: Math.ceil(totalStatuses / size),
      currentPage: page,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

