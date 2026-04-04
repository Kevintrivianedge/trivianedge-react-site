/**
 * TrivianEdge SEO Configuration & Schema.org Utilities
 * Centralises all SEO constants, keyword clusters, and structured-data builders.
 *
 * TARGET KEYWORDS (primary ranking goals):
 *   - BPO / Business Process Outsourcing
 *   - Outsourcing / IT Outsourcing / Talent Outsourcing
 *   - Offshore / Offshore Teams / Offshore Software Development
 *   - Software Development / Custom Software Development
 *   - Global Talent / Remote Teams / Staffing
 */

export const SEO_CONFIG = {
  siteName: 'TrivianEdge',
  siteUrl: 'https://www.trivianedge.com',
  defaultTitle: 'TrivianEdge | #1 BPO & Offshore Software Development Company | Canada',
  defaultDescription:
    'TrivianEdge is Canada\'s leading BPO and offshore outsourcing company. We deliver custom software development, IT outsourcing, global talent deployment, and managed remote teams across 6 time zones. 30-day deployment. Real results.',
  defaultKeywords:
    'BPO Canada, business process outsourcing, offshore software development, IT outsourcing, talent outsourcing, offshore development team, remote teams Canada, global staffing, managed IT services, AI staffing, custom software development, software development outsourcing, offshore BPO, outsourcing company Canada, TrivianEdge, global talent pipeline, remote workforce solutions, offshore team Philippines, software development company Canada',
  twitterHandle: '@TrivianEdge',
  defaultOgImage: 'https://www.trivianedge.com/og-image.svg',
  locale: 'en_CA',
  ogImageWidth: 1200,
  ogImageHeight: 630,
};

/** Primary keyword clusters for SEO targeting */
export const KEYWORD_CLUSTERS = {
  bpo: [
    'BPO Canada', 'business process outsourcing Canada', 'BPO company', 'offshore BPO',
    'BPO services', 'managed BPO', 'BPO outsourcing', 'BPO staffing',
  ],
  outsourcing: [
    'outsourcing company Canada', 'IT outsourcing Canada', 'talent outsourcing',
    'offshore outsourcing', 'managed outsourcing', 'outsourcing services',
    'business outsourcing', 'remote outsourcing', 'outsource software development',
  ],
  offshore: [
    'offshore development team', 'offshore software development', 'offshore team Canada',
    'offshore staffing', 'offshore IT team', 'offshore developers', 'offshore operations',
    'hire offshore team', 'build offshore team',
  ],
  softwareDev: [
    'custom software development Canada', 'software development outsourcing',
    'software development company', 'offshore software company', 'software development team',
    'dedicated development team', 'remote software developers', 'nearshore development',
  ],
  talent: [
    'global talent solutions', 'AI staffing', 'remote teams', 'global staffing company',
    'talent pipeline Canada', 'remote workforce', 'global talent acquisition',
  ],
};

/** All target keywords flattened — used for meta keywords tag */
export const ALL_KEYWORDS = Object.values(KEYWORD_CLUSTERS).flat().join(', ');

// ---------------------------------------------------------------------------
// Schema.org structured data builders
// ---------------------------------------------------------------------------

/** Schema.org Organization + contact details */
export function buildOrganizationSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SEO_CONFIG.siteUrl}/#organization`,
    name: 'TrivianEdge',
    alternateName: ['TrivianEdge Global', 'TrivianEdge BPO'],
    url: SEO_CONFIG.siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${SEO_CONFIG.siteUrl}/og-image.svg`,
      width: SEO_CONFIG.ogImageWidth,
      height: SEO_CONFIG.ogImageHeight,
    },
    image: `${SEO_CONFIG.siteUrl}/og-image.svg`,
    description: SEO_CONFIG.defaultDescription,
    foundingDate: '2023',
    numberOfEmployees: { '@type': 'QuantitativeValue', minValue: 10, maxValue: 50 },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '37 Wiggens Ct',
      addressLocality: 'Toronto',
      addressRegion: 'ON',
      postalCode: 'M1B 1K3',
      addressCountry: 'CA',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+1-888-202-8513',
        contactType: 'customer service',
        email: 'info@trivianedge.com',
        areaServed: 'Worldwide',
        availableLanguage: ['English', 'French', 'Arabic', 'Sinhala'],
      },
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: 'info@trivianedge.com',
        areaServed: 'Worldwide',
      },
    ],
    sameAs: [
      'https://www.linkedin.com/company/trivianedge/',
      'https://x.com/trivianedge',
    ],
    knowsAbout: [
      'Business Process Outsourcing', 'Offshore Software Development', 'IT Outsourcing',
      'Global Talent Acquisition', 'Remote Team Management', 'AI Staffing',
      'Managed IT Services', 'Cloud Operations',
    ],
  };
}

/** Schema.org LocalBusiness — boosts local/regional BPO searches */
export function buildLocalBusinessSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SEO_CONFIG.siteUrl}/#localbusiness`,
    name: 'TrivianEdge Global',
    description: 'Canada-based BPO and offshore software development company providing global talent, IT outsourcing, and managed services.',
    url: SEO_CONFIG.siteUrl,
    telephone: '+1-888-202-8513',
    email: 'info@trivianedge.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '37 Wiggens Ct',
      addressLocality: 'Toronto',
      addressRegion: 'ON',
      postalCode: 'M1B 1K3',
      addressCountry: 'CA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 43.7731,
      longitude: -79.2386,
    },
    areaServed: [
      { '@type': 'Country', name: 'Canada' },
      { '@type': 'Country', name: 'United States' },
      { '@type': 'Country', name: 'United Kingdom' },
      { '@type': 'Country', name: 'Australia' },
      { '@type': 'Country', name: 'United Arab Emirates' },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'BPO & Outsourcing Services',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'BPO Services' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Offshore Software Development' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'IT Outsourcing' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Global Talent Staffing' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Managed IT Services' } },
      ],
    },
    priceRange: '$$',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
  };
}

