const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    statusId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Status",
      required: true,
      index: true,
    },
    content: { type: String, required: true, maxlength: 1000 }, // Set an appropriate max length
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
