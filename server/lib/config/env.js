require("dotenv").config();

const required = ["MONGODB_URI", "OLLAMA_URL", "OLLAMA_MODEL"];

required.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

module.exports = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",

  mongodb: {
    uri: process.env.MONGODB_URI,
  },

  redis: {
    url: process.env.REDIS_URL || "redis://localhost:6379",
  },

  ollama: {
    url: process.env.OLLAMA_URL,
    model: process.env.OLLAMA_MODEL,
  },

  unsplash: {
    accessKey: process.env.UNSPLASH_ACCESS_KEY || "",
  },

  linkedin: {
    clientId: process.env.LINKEDIN_CLIENT_ID || "",
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "",
    redirectUri:
      process.env.LINKEDIN_REDIRECT_URI ||
      "http://localhost:5000/auth/linkedin/callback",
    get accessToken() {
      return process.env.LINKEDIN_ACCESS_TOKEN || "";
    },
    set accessToken(v) {
      process.env.LINKEDIN_ACCESS_TOKEN = v;
    },
    get personUrn() {
      return process.env.LINKEDIN_PERSON_URN || "";
    },
    set personUrn(v) {
      process.env.LINKEDIN_PERSON_URN = v;
    },
  },
};
