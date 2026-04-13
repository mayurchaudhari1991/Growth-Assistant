const Post = require("../models/Post.model");
const LinkedInService = require("../../LinkedIn/services/LinkedIn.service");

class PostService {
  async getAllPosts(filter = {}, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const query = {};
    if (filter.status) query.status = filter.status;

    const [posts, total] = await Promise.all([
      Post.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Post.countDocuments(query),
    ]);

    return { posts, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async getPostById(id) {
    const post = await Post.findById(id).lean();
    if (!post) {
      const err = new Error("Post not found");
      err.status = 404;
      throw err;
    }
    return post;
  }

  async updatePost(id, data) {
    const post = await Post.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).lean();
    if (!post) {
      const err = new Error("Post not found");
      err.status = 404;
      throw err;
    }
    return post;
  }

  async publishPost(id) {
    const post = await Post.findById(id);
    if (!post) {
      const err = new Error("Post not found");
      err.status = 404;
      throw err;
    }
    if (post.status === "posted") {
      const err = new Error("Post already published");
      err.status = 400;
      throw err;
    }

    const linkedinPostId = await LinkedInService.publishPost(post);

    post.status = "posted";
    post.linkedinPostId = linkedinPostId;
    post.postedAt = new Date();
    await post.save();

    return post.toObject();
  }

  async skipPost(id) {
    const post = await Post.findByIdAndUpdate(
      id,
      { $set: { status: "skipped" } },
      { new: true }
    ).lean();
    if (!post) {
      const err = new Error("Post not found");
      err.status = 404;
      throw err;
    }
    return post;
  }

  async deletePost(id) {
    const post = await Post.findByIdAndDelete(id).lean();
    if (!post) {
      const err = new Error("Post not found");
      err.status = 404;
      throw err;
    }
    return post;
  }

  async getStats() {
    const [pending, posted, skipped] = await Promise.all([
      Post.countDocuments({ status: "pending" }),
      Post.countDocuments({ status: "posted" }),
      Post.countDocuments({ status: "skipped" }),
    ]);
    return { pending, posted, skipped, total: pending + posted + skipped };
  }
}

module.exports = new PostService();
