import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { SEO_CONFIG, SEOConfig, SchemaObject } from '../utils/seo';

export interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | string;
  twitterCard?: string;
  noIndex?: boolean;
  /** Legacy structured-data prop — accepts any object or array of objects */
  structuredData?: object | object[];
  /** Schema.org JSON-LD objects supplied via SEOConfig.schema */
  schema?: SchemaObject | SchemaObject[];
}

// SEOHeadProps is a superset of SEOConfig, so a SEOConfig object can be spread directly.
const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description = SEO_CONFIG.defaultDescription,
  keywords = SEO_CONFIG.defaultKeywords,
  canonical,
  ogImage = SEO_CONFIG.defaultOgImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  noIndex = false,
  structuredData,
  schema,
}) => {
  const location = useLocation();
  const pageTitle = title ? `${title} | ${SEO_CONFIG.siteName}` : SEO_CONFIG.defaultTitle;
  const canonicalUrl =
    canonical ?? `${SEO_CONFIG.siteUrl}${location.pathname}`;
  const robotsContent = noIndex
    ? 'noindex, nofollow'
    : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';

  // Merge legacy structuredData and new schema into one list
  const legacyScripts: object[] = structuredData
    ? (Array.isArray(structuredData) ? structuredData : [structuredData])
    : [];
  const schemaItems: SchemaObject[] = schema
    ? (Array.isArray(schema) ? schema : [schema])
    : [];
  const schemaScripts: object[] = [...legacyScripts, ...schemaItems];

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Robots directives */}
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />

      {/* Open Graph */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content={String(SEO_CONFIG.ogImageWidth)} />
      <meta property="og:image:height" content={String(SEO_CONFIG.ogImageHeight)} />
      <meta property="og:site_name" content={SEO_CONFIG.siteName} />
      <meta property="og:locale" content={SEO_CONFIG.locale} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content={SEO_CONFIG.twitterHandle} />
      <meta name="twitter:creator" content={SEO_CONFIG.twitterHandle} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD Structured Data */}
      {schemaScripts.map((item, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(item, null, 2)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEOHead;
