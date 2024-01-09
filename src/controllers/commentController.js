const Comment = require("../models/Comment");
const Status = require("../models/Status");

exports.commentStatus = async (req, res) => {
  try {
    const { userId, statusId } = req.params;
    const { content } = req.body;
    const newComment = new Comment({ userId, statusId, content });
    await newComment.save();

    // Add the comment to the status
    await Status.findByIdAndUpdate(statusId, {
      $push: { comments: newComment._id },
    });

    res.status(201).json({ message: "Status commented successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