/** Schema.org WebSite with SearchAction */
export function buildWebSiteSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SEO_CONFIG.siteUrl}/#website`,
    name: SEO_CONFIG.siteName,
    url: SEO_CONFIG.siteUrl,
    description: SEO_CONFIG.defaultDescription,
    inLanguage: 'en-CA',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SEO_CONFIG.siteUrl}/?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

/** Schema.org Service — for individual service offerings */
export function buildServiceSchema(service: { name: string; description: string; keywords?: string[] }): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SEO_CONFIG.siteUrl}/#service-${service.name.toLowerCase().replace(/\s+/g, '-')}`,
    name: service.name,
    description: service.description,
    keywords: service.keywords?.join(', ') ?? KEYWORD_CLUSTERS.bpo.slice(0, 5).join(', '),
    provider: {
      '@type': 'Organization',
      '@id': `${SEO_CONFIG.siteUrl}/#organization`,
      name: 'TrivianEdge',
    },
    areaServed: 'Worldwide',
    serviceType: 'Business Process Outsourcing',
    offers: {
      '@type': 'Offer',
      description: `TrivianEdge ${service.name} — contact us for a custom quote with up to 40% cost savings.`,
      availability: 'https://schema.org/InStock',
    },
  };
}

/** Schema.org BreadcrumbList */
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

/** Schema.org Article for blog posts */
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
    keywords: SEO_CONFIG.defaultKeywords,
    author: {
      '@type': 'Person',
      name: post.author,
      worksFor: { '@type': 'Organization', name: 'TrivianEdge' },
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${SEO_CONFIG.siteUrl}/#organization`,
      name: 'TrivianEdge',
      logo: { '@type': 'ImageObject', url: `${SEO_CONFIG.siteUrl}/og-image.svg` },
    },
    datePublished: post.date,
    dateModified: post.date,
    url: post.url,
    image: post.imageUrl ?? SEO_CONFIG.defaultOgImage,
    mainEntityOfPage: { '@type': 'WebPage', '@id': post.url },
    about: [
      { '@type': 'Thing', name: 'Business Process Outsourcing' },
      { '@type': 'Thing', name: 'Offshore Software Development' },
      { '@type': 'Thing', name: 'Global Talent' },
    ],
  };
}

/** BPO-focused FAQ schema — helps rank in Google featured snippets */
export function buildBPOFAQSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is BPO (Business Process Outsourcing)?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Business Process Outsourcing (BPO) is the practice of contracting specific business functions to a third-party provider. TrivianEdge offers comprehensive BPO services including offshore software development, IT outsourcing, customer support, finance & accounting, and back-office operations — all managed from Canada with teams across 6 global time zones.',
        },
      },
      {
        '@type': 'Question',
        name: 'Why choose TrivianEdge for offshore software development?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'TrivianEdge is a Canada-based BPO and offshore development company specialising in 30-day talent deployment. We source elite software developers, DevOps engineers, and AI specialists from our global talent hubs in the Philippines, Sri Lanka, Vietnam, Turkey, and Eastern Europe — delivering up to 40% cost savings compared to local hiring.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does TrivianEdge\'s outsourcing model work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our outsourcing model follows a 4-step process: (1) Discovery & Blueprint — we analyse your operational needs; (2) AI-Powered Sourcing — we find the perfect match from our global talent hubs; (3) Deployment & Sync — rapid onboarding within 30 days; (4) Continuous Evolution — ongoing performance management and scaling.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the difference between BPO and offshore outsourcing?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'BPO (Business Process Outsourcing) refers to delegating entire business functions (HR, accounting, customer service) to an external company. Offshore outsourcing specifically means those teams are in another country. TrivianEdge offers both — from offshore software development teams in the Philippines to complete BPO operations managed from Canada.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much can I save with TrivianEdge\'s offshore team?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Companies typically save 40-60% on talent costs by partnering with TrivianEdge for offshore staffing and BPO services. Our global talent hubs provide access to highly skilled professionals at a fraction of North American or Western European rates, without sacrificing quality or operational oversight.',
        },
      },
      {
        '@type': 'Question',
        name: 'What software development services does TrivianEdge outsource?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'TrivianEdge provides offshore software development outsourcing for full-stack development, AI/ML engineering, cloud & DevOps, mobile app development, UI/UX design, cybersecurity, and data engineering. We build dedicated offshore development teams tailored to your technology stack and operational requirements.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is TrivianEdge a Canadian BPO company?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. TrivianEdge is headquartered in Toronto, Canada and operates as a Canada-based global BPO and outsourcing company. We manage offshore talent deployment, IT outsourcing, and managed services for clients across North America, the UK, Australia, and the Middle East.',
        },
      },
    ],
  };
}

