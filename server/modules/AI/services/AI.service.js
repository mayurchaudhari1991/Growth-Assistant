const axios = require("axios");
const { getRedisClient } = require("../../../loaders/redis");
const env = require("../../../lib/config/env");
const { buildLinkedInPostPrompt, POST_STYLES } = require("../../../lib/utils/promptBuilder");
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
        try {
          return JSON.parse(cached);
        } catch {
          return { text: cached, style: "unknown" };
        }
      }
    } catch {
      // Redis unavailable
    }

    const styles = Object.keys(POST_STYLES);
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    const prompt = buildLinkedInPostPrompt(article, randomStyle);
    let generatedText = "";

    // Prefer Groq for sub-second speed and high intelligence if API key is present
    if (env.groq.apiKey) {
      try {
        console.log(`[AI] Generating post using Groq (${env.groq.model})...`);
        const response = await axios.post(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            model: env.groq.model,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 1000,
          },
          {
            headers: {
              Authorization: `Bearer ${env.groq.apiKey}`,
              "Content-Type": "application/json",
            },
            timeout: 30000,
          },
        );
        generatedText = response.data.choices[0].message.content;
      } catch (err) {
        console.error("[AI] Groq failed, falling back to Ollama:", err.message);
      }
    }

    // Fallback to local Ollama if Groq is missing or fails
    if (!generatedText) {
      console.log(`[AI] Generating post using Ollama (${env.ollama.model})...`);
      const response = await axios.post(
        `${env.ollama.url}/api/generate`,
        {
          model: env.ollama.model,
          prompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            num_predict: 500,
          },
        },
        { timeout: 120000 },
      );
      generatedText = response.data?.response?.trim();
    }

    if (!generatedText) {
      throw new Error("AI service (Groq/Ollama) returned empty response");
    }

    const cleanedText = cleanMarkdown(generatedText);
    const result = { text: cleanedText, style: randomStyle };
    const scrubLog = (s) => String(s).replace(/[\r\n]+/g, " ").trim();

    try {
      await redis.set(
        cacheKey,
        JSON.stringify(result),
        "EX",
        REDIS_TTL.AI_CACHE,
      );
    } catch {
      // Redis unavailable
    }

    console.log(`[AI] Post generated successfully. Length: ${generatedText.length} chars`);
    return result;
  }

  async generateFromPrompt(userPrompt) {
    const prompt = `Write a detailed LinkedIn post for software developers and tech professionals based on this idea:

"${userPrompt}"

Write 250-350 words following this structure:

1. [EMOJI] One sharp hook sentence about the main topic

2. [2-3 sentences] Context or explanation of what this is about

3. [2-3 sentences] Why developers or tech professionals should care

4. Key takeaways:
🔹 [Specific insight or tip]
🔹 [Specific insight or tip]
🔹 [Specific insight or tip]
🔹 [Specific insight or tip]

5. [2 sentences] Practical advice or call to action

6. [One question] inviting readers to share their experience

7. [8-10 relevant hashtags]

RULES: Plain text only, no asterisks, no markdown, no hype words, short punchy sentences, start with one emoji hook only.

Post:`;

    const response = await axios.post(
      `${env.ollama.url}/api/generate`,
      {
        model: env.ollama.model,
        prompt,
        stream: false,
        options: { temperature: 0.7, top_p: 0.9, num_predict: 500 },
      },
      { timeout: 120000 },
    );

    const raw = response.data?.response?.trim();
    if (!raw) throw new Error("Ollama returned empty response");
    return cleanMarkdown(raw);
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
