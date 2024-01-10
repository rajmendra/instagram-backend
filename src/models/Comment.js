const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true,
    },
    statusId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Status",
      required: true,
      index: true,
    },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);
commentSchema.index({ createdAt: 1 });
const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
