export interface CaseStudy {
  client: string;
  sector: string;
  challenge: string;
  approach: string;
  outcome: string;
  highlights: string[];
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

export interface TrustPillar {
  title: string;
  points: string[];
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    client: 'Cargo Login',
    sector: 'Logistics operations',
    challenge: 'Documentation kept piling up when the US team went offline, creating friction between shipments, admin work, and execution.',
    approach: 'Built a blended coverage model with Philippines-based execution plus a Canadian operator focused on trucking workflows and handoffs.',
    outcome: 'The team stopped losing time to overnight backlog and kept shipping work moving across time zones.',
    highlights: ['Cross-timezone execution', 'Workflow cleanup', 'Ops-first delivery'],
  },
  {
    client: 'Keynotive',
    sector: 'Growth operations',
    challenge: 'The business needed more outbound throughput without adding local overhead or slowing the team down.',
    approach: 'Ran two offshore teams in parallel across cold calling, email marketing, and sign-up generation under one operating model.',
    outcome: 'Parallel teams produced more outbound activity and cleaner execution without the cost of a full in-house expansion.',
    highlights: ['Outbound scaling', 'Parallel teams', 'Low-overhead growth'],
  },
  {
    client: 'Hub-Flx',
    sector: 'Regional expansion',
    challenge: 'The founder needed a partner who could help take software products into UAE and GCC markets without losing momentum.',
    approach: 'Supported regional expansion planning around medtech, ERP, and data migration products with a practical execution model.',
    outcome: 'The partnership gave the team a clearer path into the Middle East market with less operational drag.',
    highlights: ['GCC expansion', 'Software rollout', 'Founder-led execution'],
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: 'TrivianEdge acted like an operating partner. They did not just suggest a plan, they helped clear the backlog and keep work moving when the team needed coverage most.',
    author: 'Founder',
    role: 'Cargo Login',
  },
  {
    quote: 'The best part was the speed. We got a structured offshore model without having to build the management layer from scratch.',
    author: 'Operations Lead',
    role: 'Keynotive',
  },
];

export const TRUST_PILLARS: TrustPillar[] = [
  {
    title: 'Data handling',
    points: ['Inquiry forms are submitted through the Cloudflare Worker, not the browser.', 'AI API keys are never exposed to client-side code.', 'Outbound form data is HTML-escaped before email delivery.'],
  },
  {
    title: 'Security controls',
    points: ['Rate limiting is enabled per IP across API routes.', 'CORS is restricted to the production origin plus localhost for development.', 'Security headers are attached to all static asset responses.'],
  },
  {
    title: 'Operational governance',
    points: ['Cloudflare sits in front of the application and static assets.', 'Requests are routed through a single API surface for easier monitoring.', 'The site is designed to keep lead capture simple and auditable.'],
  },
  {
    title: 'Compliance posture',
    points: ['Privacy copy references PIPEDA and GDPR-aware handling.', 'The product avoids making unsupported certification claims.', 'Contact requests are only used to respond to the inquiry.'],
  },
];