const axios = require("axios");
const { getRedisClient } = require("../../../loaders/redis");
const env = require("../../../lib/config/env");
const { buildLinkedInPostPrompt } = require("../../../lib/utils/promptBuilder");
const { REDIS_KEYS, REDIS_TTL } = require("../../../lib/config/constants");

function cleanMarkdown(text) {
  return text
    .replace(/^#{1,6}\s*/gm, "") // remove ## headers
    .replace(/\*\*\*(.+?)\*\*\*/g, "$1") // remove ***bold italic***
    .replace(/\*\*(.+?)\*\*/g, "$1") // remove **bold**
    .replace(/__(.+?)__/g, "$1") // remove __bold__
    .replace(/_(.+?)_/g, "$1") // remove _italic_
    .replace(/^\s*[*-]\s+/gm, "🔹 ") // normalize bullet * or - to 🔹
    .replace(/\n{3,}/g, "\n\n") // max 2 consecutive blank lines
    .trim();
}

class AIService {
  async generateLinkedInPost(article) {
    const cacheKey = `${REDIS_KEYS.AI_CACHE_PREFIX}${article.sourceUrl}`;
    const redis = getRedisClient();

    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        console.log("[AI] Cache hit for article:", article.title);
        return cached;
      }
    } catch {
      // Redis unavailable
    }

    const prompt = buildLinkedInPostPrompt(article);
    console.log(
      `[AI] Generating post for: "${article.title}" using ${env.ollama.model}`,
    );

    const response = await axios.post(
      `${env.ollama.url}/api/generate`,
      {
        model: env.ollama.model,
        prompt,
        stream: false,
        options: {
          temperature: 0.8,
          top_p: 0.9,
          num_predict: 600,
        },
      },
      { timeout: 120000 },
    );

    const raw = response.data?.response?.trim();
    if (!raw) {
      throw new Error("Ollama returned empty response");
    }
    const generatedText = cleanMarkdown(raw);

    try {
      await redis.set(cacheKey, generatedText, "EX", REDIS_TTL.AI_CACHE);
    } catch {
      // Redis unavailable
    }

    console.log("[AI] Post generated successfully");
    return generatedText;
  }

  async checkOllamaHealth() {
    try {
      await axios.get(`${env.ollama.url}/api/tags`, { timeout: 5000 });
      return { healthy: true };
    } catch (err) {
      return { healthy: false, error: err.message };
    }
  }
}

module.exports = new AIService();
