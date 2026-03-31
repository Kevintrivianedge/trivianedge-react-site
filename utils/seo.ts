/**
 * TrivianEdge SEO Configuration & Schema.org Utilities
 * Centralizes all SEO constants and structured data builders.
 */

export const SEO_CONFIG = {
  siteName: 'TrivianEdge',
  siteUrl: 'https://www.trivianedge.com',
  defaultTitle: 'TrivianEdge | AI-Driven Global Talent & Software Solutions',
  defaultDescription:
    'TrivianEdge bridges the gap between AI, Operations, and global talent. We empower startups and enterprises to scale without friction using elite global talent pipelines and AI-driven operational software.',
  defaultKeywords:
    'global talent, AI staffing, remote teams, operational excellence, talent pipeline, Canada, TrivianEdge, remote workforce, AI automation, managed IT services',
  twitterHandle: '@TrivianEdge',
  defaultOgImage: 'https://www.trivianedge.com/og-image.jpg',
  locale: 'en_CA',
  ogImageWidth: 1200,
  ogImageHeight: 630,
};

/** Schema.org Organization structured data */
export function buildOrganizationSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'TrivianEdge',
    url: SEO_CONFIG.siteUrl,
    logo: `${SEO_CONFIG.siteUrl}/og-image.jpg`,
    description: SEO_CONFIG.defaultDescription,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '37 Wiggens Ct',
      addressLocality: 'Toronto',
      addressRegion: 'ON',
      postalCode: 'M1B 1K3',
      addressCountry: 'CA',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-888-202-8513',
      contactType: 'customer service',
      email: 'info@trivianedge.com',
    },
    sameAs: ['https://www.linkedin.com/company/trivianedge/'],
  };
}

/** Schema.org WebSite structured data with SearchAction */
export function buildWebSiteSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SEO_CONFIG.siteName,
    url: SEO_CONFIG.siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SEO_CONFIG.siteUrl}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/** Schema.org Service structured data */
export function buildServiceSchema(service: { name: string; description: string }): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: 'TrivianEdge',
      url: SEO_CONFIG.siteUrl,
    },
    areaServed: 'Worldwide',
  };
}

/** Schema.org BreadcrumbList structured data */
export function buildBreadcrumbSchema(items: { name: string; url: string }[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Schema.org Article structured data */
export function buildArticleSchema(post: {
  title: string;
  description: string;
  author: string;
  date: string;
  url: string;
  imageUrl?: string;
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'TrivianEdge',
      logo: {
        '@type': 'ImageObject',
        url: `${SEO_CONFIG.siteUrl}/og-image.jpg`,
      },
    },
    datePublished: post.date,
    dateModified: post.date,
    url: post.url,
    image: post.imageUrl ?? SEO_CONFIG.defaultOgImage,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': post.url,
    },
  };
}

/** Schema.org FAQPage structured data */
export function buildFAQSchema(faqs: { question: string; answer: string }[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/** Schema.org SoftwareApplication structured data */
export function buildSoftwareApplicationSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Trivian Aria',
    applicationCategory: 'BusinessApplication',
    description:
      "TrivianEdge's proprietary AI-powered HRIS platform — automating HR, payroll, leave, recruitment, and analytics in one unified platform.",
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free for up to 10 employees during early access',
    },
    provider: {
      '@type': 'Organization',
      name: 'TrivianEdge',
      url: SEO_CONFIG.siteUrl,
    },
  };
}
