const express = require("express");
const router = express.Router();
const AIService = require("../services/AI.service");
const Post = require("../../Posts/models/Post.model");
const ImageService = require("../../Images/services/Image.service");

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
      return res
        .status(400)
        .json({ success: false, message: "title and sourceUrl are required" });
    }
    const { text: content, style } = await AIService.generateLinkedInPost({
      title,
      summary,
      feedName,
      sourceUrl,
    });
    res.json({ success: true, content, style });
  } catch (err) {
    next(err);
  }
});

router.post("/custom-generate", async (req, res, next) => {
  try {
    const { prompt } = req.body;
    if (!prompt || !prompt.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "prompt is required" });
    }

    const content = await AIService.generateFromPrompt(prompt.trim());
    const image = await ImageService.fetchImage(prompt.trim(), "", content);

    const post = await Post.create({
      title: prompt.trim().substring(0, 120),
      content,
      imageUrl: image.url,
      imageCredit: image.credit,
      imageCreditUrl: image.creditUrl,
      sourceUrl: "",
      sourceTitle: "Custom Post",
      feedName: "Manual",
      status: "pending",
    });

    res.json({ success: true, post });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