/** Schema.org FAQPage — generic */
export function buildFAQSchema(faqs: { question: string; answer: string }[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

/** Schema.org SoftwareApplication for Trivian Aria */
export function buildSoftwareApplicationSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Trivian Aria',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: "TrivianEdge's AI-powered HRIS platform — automating HR, payroll, leave management, recruitment pipeline, and workforce analytics in one unified platform.",
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free for up to 10 employees during early access',
    },
    provider: {
      '@type': 'Organization',
      '@id': `${SEO_CONFIG.siteUrl}/#organization`,
      name: 'TrivianEdge',
    },
    featureList: [
      'AI-powered HR management', 'Automated payroll processing',
      'Leave management', 'Kanban recruitment pipeline',
      'Real-time analytics dashboard', 'Built-in AI assistant',
    ],
  };
}

/** Schema.org WebPage — for informational/legal pages */
export function buildWebPageSchema(page: {
  name: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  breadcrumb?: { name: string; url: string }[];
}): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${page.url}#webpage`,
    name: page.name,
    description: page.description,
    url: page.url,
    inLanguage: 'en-CA',
    isPartOf: { '@type': 'WebSite', '@id': `${SEO_CONFIG.siteUrl}/#website` },
    about: { '@type': 'Organization', '@id': `${SEO_CONFIG.siteUrl}/#organization` },
    datePublished: page.datePublished,
    dateModified: page.dateModified,
    breadcrumb: page.breadcrumb
      ? buildBreadcrumbSchema(page.breadcrumb)
      : undefined,
  };
}

/** Schema.org ItemList — service catalogue for rich results */
export function buildServiceItemListSchema(): object {
  const services = [
    {
      name: 'BPO & Business Process Outsourcing',
      description: 'Canada-based BPO services: offshore software development, IT outsourcing, talent staffing, and managed remote operations across 6 time zones.',
      url: `${SEO_CONFIG.siteUrl}/#services`,
    },
    {
      name: 'Offshore Software Development',
      description: 'Dedicated offshore development teams sourced from elite global talent hubs — Philippines, Sri Lanka, Vietnam, Turkey, and Eastern Europe.',
      url: `${SEO_CONFIG.siteUrl}/#services`,
    },
    {
      name: 'Global Talent & IT Outsourcing',
      description: 'AI-powered global talent acquisition and IT outsourcing for startups and enterprises. 30-day deployment, up to 40% cost savings.',
      url: `${SEO_CONFIG.siteUrl}/#services`,
    },
    {
      name: 'Trivian Aria — AI-Powered HRIS',
      description: "TrivianEdge's AI-powered HRIS platform automating HR, payroll, leave management, and workforce analytics.",
      url: `${SEO_CONFIG.siteUrl}/#aria`,
    },
    {
      name: 'Managed IT Services',
      description: 'Enterprise-grade cloud infrastructure management, cybersecurity compliance support (SOC 2, ISO 27001), and distributed operations.',
      url: `${SEO_CONFIG.siteUrl}/#services`,
    },
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'TrivianEdge BPO & Outsourcing Services',
    description: 'Complete catalogue of TrivianEdge global BPO, offshore software development, and IT outsourcing services.',
    url: `${SEO_CONFIG.siteUrl}/#services`,
    numberOfItems: services.length,
    itemListElement: services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: service.name,
      description: service.description,
      url: service.url,
      item: {
        '@type': 'Service',
        name: service.name,
        description: service.description,
        provider: {
          '@type': 'Organization',
          '@id': `${SEO_CONFIG.siteUrl}/#organization`,
          name: 'TrivianEdge',
        },
        areaServed: 'Worldwide',
      },
    })),
  };
}
