const express = require("express");
const router = express.Router();
const { runPipeline } = require("../../../cron/jobs/contentPipeline.job");

router.post("/trigger", async (req, res, next) => {
  try {
    const post = await runPipeline();
    res.json({ success: true, message: "Pipeline triggered", post });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
