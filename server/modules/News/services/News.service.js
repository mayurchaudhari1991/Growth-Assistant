const Parser = require("rss-parser");
const { getRedisClient } = require("../../../loaders/redis");
const { RSS_FEEDS, REDIS_KEYS, REDIS_TTL } = require("../../../lib/config/constants");

const parser = new Parser({
  timeout: 10000,
  headers: { "User-Agent": "GrowthAssistant/1.0" },
});

class NewsService {
  async fetchFreshArticle() {
    const redis = getRedisClient();

    const allArticles = [];

    for (const feed of RSS_FEEDS) {
      try {
        const feedData = await parser.parseURL(feed.url);
        const articles = (feedData.items || []).slice(0, 10).map((item) => ({
          title: item.title || "",
          summary: item.contentSnippet || item.content || "",
          sourceUrl: item.link || "",
          sourceTitle: feedData.title || feed.name,
          feedName: feed.name,
          pubDate: item.pubDate || item.isoDate || "",
        }));
        allArticles.push(...articles);
      } catch (err) {
        console.warn(`[News] Failed to fetch feed "${feed.name}":`, err.message);
      }
    }

    if (allArticles.length === 0) {
      throw new Error("No articles fetched from any RSS feed");
    }

    const shuffled = allArticles.sort(() => Math.random() - 0.5);

    for (const article of shuffled) {
      if (!article.sourceUrl || !article.title) continue;

      let alreadySeen = false;
      try {
        alreadySeen = await redis.sismember(REDIS_KEYS.SEEN_ARTICLES, article.sourceUrl);
      } catch {
        // Redis unavailable — skip deduplication
      }

      if (!alreadySeen) {
        try {
          await redis.sadd(REDIS_KEYS.SEEN_ARTICLES, article.sourceUrl);
          await redis.expire(REDIS_KEYS.SEEN_ARTICLES, REDIS_TTL.SEEN_ARTICLE);
        } catch {
          // Redis unavailable — continue anyway
        }

        console.log(`[News] Fresh article: "${article.title}" from ${article.feedName}`);
        return article;
      }
    }

    console.warn("[News] All recent articles already seen. Returning most recent anyway.");
    return shuffled[0];
  }
}

module.exports = new NewsService();
