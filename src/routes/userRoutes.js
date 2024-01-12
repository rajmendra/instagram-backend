const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateMiddleware = require("../middlewares/authenticateMiddleware");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get(
  "/:userId",
  authenticateMiddleware,
  userController.getUserProfileById,
);

router.get(
  "/:userId/likes",
  authenticateMiddleware,
  userController.getUserLikes,
);
router.put(
  "/:userId",
  authenticateMiddleware,
  upload.single("file"),
  userController.updateUser,
);

module.exports = router;
