const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/profile/:userId", userController.getUserProfileById);
router.put(
  "/profile/:userId",
  upload.single("file"),
  userController.updateUser,
);

module.exports = router;
