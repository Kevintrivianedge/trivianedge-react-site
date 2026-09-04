
import React from 'react';

// Existing Interfaces
export interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  tags: string[];
  features: string[];
  outcomes: string[];
}

export interface TalentHub {
  id: string;
  country: string;
  flag: string;
  flagCode: string;
  specialty: string;
  description: string;
  infrastructure: string;
  communication: string;
  gradient: string;
  // New fields for detailed view
  keyCities: string[];
  educationFocus: string;
  timeZoneAlignment: string;
  popularTech: string[];
}

export interface RoleCategory {
  title: string;
  roles: string[];
  gradient: string;
}

export interface Step {
  number: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export interface WhyUsItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  url?: string;
  result?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  imageGradient: string;
  // SEO fields
  slug?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  datePublished?: string;
  dateModified?: string;
  authorTwitter?: string;
  imageUrl?: string;
}

// New Greeting & Geo Interfaces
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export interface GeoLocationData {
  country_code: string;
  country_name: string;
  timezone: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

export interface GreetingState {
  greeting: string;
  subtext: string;
  isRTL: boolean;
  isLoading: boolean;
  error: boolean;
}

export type SupportedCountry = 'FR' | 'ES' | 'MX' | 'AE' | 'SA' | 'LK' | 'US' | 'GB' | 'DEFAULT';

export type SupportedLanguage = 'fr' | 'es' | 'ar' | 'si' | 'en';

// ---------------------------------------------------------------------------
// P2 growth content: comparison pages, industry pages, service+country combos
// ---------------------------------------------------------------------------

export interface ComparisonOption {
  name: string;
  summary: string;
  goodFor: string[];
  tradeoffs: string[];
}

export interface ComparisonRow {
  factor: string;
  a: string;
  b: string;
}

export interface ComparisonPageData {
  slug: string;
  title: string;
  subtitle: string;
  optionA: ComparisonOption;
  optionB: ComparisonOption;
  rows: ComparisonRow[];
  verdict: string;
  faqs: { question: string; answer: string }[];
  relatedServiceHref: string;
  relatedServiceName: string;
}

export interface IndustryPageData {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  challenges: string[];
  howWeHelp: { service: string; description: string; href: string }[];
  relatedCaseStudyClient?: string;
  commonRoles: string[];
  faqs: { question: string; answer: string }[];
}

export interface ServiceCountryCombo {
  service: 'bpo' | 'rpo' | 'ai-development' | 'it-outsourcing';
  serviceName: string;
  serviceHref: string;
  countrySlug: string;
  hubId: string;
  angle: string;
  typicalRoles: string[];
  faqs: { question: string; answer: string }[];
}
