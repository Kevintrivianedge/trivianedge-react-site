import { describe, it, expect } from 'vitest';
import { getSEOTrendSignal, getTrendKeywords } from '../../utils/seoTrends';

describe('getSEOTrendSignal', () => {
  it('returns a valid signal object for the home context', () => {
    const signal = getSEOTrendSignal('home');
    expect(signal).toHaveProperty('primaryKeyword');
    expect(signal).toHaveProperty('secondaryKeywords');
    expect(signal).toHaveProperty('titleVariant');
    expect(signal).toHaveProperty('descriptionVariant');
    expect(signal).toHaveProperty('schemaEmphasis');
    expect(signal).toHaveProperty('freshnessBadge');
  });

  it('returns non-empty strings for all fields', () => {
    const signal = getSEOTrendSignal('home');
    expect(signal.primaryKeyword.length).toBeGreaterThan(0);
    expect(signal.titleVariant.length).toBeGreaterThan(0);
    expect(signal.descriptionVariant.length).toBeGreaterThan(0);
    expect(signal.secondaryKeywords).toHaveLength(3);
    expect(signal.schemaEmphasis).toHaveLength(3);
  });

  it('freshnessBadge is a valid ISO date string (YYYY-MM-DD)', () => {
    const { freshnessBadge } = getSEOTrendSignal('home');
    expect(/^\d{4}-\d{2}-\d{2}$/.test(freshnessBadge)).toBe(true);
  });

  it('returns different title variants for different page contexts', () => {
    const home = getSEOTrendSignal('home').titleVariant;
    const blog = getSEOTrendSignal('blog').titleVariant;
    const privacy = getSEOTrendSignal('privacy').titleVariant;
    // Privacy and terms have single-entry variant pools
    expect(privacy.length).toBeGreaterThan(0);
    // Home and blog variant pools are different
    expect(home).not.toBe(blog);
  });

  it('returns valid signals for all page contexts', () => {
    const contexts = ['home', 'blog', 'blog-post', 'privacy', 'terms'] as const;
    for (const ctx of contexts) {
      const signal = getSEOTrendSignal(ctx);
      expect(signal.primaryKeyword).toBeTruthy();
    }
  });
});

describe('getTrendKeywords', () => {
  it('returns a non-empty comma-separated string', () => {
    const keywords = getTrendKeywords();
    expect(typeof keywords).toBe('string');
    expect(keywords.length).toBeGreaterThan(0);
    expect(keywords).toContain(',');
  });

  it('returns deterministic output for the same day (no randomness)', () => {
    const first = getTrendKeywords();
    const second = getTrendKeywords();
    expect(first).toBe(second);
  });
});
