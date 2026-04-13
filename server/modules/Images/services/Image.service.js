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
  async fetchImage(title, summary = "") {
    if (!env.unsplash.accessKey) {
      console.warn("[Images] No Unsplash API key configured. Using fallback image.");
      return FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
    }

    const query = extractKeywords(title, summary);
    console.log(`[Images] Searching Unsplash for: "${query}"`);

    try {
      const response = await axios.get(`${UNSPLASH_BASE_URL}/search/photos`, {
        params: { query, per_page: 10, orientation: "landscape" },
        headers: { Authorization: `Client-ID ${env.unsplash.accessKey}` },
        timeout: 10000,
      });

      const results = response.data?.results || [];
      if (results.length === 0) {
        return FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
      }

      const photo = results[Math.floor(Math.random() * Math.min(results.length, 5))];
      return {
        url: photo.urls?.regular || photo.urls?.full,
        credit: `Photo by ${photo.user?.name} on Unsplash`,
        creditUrl: photo.user?.links?.html || "https://unsplash.com",
      };
    } catch (err) {
      console.warn("[Images] Unsplash fetch failed:", err.message, "— using fallback");
      return FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
    }
  }
}

module.exports = new ImageService();
