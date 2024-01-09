const express = require("express");
const router = express.Router();
const statusController = require("../controllers/statusController");
const likeController = require("../controllers/likeController");
const commentController = require("../controllers/commentController");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", statusController.getUserStatuses);
router.post("/:userId", upload.single("file"), statusController.postStatus);
router.get("/viewable", statusController.getViewableStatuses);
router.post("/:userId/like/:statusId", likeController.likeStatus);
router.post("/:userId/comment/:statusId", commentController.commentStatus);

module.exports = router;
