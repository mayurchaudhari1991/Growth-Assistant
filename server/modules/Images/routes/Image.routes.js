const express = require("express");
const router = express.Router();
const ImageService = require("../services/Image.service");

router.get("/search", async (req, res, next) => {
  try {
    const { q, summary } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, message: "Query parameter 'q' is required" });
    }
    const image = await ImageService.fetchImage(q, summary || "");
    res.json({ success: true, image });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
