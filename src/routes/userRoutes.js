const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateMiddleware = require("../middlewares/authenticateMiddleware");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get(
  "/profile/:userId",
  authenticateMiddleware,
  userController.getUserProfileById,
);
router.put(
  "/profile/:userId",
  authenticateMiddleware,
  upload.single("file"),
  userController.updateUser,
);

module.exports = router;
