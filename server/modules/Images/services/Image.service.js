const axios = require("axios");
const env = require("../../../lib/config/env");
const { UNSPLASH_BASE_URL } = require("../../../lib/config/constants");
const { extractKeywords } = require("../../../lib/utils/keywordExtractor");

const POLLINATIONS_BASE_URL = "https://image.pollinations.ai/prompt";

const FALLBACK_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
    credit: "Photo by Alexandre Debiève on Unsplash",
    creditUrl: "https://unsplash.com",
  },
  {
    url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800",
    credit: "Photo by Ilya Pavlov on Unsplash",
    creditUrl: "https://unsplash.com",
  },
  {
    url: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800",
    credit: "Photo by Kevin Ku on Unsplash",
    creditUrl: "https://unsplash.com",
  },
];

class ImageService {
  _normalize(text = "") {
    return String(text)
      .toLowerCase()
      .replace(/[‘’“”"]/g, " ")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  _topicKeywords(title, summary = "", postContent = "") {
    const base = `${title} ${summary} ${String(postContent).slice(0, 400)}`;
    const normalized = this._normalize(base);
    const extracted = extractKeywords(title, summary)
      .split(/\s+/)
      .filter(Boolean);
    const direct = normalized
      .split(/\s+/)
      .filter((w) => w.length >= 4 && w.length <= 18);
    return Array.from(new Set([...extracted, ...direct])).slice(0, 18);
  }

  _scorePhoto(photo, keywords) {
    const tagTitles = (photo.tags || []).map((t) => t.title || "").join(" ");
    const haystack = this._normalize(
      `${photo.alt_description || ""} ${photo.description || ""} ${tagTitles}`,
    );

    let score = 0;
    for (const kw of keywords) {
      if (haystack.includes(kw)) score += 3;
    }

    const techCues = [
      "technology",
      "computer",
      "laptop",
      "coding",
      "developer",
      "software",
      "data",
      "ai",
      "office",
      "startup",
      "business",
      "illustration",
    ];
    for (const cue of techCues) {
      if (haystack.includes(cue)) score += 1;
    }

    const badCues = [
      "wedding",
      "food",
      "dog",
      "cat",
      "mountain",
      "beach",
      "fashion",
    ];
    for (const cue of badCues) {
      if (haystack.includes(cue)) score -= 2;
    }

    score += Math.min(Math.floor((photo.likes || 0) / 200), 3);
    score += Math.min(Math.floor((photo.downloads || 0) / 500), 3);
    return score;
  }

  _buildAIFallbackImage(title, postContent = "") {
    const topic = this._normalize(
      `${title} ${String(postContent).slice(0, 120)}`,
    );
    const prompt = `${topic}, professional linkedin illustration, modern cartoon style, clean flat colors, no text, no watermark`;
    const url = `${POLLINATIONS_BASE_URL}/${encodeURIComponent(prompt)}?width=1200&height=675&seed=${Date.now()}&nologo=true`;
    return {
      url,
      credit: "Generated via Pollinations AI (free)",
      creditUrl: "https://pollinations.ai",
    };
  }

  // Build a search query that balances article topic with visual keywords
  _buildSearchQuery(title, summary = "", postContent = "") {
    const text = this._normalize(
      postContent ? `${title} ${postContent}` : `${title} ${summary}`,
    );

    // Extract core topic words (keep it simple and visual)
    const topicWords = text
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 4 && w.length < 15)
      .filter(
        (w) =>
          ![
            "today",
            "announced",
            "released",
            "launches",
            "introduces",
            "reveals",
            "unveils",
            "about",
            "their",
            "this",
            "that",
            "with",
            "from",
            "your",
            "will",
          ].includes(w),
      );

    // Take top 3 most relevant words from title
    const titleWords = topicWords.slice(0, 3);

    // Add visual context based on topic detection
    let visualContext = "";
    if (
      text.includes("ai") ||
      text.includes("model") ||
      text.includes("llm") ||
      text.includes("agent")
    ) {
      visualContext = "artificial intelligence technology";
    } else if (
      text.includes("code") ||
      text.includes("developer") ||
      text.includes("programming") ||
      text.includes("software")
    ) {
      visualContext = "coding programming computer";
    } else if (
      text.includes("cloud") ||
      text.includes("server") ||
      text.includes("infrastructure")
    ) {
      visualContext = "cloud computing data center";
    } else if (
      text.includes("security") ||
      text.includes("cyber") ||
      text.includes("hack")
    ) {
      visualContext = "cybersecurity technology";
    } else if (
      text.includes("chip") ||
      text.includes("processor") ||
      text.includes("hardware")
    ) {
      visualContext = "computer hardware technology";
    } else {
      visualContext = "technology business";
    }

    const seeded = extractKeywords(title, summary);
    const query = [...titleWords, seeded, visualContext]
      .join(" ")
      .substring(0, 120);
    return query || "technology software";
  }

  async fetchImage(title, summary = "", postContent = "") {
    const query = this._buildSearchQuery(title, summary, postContent);
    const keywords = this._topicKeywords(title, summary, postContent);
    const allowAIFallback = process.env.FREE_AI_IMAGE_FALLBACK !== "false";

    if (env.unsplash.accessKey) {
      console.log(`[Images] Searching Unsplash for: "${query}"`);
      try {
        const response = await axios.get(`${UNSPLASH_BASE_URL}/search/photos`, {
          params: {
            query,
            per_page: 20,
            orientation: "landscape",
            order_by: "relevant",
            content_filter: "high",
          },
          headers: { Authorization: `Client-ID ${env.unsplash.accessKey}` },
          timeout: 10000,
        });

        const results = response.data?.results || [];
        if (results.length) {
          const ranked = results
            .map((photo) => ({
              photo,
              score: this._scorePhoto(photo, keywords),
            }))
            .sort((a, b) => b.score - a.score);

          const best = ranked[0];
          if (best && best.score >= 2) {
            console.log(
              `[Images] Selected photo (score ${best.score}): "${best.photo.description || best.photo.alt_description || "no description"}" by ${best.photo.user?.name}`,
            );
            return {
              url: best.photo.urls?.regular || best.photo.urls?.full,
              credit: `Photo by ${best.photo.user?.name} on Unsplash`,
              creditUrl: best.photo.user?.links?.html || "https://unsplash.com",
            };
          }
          console.warn("[Images] Unsplash results were weakly relevant.");
        } else {
          console.warn(`[Images] No Unsplash results for "${query}".`);
        }
      } catch (err) {
        console.warn("[Images] Unsplash fetch failed:", err.message);
      }
    } else {
      console.warn("[Images] No Unsplash API key configured.");
    }

    if (allowAIFallback) {
      console.log("[Images] Using free AI image fallback (Pollinations).");
      return this._buildAIFallbackImage(title, postContent);
    }

    console.warn("[Images] Falling back to static image set.");
    return FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
  }
}

module.exports = new ImageService();
