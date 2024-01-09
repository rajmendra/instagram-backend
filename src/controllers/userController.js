const User = require("../models/User");
const { v4: uuidv4 } = require("uuid");
const uploadImage = require("../utils/uploadImage");

exports.getUserProfileById = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("userId", userId);
    const user = await User.findOne({ _id: userId });

    console.log("user", user);
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { fullName, bio } = req.body;

    let profilePicture;
    if (req.file) {
      profilePicture = await uploadImage(req.file);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          fullName,
          bio,
          profilePicture,
        },
      },
      { new: true }, // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
