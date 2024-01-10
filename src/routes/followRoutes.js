const express = require("express");
const router = express.Router();
const followController = require("../controllers/followController");
const authenticateMiddleware = require("../middlewares/authenticateMiddleware");

router.post("/", authenticateMiddleware, followController.followUser);
router.get("/:userId/following", authenticateMiddleware, followController.getFollowingList);

module.exports = router;
