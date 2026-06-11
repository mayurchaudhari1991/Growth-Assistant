const POST_STYLES = {
  deep_dive: {
    name: "Deep Dive",
    wordCount: "350-450 words",
    target: "Senior Architects & Developers",
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
    target: "Tech Leads & Engineering Managers",
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
    target: "Developers & Team Leads",
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
    target: "Decision Makers & Architects",
    structure: `Write this as a technical benchmark/comparison.
- Start with a pattern-breaking "X vs Y" hook.
- Compare the fundamental mechanics of both (not just features).
- Discuss the "Nuance": Why the obvious choice is often wrong for specific stacks.
- Contrast the trade-offs (Latency vs Throughput, or Dev Experience vs Runtime Performance).
- Last line: Ask if they would risk a rewrite for these gains.`,
  },
  ceo_vision: {
    name: "Strategic Impact",
    wordCount: "200-300 words",
    target: "Business Leaders",
    structure: `Write this from a leadership and strategic perspective.
- Start with a hook about market evolution or organizational agility.
- Discuss how this topic impacts long-term growth and bottom-line efficiency.
- Focus on the "big picture" value without naming specific titles.
- Include a 🔹 list of 3 strategic pillars for this transition.
- Last line: Ask a question about their roadmap for the coming year.`,
  },
  recruiter_pulse: {
    name: "Talent Trends",
    wordCount: "200-300 words",
    target: "Talent Professionals",
    structure: `Write this from a workforce and culture perspective.
- Start with a hook about the changing landscape of professional expertise.
- Discuss how this shift affects team building and skill acquisition.
- Focus on the human capital aspect without naming specific titles.
- Include a 🔹 list of 3 key indicators of expertise to watch for.
- Last line: Ask how they are adapting their evaluation frameworks.`,
  },
  candidate_roadmap: {
    name: "Growth Roadmap",
    wordCount: "250-350 words",
    target: "Career Seekers",
    structure: `Write this as a professional development guide.
- Start with a hook about staying relevant in an evolving industry.
- Explain how mastering this concept differentiates a professional in the market.
- Focus on actionable career advancement without naming specific roles.
- Include a 🔹 list of 3 high-impact learning milestones.
- Last line: Ask what their next major skill pivot will be.`,
  },
  unified_growth: {
    name: "Ecosystem Pulse",
    wordCount: "350-450 words",
    target: "The Tech Community",
    structure: `Write this as a holistic industry analysis.
- Start with a hook that captures the broad shift in the tech landscape.
- Weave together the value for leadership, talent acquisition, and individual growth naturally into the narrative.
- DO NOT use labels or names for different groups (no "For CEOs", "For HR").
- Focus on the synergy between strategy, hiring, and execution.
- Include a 🔹 list of 4 key takeaways that bridge the gap between business and talent.
- Last line: Ask a question that invites a multi-disciplinary discussion.`,
  },
};

/**
 * Builds a persona-driven, engagement-optimized prompt
 */
function buildLinkedInPostPrompt(article, styleKey = "deep_dive") {
  const style = POST_STYLES[styleKey] || POST_STYLES.deep_dive;
  const hookStyles = [
    "Contrarian: challenge a common belief in one sentence",
    "Mistake-first: point out a costly mistake most teams make",
    "Outcome-first: reveal an unexpected result or impact",
    "Prediction-first: bold but reasoned prediction about what happens next",
    "Question-hook: sharp question that creates immediate curiosity",
  ];
  const selectedHookStyle =
    hookStyles[Math.floor(Math.random() * hookStyles.length)];

  return `Write a high-signal LinkedIn post.
Topic: ${article.title}
Focus: ${style.name}
Target length: ${style.wordCount}

Article Reference:
Title: ${article.title}
Context: ${article.summary || article.contentSnippet || "Focus on the key insights of this topic."}

CONTENT INTENT (use as guidance, NOT as a fixed template):
${style.structure}

OPENING HOOK (MOST IMPORTANT):
- The first line must be scroll-stopping and curiosity-driven.
- Use this hook style for this post: ${selectedHookStyle}
- Avoid generic openings. Do NOT start with weak lines like "Today I read..." or "Here is an update...".

STRICT WRITING RULES:
- PERSPECTIVE: Write as an industry expert who understands high-level technical and business dynamics.
- TONE: Professional, authoritative, and sophisticated.
- NO DIRECT NAMING: DO NOT use words like "CEO", "HR", "Recruiter", "Recruitment", "Candidate", or "Job Seeker" in the post body. Attract them through the relevance of the content, not by naming their roles.
- NO DICTIONARY DEFINITIONS: Do NOT explain basics. Assume professional knowledge.
- NO META-REFERENCES: Do NOT say "In this article" or "The author says". Adopt the knowledge.
- FORMAT FREEDOM: Do NOT follow a fixed section-by-section format. Keep it natural and varied post to post.
- ORGANIC FLOW: No headers, no labels. Use a mix of short punchy lines + concise paragraphs.
- EMOJI BAN: EXACTLY ONE emoji at the start. 🔹 for bullets. NO OTHER EMOJIS.
- CAPTION + HASHTAGS: Keep the main content format flexible, but always end with a concise caption-style closing and 8-12 trending relevant hashtags.

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
