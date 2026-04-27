import { describe, it, expect } from 'vitest';
import {
  SEO_CONFIG,
  KEYWORD_CLUSTERS,
  ALL_KEYWORDS,
  buildOrganizationSchema,
  buildWebSiteSchema,
  organizationSchema,
  websiteSchema,
  serviceSchema,
  faqSchema,
  breadcrumbSchema,
  articleSchema,
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

describe('organizationSchema', () => {
  it('returns object with @type === "Organization"', () => {
    const schema = organizationSchema();
    expect(schema['@type']).toBe('Organization');
  });

  it('includes name "TrivianEdge"', () => {
    const schema = organizationSchema();
    expect(schema['name']).toBe('TrivianEdge');
  });

  it('includes all four areaServed values', () => {
    const schema = organizationSchema();
    const areaServed = schema['areaServed'] as string[];
    expect(areaServed).toContain('Canada');
    expect(areaServed).toContain('United States');
    expect(areaServed).toContain('United Kingdom');
    expect(areaServed).toContain('Australia');
  });

  it('includes sameAs array with LinkedIn and Clutch URLs', () => {
    const schema = organizationSchema();
    const sameAs = schema['sameAs'] as string[];
    expect(Array.isArray(sameAs)).toBe(true);
    expect(sameAs.some(url => url.includes('linkedin.com'))).toBe(true);
    expect(sameAs.some(url => url.includes('clutch.co'))).toBe(true);
  });

  it('includes knowsAbout array with all five service categories', () => {
    const schema = organizationSchema();
    const knowsAbout = schema['knowsAbout'] as string[];
    expect(Array.isArray(knowsAbout)).toBe(true);
    expect(knowsAbout).toContain('Business Process Outsourcing');
    expect(knowsAbout).toContain('Recruitment Process Outsourcing');
    expect(knowsAbout).toContain('AI Development Services');
    expect(knowsAbout).toContain('Offshore Software Development');
    expect(knowsAbout).toContain('IT Outsourcing');
  });
});

describe('websiteSchema', () => {
  it('returns object with @type === "WebSite"', () => {
    const schema = websiteSchema();
    expect(schema['@type']).toBe('WebSite');
  });

  it('includes potentialAction with @type SearchAction', () => {
    const schema = websiteSchema();
    const action = schema['potentialAction'] as Record<string, unknown>;
    expect(action['@type']).toBe('SearchAction');
  });

  it('url equals "https://www.trivianedge.com"', () => {
    const schema = websiteSchema();
    expect(schema['url']).toBe('https://www.trivianedge.com');
  });
});

describe('serviceSchema', () => {
  const name = 'BPO Services';
  const serviceType = 'Business Process Outsourcing';
  const url = 'https://www.trivianedge.com/services/bpo';
  let schema: Record<string, unknown>;

  it('returns object with @type === "Service"', () => {
    schema = serviceSchema(name, serviceType, url);
    expect(schema['@type']).toBe('Service');
  });

  it('name, serviceType, url match the passed arguments', () => {
    schema = serviceSchema(name, serviceType, url);
    expect(schema['name']).toBe(name);
    expect(schema['serviceType']).toBe(serviceType);
    expect(schema['url']).toBe(url);
  });

  it('provider.name equals "TrivianEdge"', () => {
    schema = serviceSchema(name, serviceType, url);
    const provider = schema['provider'] as Record<string, unknown>;
    expect(provider['name']).toBe('TrivianEdge');
  });

  it('areaServed equals "Canada"', () => {
    schema = serviceSchema(name, serviceType, url);
    expect(schema['areaServed']).toBe('Canada');
  });
});

describe('faqSchema', () => {
  const faqs = [
    { question: 'What is BPO?', answer: 'Business Process Outsourcing.' },
    { question: 'How fast?', answer: 'Within 30 days.' },
  ];

  it('returns object with @type === "FAQPage"', () => {
    const schema = faqSchema(faqs);
    expect(schema['@type']).toBe('FAQPage');
  });

  it('mainEntity length matches input array length', () => {
    const schema = faqSchema(faqs);
    const mainEntity = schema['mainEntity'] as unknown[];
    expect(mainEntity.length).toBe(faqs.length);
  });

  it('each mainEntity item has @type "Question" and acceptedAnswer.@type "Answer"', () => {
    const schema = faqSchema(faqs);
    const mainEntity = schema['mainEntity'] as Record<string, unknown>[];
    mainEntity.forEach(item => {
      expect(item['@type']).toBe('Question');
      const acceptedAnswer = item['acceptedAnswer'] as Record<string, unknown>;
      expect(acceptedAnswer['@type']).toBe('Answer');
    });
  });

  it('acceptedAnswer.text matches the input answer string', () => {
    const schema = faqSchema(faqs);
    const mainEntity = schema['mainEntity'] as Record<string, unknown>[];
    mainEntity.forEach((item, i) => {
      const acceptedAnswer = item['acceptedAnswer'] as Record<string, unknown>;
      expect(acceptedAnswer['text']).toBe(faqs[i].answer);
    });
  });
});

describe('breadcrumbSchema', () => {
  const items = [
    { name: 'Home', url: 'https://www.trivianedge.com' },
    { name: 'Services', url: 'https://www.trivianedge.com/services' },
    { name: 'BPO', url: 'https://www.trivianedge.com/services/bpo' },
  ];

  it('returns object with @type === "BreadcrumbList"', () => {
    const schema = breadcrumbSchema(items);
    expect(schema['@type']).toBe('BreadcrumbList');
  });

  it('itemListElement length matches input array length', () => {
    const schema = breadcrumbSchema(items);
    const list = schema['itemListElement'] as unknown[];
    expect(list.length).toBe(items.length);
  });

  it('first item has position 1', () => {
    const schema = breadcrumbSchema(items);
    const list = schema['itemListElement'] as Record<string, unknown>[];
    expect(list[0]['position']).toBe(1);
  });

  it('each item name and url match the input', () => {
    const schema = breadcrumbSchema(items);
    const list = schema['itemListElement'] as Record<string, unknown>[];
    list.forEach((el, i) => {
      expect(el['name']).toBe(items[i].name);
      expect(el['item']).toBe(items[i].url);
    });
  });
});

describe('articleSchema', () => {
  const params = {
    title: 'TrivianEdge BPO Guide',
    description: 'A guide to BPO.',
    url: 'https://www.trivianedge.com/blog/bpo-guide',
    datePublished: '2024-01-01',
    dateModified: '2024-06-01',
    image: 'https://www.trivianedge.com/og-image.svg',
  };

  it('returns object with @type === "Article"', () => {
    const schema = articleSchema(params);
    expect(schema['@type']).toBe('Article');
  });

  it('headline matches title param', () => {
    const schema = articleSchema(params);
    expect(schema['headline']).toBe(params.title);
  });

  it('author.@type equals "Organization"', () => {
    const schema = articleSchema(params);
    const author = schema['author'] as Record<string, unknown>;
    expect(author['@type']).toBe('Organization');
  });

  it('publisher.name equals "TrivianEdge"', () => {
    const schema = articleSchema(params);
    const publisher = schema['publisher'] as Record<string, unknown>;
    expect(publisher['name']).toBe('TrivianEdge');
  });

  it('datePublished and dateModified match params', () => {
    const schema = articleSchema(params);
    expect(schema['datePublished']).toBe(params.datePublished);
    expect(schema['dateModified']).toBe(params.dateModified);
  });
});
