const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  },
);
const Like = mongoose.model("Like", likeSchema);

module.exports = Like;
