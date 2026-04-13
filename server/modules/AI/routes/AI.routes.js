const express = require("express");
const router = express.Router();
const AIService = require("../services/AI.service");

router.get("/health", async (req, res, next) => {
  try {
    const result = await AIService.checkOllamaHealth();
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
});

router.post("/generate", async (req, res, next) => {
  try {
    const { title, summary, feedName, sourceUrl } = req.body;
    if (!title || !sourceUrl) {
      return res.status(400).json({ success: false, message: "title and sourceUrl are required" });
    }
    const content = await AIService.generateLinkedInPost({ title, summary, feedName, sourceUrl });
    res.json({ success: true, content });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
