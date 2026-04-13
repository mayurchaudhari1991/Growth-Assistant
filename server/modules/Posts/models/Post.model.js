const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    imageCredit: {
      type: String,
      default: null,
    },
    imageCreditUrl: {
      type: String,
      default: null,
    },
    sourceUrl: {
      type: String,
      required: true,
    },
    sourceTitle: {
      type: String,
      default: "",
    },
    feedName: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "posted", "skipped"],
      default: "pending",
    },
    linkedinPostId: {
      type: String,
      default: null,
    },
    postedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

postSchema.index({ status: 1, createdAt: -1 });

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
