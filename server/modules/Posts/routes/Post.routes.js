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
const { runPipeline } = require("../../../cron/jobs/contentPipeline.job");

router.get("/stats", getStats);

router.post("/ai-generate", async (req, res, next) => {



  try {
    const post = await runPipeline();
    res.json({ success: true, post });
  } catch (err) {
    next(err);
  }
});

router.get("/", getPosts);
router.get("/:id", getPost);
router.put("/:id", updatePost);
router.post("/:id/publish", publishPost);
router.patch("/:id/skip", skipPost);
router.delete("/:id", deletePost);

module.exports = router;

