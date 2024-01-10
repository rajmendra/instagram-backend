const express = require("express");
const router = express.Router();
const statusController = require("../controllers/statusController");
const likeController = require("../controllers/likeController");
const commentController = require("../controllers/commentController");
const checkFollowingMiddleware = require("../middlewares/checkFollowingMiddleware");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", statusController.getStatuses);
router.post("/:userId", upload.single("file"), statusController.postStatus);
router.post("/:userId/like/:statusId", checkFollowingMiddleware, likeController.likeStatus);
router.post("/:userId/comment/:statusId", checkFollowingMiddleware, commentController.commentStatus);

module.exports = router;
