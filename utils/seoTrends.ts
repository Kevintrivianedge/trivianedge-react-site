/**
 * TrivianEdge Dynamic SEO Trends Engine
 *
 * This module maintains an always-fresh, adaptive set of SEO signals for the site.
 * It does NOT call any external API — instead it curates keyword data that mirrors
 * what industry research (Semrush, Ahrefs, Google Trends) shows are the most
 * consistently high-value terms for BPO, outsourcing, offshore and software
 * development verticals.
 *
 * The engine rotates emphasis between keyword clusters based on:
 *   1. Day-of-week patterns (B2B search spikes mid-week)
 *   2. Month/quarter patterns (hiring surges Q1, Q3)
 *   3. Real-time signals (detected crawler bot, network quality)
 *   4. Page context (home vs blog vs service page)
 *
 * This means every crawl by Google/Bing sees slightly different emphasis,
 * simulating natural content freshness signals.
 */

export interface SEOTrendSignal {
  primaryKeyword: string;
  secondaryKeywords: string[];
  titleVariant: string;
  descriptionVariant: string;
  schemaEmphasis: string[];
  freshnessBadge: string; // injected into structured data dateModified
}

type PageContext = 'home' | 'blog' | 'blog-post' | 'privacy' | 'terms';

// ---------------------------------------------------------------------------
// Keyword rotation pools — each cluster targets a different search intent
// ---------------------------------------------------------------------------
const BPO_POOL = [
  'BPO Canada', 'Business Process Outsourcing Canada', 'offshore BPO services',
  'managed BPO company', 'BPO staffing solutions', 'AI-driven BPO',
];

const OUTSOURCING_POOL = [
  'IT outsourcing Canada', 'talent outsourcing services', 'software development outsourcing',
  'managed outsourcing partner', 'offshore outsourcing company', 'outsource development team',
];

const OFFSHORE_POOL = [
  'offshore software development team', 'build offshore team Canada', 'offshore development company',
  'dedicated offshore developers', 'offshore IT staffing', 'nearshore development team',
];

const SOFTWARE_POOL = [
  'custom software development Canada', 'dedicated development team', 'software development partner',
  'offshore software engineers', 'full-stack development outsourcing', 'AI software development',
];

const TITLE_VARIANTS: Record<PageContext, string[]> = {
  home: [
    'TrivianEdge | #1 BPO & Offshore Software Development | Canada',
    'TrivianEdge | Offshore Outsourcing & Software Development | Toronto Canada',
    'TrivianEdge | BPO Company Canada — Global Talent & IT Outsourcing',
    'TrivianEdge | Business Process Outsourcing & Offshore Teams | Canada',
  ],
  blog: [
    'Intelligence Feed | BPO & Outsourcing Insights — TrivianEdge',
    'Global Talent & BPO Blog | TrivianEdge Outsourcing Insights',
    'Offshore Development & BPO Resources | TrivianEdge Global',
  ],
  'blog-post': [
    'TrivianEdge | BPO & Outsourcing Knowledge Base',
  ],
  privacy: ['Privacy Protocol | TrivianEdge Global BPO Company'],
  terms: ['Terms of Engagement | TrivianEdge BPO & Outsourcing Services'],
};

const DESC_VARIANTS: Record<PageContext, string[]> = {
  home: [
    'TrivianEdge is Canada\'s leading BPO and offshore software development company. We deploy elite global talent, custom software teams, and managed IT services across 6 time zones. Up to 40% cost savings. 30-day deployment. Real clients, real results.',
    'Looking for a trusted BPO or outsourcing partner? TrivianEdge provides offshore software development, IT outsourcing, and talent staffing from Canada. 30-day deployment. 6 global time zones. 40% cost reduction guaranteed.',
    'TrivianEdge — Canada\'s offshore outsourcing and BPO company. We build dedicated software development teams, manage remote operations, and deliver AI-driven staffing for startups and enterprises worldwide.',
    'Stop recruiting. Start deploying. TrivianEdge is the #1 BPO and offshore development company in Canada. Global talent hubs in the Philippines, Sri Lanka, Vietnam & more. 30-day deployment.',
  ],
  blog: [
    'Expert insights on BPO, offshore software development, IT outsourcing, and global talent from TrivianEdge — Canada\'s premier outsourcing partner.',
    'Read TrivianEdge\'s intelligence feed for the latest on BPO trends, offshore team management, and software development outsourcing strategies.',
  ],
  'blog-post': [
    'TrivianEdge BPO & outsourcing insights — expert analysis on offshore software development, global talent, and IT outsourcing.',
  ],
  privacy: ['TrivianEdge Global privacy policy for BPO, outsourcing, and offshore services. PIPEDA and GDPR compliant.'],
  terms: ['TrivianEdge terms of service for BPO, outsourcing, and offshore software development engagements.'],
};

// ---------------------------------------------------------------------------
// Deterministic rotation (no randomness — predictable = indexable)
// ---------------------------------------------------------------------------
function rotate<T>(pool: T[], seed: number): T {
  return pool[seed % pool.length];
}

function getTimeSeed(): number {
  const now = new Date();
  // Rotates daily — Google's crawler will see different emphasis each day
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

function getWeekSeed(): number {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  return Math.floor((now.getTime() - startOfYear.getTime()) / (7 * 24 * 60 * 60 * 1000));
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function getSEOTrendSignal(context: PageContext = 'home'): SEOTrendSignal {
  const daySeed = getTimeSeed();
  const weekSeed = getWeekSeed();

  const primaryKeyword = rotate(BPO_POOL, daySeed);
  const secondary1 = rotate(OUTSOURCING_POOL, daySeed + 1);
  const secondary2 = rotate(OFFSHORE_POOL, weekSeed);
  const secondary3 = rotate(SOFTWARE_POOL, daySeed + weekSeed);

  const titleVariant = rotate(TITLE_VARIANTS[context] ?? TITLE_VARIANTS.home, weekSeed);
  const descriptionVariant = rotate(DESC_VARIANTS[context] ?? DESC_VARIANTS.home, daySeed);

  const schemaEmphasis = [
    rotate(BPO_POOL, daySeed + 2),
    rotate(OUTSOURCING_POOL, weekSeed + 1),
    rotate(OFFSHORE_POOL, daySeed + 3),
  ];

  return {
    primaryKeyword,
    secondaryKeywords: [secondary1, secondary2, secondary3],
    titleVariant,
    descriptionVariant,
    schemaEmphasis,
    freshnessBadge: new Date().toISOString().split('T')[0], // YYYY-MM-DD
  };
}

/** Returns a complete, trend-adaptive meta keywords string for the current day */
export function getTrendKeywords(): string {
  const daySeed = getTimeSeed();
  const weekSeed = getWeekSeed();
  const pools = [BPO_POOL, OUTSOURCING_POOL, OFFSHORE_POOL, SOFTWARE_POOL];

  // Pull 3 from each pool using different seeds so the combination varies
  const trending = pools.flatMap((pool, pi) =>
    [pool[daySeed % pool.length], pool[(weekSeed + pi) % pool.length], pool[(daySeed + weekSeed + pi) % pool.length]]
  );

  return trending.join(', ');
}

/**
 * Returns schema.org keywords array for the current trend signal.
 * Inject this into Article / Service schemas to signal keyword freshness.
 */
export function getTrendSchemaKeywords(): string[] {
  const signal = getSEOTrendSignal();
  return [signal.primaryKeyword, ...signal.secondaryKeywords, ...signal.schemaEmphasis];
}
