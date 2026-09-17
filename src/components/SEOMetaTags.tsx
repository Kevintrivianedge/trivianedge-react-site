import { Helmet } from 'react-helmet-async';

interface SEOMetaTagsProps {
  title: string;
  description: string;
  canonical?: string;
  ogType?: 'website' | 'article' | 'product';
  ogImage?: string;
  ogImageAlt?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterCreator?: string;
  structuredData?: Record<string, any>;
  robots?: string;
  noindex?: boolean;
}

export const SEOMetaTags: React.FC<SEOMetaTagsProps> = ({
  title,
  description,
  canonical,
  ogType = 'website',
  ogImage,
  ogImageAlt,
  ogImageWidth = 1200,
  ogImageHeight = 630,
  twitterCard = 'summary_large_image',
  twitterCreator,
  structuredData,
  robots = 'index, follow',
  noindex = false,
}) => {
  const fullTitle = title.includes('TrivianEdge') ? title : `${title} | TrivianEdge`;
  const siteUrl = 'https://www.trivianedge.com';
  const canonicalUrl = canonical || (typeof window !== 'undefined' ? window.location.href : siteUrl);
  const ogImageUrl = ogImage || `${siteUrl}/og-image.png`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : robots} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="utf-8" />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:alt" content={ogImageAlt || description} />
      <meta property="og:image:width" content={String(ogImageWidth)} />
      <meta property="og:image:height" content={String(ogImageHeight)} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="TrivianEdge" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />
      <meta name="twitter:image:alt" content={ogImageAlt || description} />
      {twitterCreator && <meta name="twitter:creator" content={twitterCreator} />}

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#00C49A" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="TrivianEdge" />

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

// Organization Schema
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'TrivianEdge',
  url: 'https://www.trivianedge.com',
  logo: 'https://www.trivianedge.com/logo.png',
  description: "Canada's #1 BPO & offshore software development platform",
  sameAs: [
    'https://www.linkedin.com/company/trivianedge',
    'https://twitter.com/trivianedge',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    email: 'hello@trivianedge.com',
  },
};

// Service Schema
export const createServiceSchema = (
  serviceName: string,
  description: string,
  image?: string
) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: serviceName,
  description: description,
  image: image || 'https://www.trivianedge.com/service-image.png',
  provider: {
    '@type': 'Organization',
    name: 'TrivianEdge',
    url: 'https://www.trivianedge.com',
  },
  areaServed: ['CA', 'US', 'GB', 'AU'],
  offers: {
    '@type': 'Offer',
    availability: 'https://schema.org/InStock',
  },
});

// Article Schema
export const createArticleSchema = (
  title: string,
  description: string,
  image: string,
  publishedDate: string,
  authorName?: string
) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: title,
  description: description,
  image: image,
  datePublished: publishedDate,
  author: {
    '@type': 'Organization',
    name: authorName || 'TrivianEdge',
  },
  publisher: {
    '@type': 'Organization',
    name: 'TrivianEdge',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.trivianedge.com/logo.png',
    },
  },
});
