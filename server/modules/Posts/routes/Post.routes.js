const express = require("express");
const router = express.Router();
const {
  getPosts,
  getPost,
  updatePost,
  publishPost,
  skipPost,
  deletePost,
  getStats,
} = require("../controllers/Post.controller");

router.get("/stats", getStats);
router.get("/", getPosts);
router.get("/:id", getPost);
router.put("/:id", updatePost);
router.post("/:id/publish", publishPost);
router.patch("/:id/skip", skipPost);
router.delete("/:id", deletePost);

module.exports = router;
