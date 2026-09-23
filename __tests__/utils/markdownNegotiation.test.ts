import { describe, expect, it } from 'vitest';
import { prefersMarkdown } from '../../src/markdown';

describe('prefersMarkdown', () => {
  it('selects markdown when explicitly requested', () => {
    expect(prefersMarkdown('text/markdown')).toBe(true);
    expect(prefersMarkdown('text/markdown, text/html;q=0.9')).toBe(true);
  });

  it('keeps HTML as the default for browsers', () => {
    expect(prefersMarkdown(null)).toBe(false);
    expect(prefersMarkdown('text/html,application/xhtml+xml,*/*;q=0.8')).toBe(false);
    expect(prefersMarkdown('*/*')).toBe(false);
  });

  it('honours q-values', () => {
    expect(prefersMarkdown('text/html, text/markdown;q=0.5')).toBe(false);
    expect(prefersMarkdown('text/markdown;q=0')).toBe(false);
  });
});
