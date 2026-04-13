const PostService = require("../services/Post.service");
const { validateUpdatePost } = require("../validators/Post.validator");

async function getPosts(req, res, next) {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const result = await PostService.getAllPosts({ status }, parseInt(page), parseInt(limit));
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

async function getPost(req, res, next) {
  try {
    const post = await PostService.getPostById(req.params.id);
    res.json({ success: true, post });
  } catch (err) {
    next(err);
  }
}

async function updatePost(req, res, next) {
  try {
    const { error } = validateUpdatePost(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((d) => d.message).join(", "),
      });
    }
    const post = await PostService.updatePost(req.params.id, req.body);
    res.json({ success: true, post });
  } catch (err) {
    next(err);
  }
}

async function publishPost(req, res, next) {
  try {
    const post = await PostService.publishPost(req.params.id);
    res.json({ success: true, post });
  } catch (err) {
    next(err);
  }
}

async function skipPost(req, res, next) {
  try {
    const post = await PostService.skipPost(req.params.id);
    res.json({ success: true, post });
  } catch (err) {
    next(err);
  }
}

async function deletePost(req, res, next) {
  try {
    await PostService.deletePost(req.params.id);
    res.json({ success: true, message: "Post deleted" });
  } catch (err) {
    next(err);
  }
}

async function getStats(req, res, next) {
  try {
    const stats = await PostService.getStats();
    res.json({ success: true, stats });
  } catch (err) {
    next(err);
  }
}

module.exports = { getPosts, getPost, updatePost, publishPost, skipPost, deletePost, getStats };
