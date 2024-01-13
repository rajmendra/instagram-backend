const User = require("../models/User");
const Like = require("../models/Like");
const uploadImage = require("../utils/uploadImage");

/**
 * Controller function to get a user's profile by ID.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ _id: userId });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Controller function to get a user's likes.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.getUserLikes = async (req, res) => {
  try {
    const { userId } = req.params;
    const likes = await Like.find({ userId })
    .populate({
      path: "statusId",
      select: "_id postedBy type content",
    })
    .lean();
    res.status(200).json({ likes });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Controller function to update a user's profile.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
exports.updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { fullName, bio } = req.body;

    // Check if fullName and bio are provided and not empty
    if (!fullName || !fullName.trim()) {
      return next("fullName cannot be empty");
    }
    if (!bio || !bio.trim()) {
      return next("bio cannot be empty");
    }

    let profilePicture;
    // If a file is provided, upload the image using the utility function
    if (req.file) {
      profilePicture = await uploadImage(req.file);
    }

    // Update the user's profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          fullName,
          bio,
          profilePicture,
        },
      },
      { new: true } // Return the updated document
    );

    // If the user is not found, return a 404 response
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
