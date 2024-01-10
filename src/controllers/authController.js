const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config = require("../../config");
const { v4: uuidv4 } = require("uuid"); // For generating unique filenames
const cloudinary = require("cloudinary").v2; // Use your chosen cloudinary library

cloudinary.config({
  cloud_name: "your-cloud-name",
  api_key: "your-api-key",
  api_secret: "your-api-secret",
});

exports.registerUser = async (req, res) => {
  try {
    const { username, password, fullName, email, bio } = req.body;
    const already_exists = await User.findOne({ username });
    if (already_exists) {
      res.status(500).json({ error: "Username already exists" });
      return;
    }
    const email_exists = await User.findOne({ email });
    if (email_exists) {
      res.status(500).json({ error: "Email already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      fullName,
      email,
      bio,
    });
    await newUser.save();

    console.log("username", username);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign({ userId: user._id }, config.jwtSecret, {
      expiresIn: "24h",
    });

    res.status(200).json({ userId: user._id, token });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload the image to a third-party service (Cloudinary in this example)
    const result = await cloudinary.uploader.upload(
      req.file.buffer.toString("base64"),
      {
        folder: "profile-pictures",
        public_id: `${uuidv4()}-${req.file.originalname}`,
      },
    );

    // Update the user's profile picture URL in the database
    const { userId } = req.user;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: result.secure_url },
      { new: true },
    );

    res.status(200).json({
      message: "Profile picture uploaded successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.editProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const { fullName, email, bio, profilePicture } = req.body;

    // Update the user's profile information
    const updatedProfile = await User.findByIdAndUpdate(
      userId,
      { fullName, email, bio, profilePicture },
      { new: true }, // To return the updated document
    );

    res
      .status(200)
      .json({ message: "Profile updated successfully", user: updatedProfile });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
