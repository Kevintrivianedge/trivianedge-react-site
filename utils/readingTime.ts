/**
 * Calculate reading time for article content
 * Based on average reading speed: 200 words per minute
 * Industry standard for technical content
 */

export function calculateReadingTime(text: string): string {
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  if (minutes < 1) {
    return 'Less than 1 min read';
  }

  if (minutes === 1) {
    return '1 min read';
  }

  return `${minutes} min read`;
}

/**
 * Get word count for an article
 * Useful for displaying detailed reading metrics
 */
export function getWordCount(text: string): number {
  return text.trim().split(/\s+/).length;
}

/**
 * Estimate time to read with custom reading speed
 * Useful for different content types or audience expertise levels
 */
export function estimateReadingTime(
  text: string,
  wordsPerMinute: number = 200
): { minutes: number; seconds: number; formatted: string } {
  const wordCount = text.trim().split(/\s+/).length;
  const totalSeconds = (wordCount / wordsPerMinute) * 60;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);

  let formatted: string;
  if (minutes === 0) {
    formatted = `${seconds}s read`;
  } else if (minutes === 1) {
    formatted = `1 min read`;
  } else {
    formatted = `${minutes} min read`;
  }

  return { minutes, seconds, formatted };
}

/**
 * Calculate reading time with tier breaks
 * Provides more granular feedback for longer articles
 */
export function readingTimeTier(text: string): {
  tier: 'quick' | 'medium' | 'deep';
  time: string;
  wordCount: number;
} {
  const wordCount = getWordCount(text);
  const { formatted } = estimateReadingTime(text);

  let tier: 'quick' | 'medium' | 'deep';
  if (wordCount < 500) {
    tier = 'quick';
  } else if (wordCount < 1500) {
    tier = 'medium';
  } else {
    tier = 'deep';
  }

  return { tier, time: formatted, wordCount };
}
