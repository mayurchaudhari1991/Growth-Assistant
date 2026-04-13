module.exports = {
  RSS_FEEDS: [
    {
      name: "TechCrunch",
      url: "https://techcrunch.com/feed/",
    },
    {
      name: "Dev.to",
      url: "https://dev.to/feed",
    },
    {
      name: "Hacker News",
      url: "https://hnrss.org/frontpage",
    },
    {
      name: "The Verge Tech",
      url: "https://www.theverge.com/rss/index.xml",
    },
  ],

  CRON_SCHEDULE: "0 */3 * * *",

  POST_STATUS: {
    PENDING: "pending",
    POSTED: "posted",
    SKIPPED: "skipped",
  },

  REDIS_KEYS: {
    SEEN_ARTICLES: "seen_articles",
    AI_CACHE_PREFIX: "ai_cache:",
  },

  REDIS_TTL: {
    AI_CACHE: 60 * 60 * 6,
    SEEN_ARTICLE: 60 * 60 * 24 * 7,
  },

  UNSPLASH_BASE_URL: "https://api.unsplash.com",

  LINKEDIN_API_BASE: "https://api.linkedin.com/v2",
  LINKEDIN_REST_BASE: "https://api.linkedin.com/rest",
  LINKEDIN_API_VERSION: "202601",
  LINKEDIN_AUTH_URL: "https://www.linkedin.com/oauth/v2/authorization",
  LINKEDIN_TOKEN_URL: "https://www.linkedin.com/oauth/v2/accessToken",
  LINKEDIN_SCOPES: ["w_member_social", "openid", "profile"],
};
