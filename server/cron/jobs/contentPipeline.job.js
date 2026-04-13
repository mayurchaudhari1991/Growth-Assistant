const cron = require("node-cron");
const NewsService = require("../../modules/News/services/News.service");
const AIService = require("../../modules/AI/services/AI.service");
const ImageService = require("../../modules/Images/services/Image.service");
const PostService = require("../../modules/Posts/services/Post.service");
const Post = require("../../modules/Posts/models/Post.model");
const { CRON_SCHEDULE } = require("../../lib/config/constants");

async function runPipeline() {
  console.log("[Pipeline] Starting content pipeline run...");

  const article = await NewsService.fetchFreshArticle();
  console.log(`[Pipeline] Article fetched: "${article.title}"`);

  const content = await AIService.generateLinkedInPost(article);
  console.log("[Pipeline] LinkedIn post generated");

  const image = await ImageService.fetchImage(article.title, article.summary);
  console.log(`[Pipeline] Image fetched: ${image.url}`);

  const post = await Post.create({
    title: article.title,
    content,
    imageUrl: image.url,
    imageCredit: image.credit,
    imageCreditUrl: image.creditUrl,
    sourceUrl: article.sourceUrl,
    sourceTitle: article.sourceTitle,
    feedName: article.feedName,
    status: "pending",
  });

  console.log(`[Pipeline] Draft saved. Post ID: ${post._id}`);
  return post.toObject();
}

async function autoPublishPendingPost() {
  const post = await Post.findOne({ status: "pending" }).sort({ createdAt: 1 });
  if (!post) {
    console.log("[AutoPublish] No pending posts to publish.");
    return;
  }
  console.log(`[AutoPublish] Publishing post: "${post.title}"`);
  await PostService.publishPost(post._id.toString());
  console.log(`[AutoPublish] Published successfully.`);
}

// Returns 3 random { hour, minute } in morning / afternoon / evening windows
function generateDailyPostTimes() {
  const windows = [
    { start: 8, end: 11 }, // Morning 8–11 AM
    { start: 13, end: 16 }, // Afternoon 1–4 PM
    { start: 19, end: 22 }, // Evening 7–10 PM
  ];
  return windows.map(({ start, end }) => ({
    hour: start + Math.floor(Math.random() * (end - start)),
    minute: Math.floor(Math.random() * 60),
  }));
}

let todayPostTimes = generateDailyPostTimes();

function logScheduledTimes() {
  todayPostTimes.forEach(({ hour, minute }, i) => {
    const h = String(hour).padStart(2, "0");
    const m = String(minute).padStart(2, "0");
    console.log(`[AutoPublish] Slot ${i + 1}: ${h}:${m}`);
  });
}

function startCronJobs() {
  if (!cron.validate(CRON_SCHEDULE)) {
    console.error("[Cron] Invalid cron schedule:", CRON_SCHEDULE);
    return;
  }

  // Generate new posts every 3 hours
  cron.schedule(CRON_SCHEDULE, async () => {
    console.log(`[Cron] Generation triggered at ${new Date().toISOString()}`);
    try {
      await runPipeline();
    } catch (err) {
      console.error("[Cron] Pipeline failed:", err.message);
    }
  });

  // Refresh random post times at midnight each day
  cron.schedule("0 0 * * *", () => {
    todayPostTimes = generateDailyPostTimes();
    console.log("[AutoPublish] New daily post times generated:");
    logScheduledTimes();
  });

  // Check every minute if it is time to publish
  cron.schedule("* * * * *", async () => {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();

    const hit = todayPostTimes.find((t) => t.hour === h && t.minute === m);
    if (!hit) return;

    console.log(
      `[AutoPublish] Scheduled slot hit at ${h}:${m < 10 ? "0" + m : m} — publishing...`,
    );
    try {
      await autoPublishPendingPost();
    } catch (err) {
      console.error("[AutoPublish] Failed:", err.message);
    }
  });

  console.log(`[Cron] Generation schedule: "${CRON_SCHEDULE}" (every 3 hours)`);
  console.log("[AutoPublish] Today's posting times:");
  logScheduledTimes();
}

module.exports = { runPipeline, startCronJobs };
