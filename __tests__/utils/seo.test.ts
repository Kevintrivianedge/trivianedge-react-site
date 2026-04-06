import { describe, it, expect } from 'vitest';
import {
  SEO_CONFIG,
  KEYWORD_CLUSTERS,
  ALL_KEYWORDS,
  buildOrganizationSchema,
  buildWebSiteSchema,
} from '../../utils/seo';

describe('SEO_CONFIG', () => {
  it('has required fields', () => {
    expect(SEO_CONFIG.siteName).toBe('TrivianEdge');
    expect(SEO_CONFIG.siteUrl).toMatch(/^https?:\/\//);
    expect(SEO_CONFIG.defaultTitle.length).toBeGreaterThan(0);
    expect(SEO_CONFIG.defaultDescription.length).toBeGreaterThan(0);
    expect(SEO_CONFIG.locale).toBe('en_CA');
  });
});

describe('KEYWORD_CLUSTERS', () => {
  it('contains all expected cluster keys', () => {
    const keys = Object.keys(KEYWORD_CLUSTERS);
    expect(keys).toContain('bpo');
    expect(keys).toContain('outsourcing');
    expect(keys).toContain('offshore');
    expect(keys).toContain('softwareDev');
    expect(keys).toContain('talent');
  });

  it('each cluster is a non-empty array of strings', () => {
    for (const [, keywords] of Object.entries(KEYWORD_CLUSTERS)) {
      expect(Array.isArray(keywords)).toBe(true);
      expect(keywords.length).toBeGreaterThan(0);
      keywords.forEach(kw => expect(typeof kw).toBe('string'));
    }
  });
});

describe('ALL_KEYWORDS', () => {
  it('is a non-empty comma-separated string', () => {
    expect(typeof ALL_KEYWORDS).toBe('string');
    expect(ALL_KEYWORDS.length).toBeGreaterThan(0);
    expect(ALL_KEYWORDS).toContain(',');
  });

  it('includes keywords from every cluster', () => {
    expect(ALL_KEYWORDS).toContain('BPO');
    expect(ALL_KEYWORDS).toContain('outsourcing');
    expect(ALL_KEYWORDS).toContain('offshore');
  });
});

describe('buildOrganizationSchema', () => {
  it('returns a valid Schema.org Organization object', () => {
    const schema = buildOrganizationSchema() as Record<string, unknown>;
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('Organization');
    expect(schema['name']).toBe('TrivianEdge');
    expect(schema['url']).toBe(SEO_CONFIG.siteUrl);
  });

  it('includes a contactPoint array', () => {
    const schema = buildOrganizationSchema() as Record<string, unknown>;
    expect(Array.isArray(schema['contactPoint'])).toBe(true);
    const contacts = schema['contactPoint'] as unknown[];
    expect(contacts.length).toBeGreaterThan(0);
  });
});

describe('buildWebSiteSchema', () => {
  it('returns a valid Schema.org WebSite object', () => {
    const schema = buildWebSiteSchema() as Record<string, unknown>;
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('WebSite');
    expect(schema['url']).toBe(SEO_CONFIG.siteUrl);
  });
});
