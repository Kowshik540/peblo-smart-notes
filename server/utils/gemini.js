export const generateAI = async (prompt) => {
  try {
    // Validate input
    if (!prompt || prompt.trim().length === 0) {
      return 'No content available to summarize.';
    }

    // Normalize whitespace
    const cleanText = prompt.replace(/\s+/g, ' ').trim();

    // Split into sentences using punctuation
    const sentences =
      cleanText.match(/[^.!?]+[.!?]*/g) || [cleanText];

    // Build a simple summary from the first 3 sentences
    let summary = sentences.slice(0, 3).join(' ').trim();

    // If summary is too short, include up to 300 characters
    if (summary.length < 50) {
      summary = cleanText.substring(0, 300);
    }

    // Limit length to keep the output concise
    if (summary.length > 500) {
      summary = summary.substring(0, 500) + '...';
    }

    return `📌 AI Summary\n\n${summary}`;
  } catch (error) {
    console.error('Local Summary Error:', error);

    // Final fallback
    const fallback =
      prompt?.substring(0, 200) || 'Unable to generate summary.';

    return `📌 AI Summary\n\n${fallback}...`;
  }
};