const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true, index: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    bio: { type: String },
    profilePicture: { type: String },
    followerCount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);
userSchema.index({ createdAt: 1 });
const User = mongoose.model("User", userSchema);

module.exports = User;
