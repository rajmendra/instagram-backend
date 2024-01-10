const Status = require("../models/Status");
const Follow = require("../models/Follow");
const Comment = require("../models/Comment");

exports.commentStatus = async (req, res) => {
  try {
    const { userId, statusId } = req.params;
    const { content } = req.body;
    
    const newComment = await Comment.create({ userId, statusId, content });
    await Status.findByIdAndUpdate(statusId, { $push: { comments: newComment._id } });

    res.status(201).json({ message: "Status commented successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
