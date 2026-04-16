/**
 * Builds a Gemma-optimized prompt to generate a LinkedIn post from an article
 */
function buildLinkedInPostPrompt(article) {
  return `Write a detailed LinkedIn post for software developers about this article. The reader should understand what the article is about WITHOUT clicking the link.

Article: ${article.title}
Summary: ${article.summary || article.contentSnippet || "No summary available"}

Write 300-400 words following this structure:

1. [EMOJI] One sharp hook sentence about the main topic (what problem it solves)

2. [2-3 sentences] What this technology/tool actually does, explained simply

3. [2-3 sentences] How it works under the hood or what makes it different from existing solutions

4. [2-3 sentences] Why developers should care — real use cases and who benefits most

5. Key technical takeaways:
🔹 [Specific detail about implementation or architecture]
🔹 [Specific detail about performance or scalability]
🔹 [Specific detail about integration or adoption]
🔹 [Specific limitation or trade-off to know]

6. [2-3 sentences] Your practical opinion on whether this is ready for production use

7. [One question] asking developers if they have tried this or plan to

8. [8-10 hashtags] mix of broad tech tags and specific topic tags

STRICT RULES — VIOLATING THESE WILL REJECT THE OUTPUT:
- Minimum 300 words, maximum 400 words
- NEVER use these words: mind-blowing, amazing, incredible, awesome, game-changing, revolutionary, shocked, blew my mind, blown away, 🤯🔥🚀 emojis in body (only one emoji at the very start)
- NEVER use double emojis like 🔥🔥🔥 or 🤯🤯🤯
- NEVER use phrases like "I spent the last few days" unless you actually did
- NEVER ask "Guess what?" or "Did you hear?"
- Write like a senior engineer sharing genuine technical insight, not a hype marketer
- Explain the technical concept so clearly that someone who hasn't read the article understands it

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

module.exports = { buildLinkedInPostPrompt, buildKeywordPrompt };
