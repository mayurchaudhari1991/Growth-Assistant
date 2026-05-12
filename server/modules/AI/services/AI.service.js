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
    const styles = Object.keys(POST_STYLES);
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    const styleInfo = POST_STYLES[randomStyle];

    const cacheKey = `${REDIS_KEYS.AI_CACHE_PREFIX}${article.sourceUrl}:${randomStyle}`;
    const redis = getRedisClient();

    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        console.log(`[AI] Cache hit for article: ${article.title} (Style: ${randomStyle})`);
        try {
          return JSON.parse(cached);
        } catch {
          return { text: cached, style: randomStyle };
        }
      }
    } catch {
      // Redis unavailable
    }

    const prompt = buildLinkedInPostPrompt(article, randomStyle);
    let generatedText = "";

    // Prefer Groq for sub-second speed and high intelligence if API key is present
    if (env.groq.apiKey) {
      try {
        console.log(`[AI] Generating post using Groq (${env.groq.model}) with style: ${randomStyle}...`);
        const response = await axios.post(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            model: env.groq.model,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.8, // Slightly higher for more variety
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
      console.log(`[AI] Generating post using Ollama (${env.ollama.model}) with style: ${randomStyle}...`);
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
      generatedText = response.data?.response?.trim();
    }

    if (!generatedText) {
      throw new Error("AI service (Groq/Ollama) returned empty response");
    }

    const cleanedText = cleanMarkdown(generatedText);
    const result = { 
      text: cleanedText, 
      style: randomStyle,
      target: styleInfo.target 
    };

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

    console.log(`[AI] Post generated successfully (${randomStyle}). Length: ${generatedText.length} chars`);
    return result;
  }


  async generateFromPrompt(userPrompt) {
    const styles = Object.keys(POST_STYLES);
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    const styleInfo = POST_STYLES[randomStyle];

    const prompt = `Write a high-signal LinkedIn post.
Topic/Idea: "${userPrompt}"
Focus: ${styleInfo.name}

Structure to use (STRICTLY DO NOT include labels or headers):
${styleInfo.structure}

STRICT WRITING RULES:
- PERSPECTIVE: Write as an industry expert who understands high-level technical and business dynamics.
- TONE: Professional, authoritative, and sophisticated.
- NO DIRECT NAMING: DO NOT use words like "CEO", "HR", "Recruiter", "Recruitment", "Candidate", or "Job Seeker" in the post body. Attract them through the relevance of the content, not by naming their roles.
- NO META-REFERENCES: Do not say "Based on the prompt" or "I think".
- ORGANIC FLOW: No headers, no labels. Just natural paragraphs.
- EMOJI BAN: EXACTLY ONE emoji at the start. 🔹 for bullets. NO OTHER EMOJIS.
- HASHTAGS: Exactly 10 targeted hashtags at the end including tags relevant to ${styleInfo.target}.

Post:`;


    let generatedText = "";

    // Prefer Groq
    if (env.groq.apiKey) {
      try {
        console.log(`[AI] Generating custom post using Groq (${env.groq.model}) with style: ${randomStyle}...`);
        const response = await axios.post(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            model: env.groq.model,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.8,
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
        console.error("[AI] Groq failed for custom prompt:", err.message);
      }
    }

    // Fallback to Ollama
    if (!generatedText) {
      console.log(`[AI] Generating custom post using Ollama (${env.ollama.model}) with style: ${randomStyle}...`);
      const response = await axios.post(
        `${env.ollama.url}/api/generate`,
        {
          model: env.ollama.model,
          prompt,
          stream: false,
          options: { temperature: 0.8, top_p: 0.9, num_predict: 600 },
        },
        { timeout: 120000 },
      );
      generatedText = response.data?.response?.trim();
    }

    if (!generatedText) throw new Error("AI service returned empty response");
    return cleanMarkdown(generatedText);
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

