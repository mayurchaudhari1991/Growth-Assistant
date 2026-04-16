const axios = require("axios");
const env = require("../../../lib/config/env");
const { UNSPLASH_BASE_URL } = require("../../../lib/config/constants");
const { extractKeywords } = require("../../../lib/utils/keywordExtractor");

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
  // Build a search query that balances article topic with visual keywords
  _buildSearchQuery(title, summary = "", postContent = "") {
    // Use post content if available (more focused), otherwise title+summary
    const text = postContent
      ? `${title} ${postContent.substring(0, 500)}`
      : `${title} ${summary}`.toLowerCase();

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

    const query = [...titleWords, visualContext].join(" ").substring(0, 100);
    return query || "technology software";
  }

  async fetchImage(title, summary = "", postContent = "") {
    if (!env.unsplash.accessKey) {
      console.warn(
        "[Images] No Unsplash API key configured. Using fallback image.",
      );
      return FALLBACK_IMAGES[
        Math.floor(Math.random() * FALLBACK_IMAGES.length)
      ];
    }

    const query = this._buildSearchQuery(title, summary, postContent);
    console.log(`[Images] Searching Unsplash for: "${query}"`);

    try {
      // Get more results for better selection
      const response = await axios.get(`${UNSPLASH_BASE_URL}/search/photos`, {
        params: {
          query,
          per_page: 20,
          orientation: "landscape",
          order_by: "relevant", // or "latest" for fresh images
        },
        headers: { Authorization: `Client-ID ${env.unsplash.accessKey}` },
        timeout: 10000,
      });

      const results = response.data?.results || [];
      if (results.length === 0) {
        console.warn(`[Images] No results for "${query}", using fallback`);
        return FALLBACK_IMAGES[
          Math.floor(Math.random() * FALLBACK_IMAGES.length)
        ];
      }

      // Pick from top 10 most relevant (not random), prefer higher download count
      const topResults = results
        .slice(0, 10)
        .sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
      const photo = topResults[0] || results[0];

      console.log(
        `[Images] Selected photo: "${photo.description || photo.alt_description || "no description"}" by ${photo.user?.name}`,
      );

      return {
        url: photo.urls?.regular || photo.urls?.full,
        credit: `Photo by ${photo.user?.name} on Unsplash`,
        creditUrl: photo.user?.links?.html || "https://unsplash.com",
      };
    } catch (err) {
      console.warn(
        "[Images] Unsplash fetch failed:",
        err.message,
        "— using fallback",
      );
      return FALLBACK_IMAGES[
        Math.floor(Math.random() * FALLBACK_IMAGES.length)
      ];
    }
  }
}

module.exports = new ImageService();
