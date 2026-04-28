const cron = require("node-cron");
const NewsService = require("../../modules/News/services/News.service");
const AIService = require("../../modules/AI/services/AI.service");
const ImageService = require("../../modules/Images/services/Image.service");
const PostService = require("../../modules/Posts/services/Post.service");
const Post = require("../../modules/Posts/models/Post.model");
const { CRON_SCHEDULE } = require("../../lib/config/constants");

// Helper to prevent terminal-breaking characters (\r) from RSS feeds
const scrub = (str) => String(str).replace(/[\r\n]+/g, " ").trim();

async function runPipeline() {
  console.log("[Pipeline] Starting content pipeline run...");

  const article = await NewsService.fetchFreshArticle();
  console.log(`[Pipeline] Article fetched: "${scrub(article.title)}"`);

  const { text: content, style } = await AIService.generateLinkedInPost(article);
  console.log(`[Pipeline] AI complete with style: ${style}`);

  const image = await ImageService.fetchImage(
    article.title,
    article.summary,
    content,
  );
  console.log(`[Pipeline] Image fetched: ${image.url}`);

  const post = await Post.create({
    title: article.title,
    content,
    style,
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

const Schedule = require("../../modules/Schedules/models/Schedule.model");


// Returns random { hour, minute } in morning / afternoon / evening windows from DB
async function generateDailyPostTimes() {
  const windows = await Schedule.find({ isActive: true });
  
  // Fallback to default if DB is empty (seeding should have happened via service)
  if (windows.length === 0) {
    return [
      { hour: 9, minute: 30 },
      { hour: 14, minute: 15 },
      { hour: 20, minute: 45 },
    ];
  }

  return windows.map(({ startTime, endTime }) => ({
    hour: startTime + Math.floor(Math.random() * (endTime - startTime)),
    minute: Math.floor(Math.random() * 60),
  }));
}

let todayPostTimes = [];

// Initialize times on startup
(async () => {
  try {
    todayPostTimes = await generateDailyPostTimes();
    console.log("[AutoPublish] Today's posting times generated:");
    todayPostTimes.forEach(({ hour, minute }, i) => {
       const h = String(hour).padStart(2, "0");
       const m = String(minute).padStart(2, "0");
       console.log(`[AutoPublish] Slot ${i + 1}: ${h}:${m}`);
    });
  } catch (err) {
    console.error("[AutoPublish] Failed to init times:", err.message);
  }
})();


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
  cron.schedule("0 0 * * *", async () => {
    todayPostTimes = await generateDailyPostTimes();
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
