const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: { type: String, enum: ["text", "image", "video"], required: true },
    content: { type: String }, // Can include text or a URL to an image or video
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Like" ,
    index: true,}],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment",
    index: true, }],
  },
  {
    timestamps: true,
  },
);
statusSchema.index({ createdAt: 1 });
const Status = mongoose.model("Status", statusSchema);

module.exports = Status;
