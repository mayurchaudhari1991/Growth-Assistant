/**
 * Builds a Gemma-optimized prompt to generate a LinkedIn post from an article
 */
function buildLinkedInPostPrompt(article) {
  return `Write a LinkedIn post in English about this article. Use ONLY plain text — never use ** or __ for anything.

Article: ${article.title}
Summary: ${article.summary || article.contentSnippet || "No summary available"}

Write the post now using this exact structure. No markdown, no ** or ##, plain text only:

[emoji] [Hook: 1 sharp sentence about what happened in this article that would surprise a developer]

[4-5 sentences: explain what was done, how it works, and why developers should care. Include specific technical details from the article. Be informative and direct.]

[2-3 sentences: what this changes or enables for engineers, companies, or the industry.]

Key takeaways:
🔹 [technical insight 1 from the article — be specific]
🔹 [technical insight 2 from the article — be specific]
🔹 [technical insight 3 from the article — be specific]
🔹 [technical insight 4 from the article — be specific]

[1 thought-provoking question that invites engineers to share their experience or opinion in the comments]

[10-12 relevant hashtags on one line, no blank line before them]

IMPORTANT: Write plain English sentences only. Zero asterisks. Zero hashtags in the body. Zero markdown. Start immediately with the emoji hook.

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
