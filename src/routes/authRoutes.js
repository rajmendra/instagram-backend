const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authenticateMiddleware = require("../middlewares/authenticateMiddleware");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.put("/edit-profile", authenticateMiddleware, authController.editProfile);
router.post(
  "/upload-profile-picture",
  upload.single("profilePicture"),
  authController.uploadProfilePicture,
);

module.exports = router;
