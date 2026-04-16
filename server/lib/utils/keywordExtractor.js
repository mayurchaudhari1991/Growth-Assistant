const TECH_STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "but",
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "with",
  "by",
  "from",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "could",
  "should",
  "may",
  "might",
  "can",
  "this",
  "that",
  "these",
  "those",
  "it",
  "its",
  "how",
  "why",
  "what",
  "when",
  "where",
  "who",
  "new",
  "just",
  "now",
  "up",
  "out",
  "more",
  "most",
  "also",
  "than",
  "into",
  "over",
  "after",
  "about",
  "says",
  "said",
  "via",
  "s",
  "using",
  "first",
  "use",
  "used",
  "make",
  "making",
  "get",
  "got",
  "one",
]);

// High-value tech/AI keywords — boosted in ranking so they appear in Unsplash queries
const TECH_BOOST_WORDS = new Set([
  "ai",
  "llm",
  "gpt",
  "agent",
  "agents",
  "model",
  "models",
  "neural",
  "machine",
  "learning",
  "deep",
  "transformer",
  "inference",
  "training",
  "developer",
  "coding",
  "code",
  "software",
  "programming",
  "engineer",
  "cloud",
  "devops",
  "kubernetes",
  "docker",
  "api",
  "backend",
  "frontend",
  "cybersecurity",
  "security",
  "automation",
  "data",
  "python",
  "javascript",
  "openai",
  "gemini",
  "claude",
  "llama",
  "mistral",
  "ollama",
  "hugging",
  "startup",
  "saas",
  "platform",
  "framework",
  "open",
  "source",
]);

/**
 * Extracts keywords from article title + summary for Unsplash image search
 */
function extractKeywords(title, summary = "") {
  const text = `${title} ${summary}`.toLowerCase();
  const words = text
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !TECH_STOP_WORDS.has(w));

  const freq = {};
  words.forEach((w) => {
    freq[w] = (freq[w] || 0) + 1;
    if (TECH_BOOST_WORDS.has(w)) freq[w] += 3; // boost tech/AI terms
  });

  const sorted = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([word]) => word);

  return sorted.length > 0
    ? sorted.join(" ")
    : "artificial intelligence developer";
}

module.exports = { extractKeywords };
