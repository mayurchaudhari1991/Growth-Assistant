const Redis = require("ioredis");
const env = require("../lib/config/env");

let redisClient = null;

function getRedisClient() {
  if (redisClient) return redisClient;

  redisClient = new Redis(env.redis.url, {
    lazyConnect: true,
    retryStrategy(times) {
      if (times > 3) {
        console.warn("[Redis] Max retries reached. Running without Redis cache.");
        return null;
      }
      return Math.min(times * 200, 2000);
    },
  });

  redisClient.on("connect", () => console.log("[Redis] Connected successfully"));
  redisClient.on("error", (err) => console.warn("[Redis] Error:", err.message));

  return redisClient;
}

async function connectRedis() {
  const client = getRedisClient();
  try {
    await client.connect();
  } catch (err) {
    console.warn("[Redis] Could not connect:", err.message, "— continuing without cache");
  }
}

module.exports = { getRedisClient, connectRedis };
