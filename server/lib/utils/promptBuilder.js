const POST_STYLES = {
  deep_dive: {
    name: "Deep Dive",
    wordCount: "350-450 words",
    structure: `Write this as a technical architectural review.
- Start with a sharp, contrarian hook about the topic's future.
- Explain the core technical friction this solves (e.g., latency, state management, consistency).
- Dive deep into the mechanics: Discuss implementation hurdles, data-flow, or specific algorithm nuances.
- Include a 🔹 list of 3 high-signal insights (Performance, Scalability, and a "Gotcha"/Trade-off).
- State your production-readiness verdict.
- Last line: Ask a challenging question about breaking this tech at scale.`,
  },
  hot_take: {
    name: "Hot Take",
    wordCount: "250-300 words",
    structure: `Write this as a provocative senior engineer's opinion.
- Start with a strong, definitive take.
- Explain WHY you hold this stance using technical reasoning—not generic marketing speak.
- Discuss how this impacts the developer's daily workflow or system architecture.
- Explain the "Old Way" vs the "New Way" trade-off.
- Last line: Challenge the reader to explain why they wouldn't use this.`,
  },
  mistake_based: {
    name: "Mistake Based",
    wordCount: "250-350 words",
    structure: `Write this as an "experienced engineer" war story.
- Start with: "Most devs misunderstanding [Concept] leads to..."
- Explain a specific scenario where this concept fails in production.
- Teach the real mechanics and how this tool/article fixes the failure mode.
- Discuss "The Catch": What are the hidden costs?
- Last line: Ask for their most painful production failure related to this.`,
  },
  comparison: {
    name: "Comparison",
    wordCount: "350-450 words",
    structure: `Write this as a technical benchmark/comparison.
- Start with a pattern-breaking "X vs Y" hook.
- Compare the fundamental mechanics of both (not just features).
- Discuss the "Nuance": Why the obvious choice is often wrong for specific stacks.
- Contrast the trade-offs (Latency vs Throughput, or Dev Experience vs Runtime Performance).
- Last line: Ask if they would risk a rewrite for these gains.`,
  }
};

/**
 * Builds a persona-driven, engagement-optimized prompt
 */
function buildLinkedInPostPrompt(article, styleKey = "deep_dive") {
  const style = POST_STYLES[styleKey] || POST_STYLES.deep_dive;

  return `Write a high-signal LinkedIn post for senior software developers.
Focus: ${style.name}
Target length: ${style.wordCount}

Article Reference:
Title: ${article.title}
Context: ${article.summary || article.contentSnippet || "Focus on the technical implementation."}

Structure to use (STRICTLY DO NOT include labels or headers):
${style.structure}

STRICT WRITING RULES:
- PERSPECTIVE: Write as an experienced, slightly cynical senior architect.
- NO DICTIONARY DEFINITIONS: Do NOT explain what AI, Cloud, or APIs are. Assume the reader already knows.
- FOCUS ON TRADE-OFFS: Every tech has a cost. Discuss the technical debt or performance penalties.
- NO META-REFERENCES: Adopt the knowledge as your own. NEVER say "This article says".
- ORGANIC FLOW: No headers, no labels (The Fix:, Verdict:). Just natural, technical paragraphs.
- TONE: Professional, measured, and technical. Avoid marketing fluff like "game-changer" or "incredible".
- EMOJI BAN: EXACTLY ONE emoji at the start. 🔹 for bullets. NO OTHER EMOJIS.
- HASHTAGS: Exactly 10 targeted hashtags at the end.

Post:`;
}

/**
 * Builds a simple keyword extraction prompt
 */
function buildKeywordPrompt(title, summary) {
  return `Extract 3-5 single-word keywords from this tech article title and summary for an image search.
Return ONLY comma-separated keywords, nothing else.

Title: ${title}
Summary: ${summary || ""}

Keywords:`;
}

module.exports = { buildLinkedInPostPrompt, buildKeywordPrompt, POST_STYLES };

