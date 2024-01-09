const express = require("express");
const router = express.Router();
const followController = require("../controllers/followController");

router.post("/", followController.followUser);
router.get("/:userId/following", followController.getFollowingList);

module.exports = router;
