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

    const realFollowers = await LinkedInService.getFollowerCount();

    // Mocking analytics data until LinkedIn API for stats is integrated
    // In a production app, these would come from the LinkedIn Analytics API or a separate metrics collection
    const analytics = {
      reach: { value: "12.4K", trend: 12 },
      followers: { value: realFollowers != null ? realFollowers.toLocaleString() : "2,840", trend: 8 },

      engagementRate: { value: "4.2%", trend: 24 },

      activeJobs: { value: pending },
      weeklyEngagement: [
        { name: "Mon", value: 400 }, { name: "Tue", value: 300 }, { name: "Wed", value: 600 },
        { name: "Thu", value: 800 }, { name: "Fri", value: 500 }, { name: "Sat", value: 900 },
        { name: "Sun", value: 1100 },
      ],
      contentStrategy: [
        { name: "AI Tech", value: 45, color: "#6366f1" },
        { name: "Development", value: 25, color: "#ec4899" },
        { name: "Career", value: 20, color: "#8b5cf6" },
        { name: "Networking", value: 10, color: "#10b981" },
      ],
      growthMetrics: [
        { name: "Jan", followers: 120, reach: 2400 },
        { name: "Feb", followers: 210, reach: 3500 },
        { name: "Mar", followers: 450, reach: 6800 },
        { name: "Apr", followers: 890, reach: 12400 },
      ]
    };

    return { 
      pending, 
      posted, 
      skipped, 
      total: pending + posted + skipped,
      ...analytics
    };
  }

}

module.exports = new PostService();
