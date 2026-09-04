export interface CaseStudy {
  client: string;
  sector: string;
  challenge: string;
  approach: string;
  team: string;
  timeline: string;
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
    challenge: 'Documentation kept piling up when the US team went offline overnight. Shipments, admin work, and execution all paused until the next shift picked it back up, so the team started every morning already behind.',
    approach: 'Built a blended, cross-timezone coverage model instead of just adding headcount: a Philippines-based specialist owns documentation continuity through the US overnight window, paired with a Canada-based operator focused on trucking-side workflows and handoffs between the two.',
    team: '2-person cross-timezone pod — 1 Philippines-based documentation specialist, 1 Canada-based operations lead.',
    timeline: 'Live within TrivianEdge\'s standard 30-day deployment window.',
    outcome: 'Overnight backlog stopped compounding into the next day, handoffs between shifts became a defined process instead of an ad hoc scramble, and daily operations became predictable enough that the team stopped starting each morning already behind.',
    highlights: ['Cross-timezone execution', 'Workflow cleanup', 'Ops-first delivery'],
  },
  {
    client: 'Keynotive',
    sector: 'Growth operations',
    challenge: 'The business needed materially more outbound throughput — cold calling, email marketing, sign-up generation — without adding local headcount, office overhead, or the management burden of building that function from scratch.',
    approach: 'Stood up two offshore teams running in parallel under one TrivianEdge operating model, so cold outbound, email marketing, and sign-up generation ran as coordinated workstreams instead of separate hires managed independently.',
    team: 'Two parallel offshore teams, each dedicated to a distinct outbound function (cold calling, and email/sign-up generation).',
    timeline: 'Live within TrivianEdge\'s standard 30-day deployment window.',
    outcome: 'Outbound activity scaled without Keynotive building an in-house management layer for it — the offshore teams ran as an embedded extension of the existing growth function rather than a separate vendor relationship to manage.',
    highlights: ['Outbound scaling', 'Parallel teams', 'Low-overhead growth'],
  },
  {
    client: 'Hub-Flx',
    sector: 'Regional expansion',
    challenge: 'The founder needed a partner who understood UAE and GCC market entry well enough to support expansion of medtech, ERP, and data-migration products without losing momentum on the products themselves.',
    approach: 'TrivianEdge supported regional expansion planning and execution — market entry logistics, positioning for the medtech, ERP, and data-migration lines, and the practical groundwork of operating in a new region — so the founder could stay focused on product rather than the operational overhead of entering a new market.',
    team: 'A dedicated TrivianEdge advisory and delivery pod supporting GCC market-entry planning and execution.',
    timeline: 'Engagement scoped and phased around the founder\'s product roadmap rather than a fixed calendar deadline.',
    outcome: 'Hub-Flx had a clearer, lower-drag path into the Middle East market — the operational groundwork for GCC entry was handled alongside the founder rather than left for them to figure out solo.',
    highlights: ['GCC expansion', 'Software rollout', 'Founder-led execution'],
  },
  {
    client: 'Capricorn College',
    sector: 'Education operations',
    challenge: 'The school\'s public website was outdated, and leadership had no reliable way to verify whether teachers were actually on campus and on time — attendance was tracked manually, with no real-time record.',
    approach: 'A full site rebuild — program information, staff directory, photo gallery — plus a secure faculty portal, delivered alongside a GPS-based attendance system that verifies teacher check-in against campus location in real time.',
    team: 'TrivianEdge software development team covering the public site rebuild, faculty portal, and GPS attendance system as one connected build.',
    timeline: 'Delivered as a single phased engagement from design through launch.',
    outcome: 'The school now runs on a modern public site and a live, verifiable record of teacher attendance in place of a manual, honor-system process — attendance is something leadership can check, not just assume.',
    highlights: ['Full site revamp', 'GPS attendance verification', 'Faculty portal'],
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
    title: 'Application security',
    points: ['Inquiry, calculator, and Venture Studio forms are submitted through a Cloudflare Worker, not directly from the browser.', 'Third-party API keys (including the one powering Aria) live only in server-side Worker secrets and are never exposed to client-side code.', 'Rate limiting is enforced per IP across every API route.', 'CORS is restricted to the production origin plus localhost for development.', 'Security headers are attached to all HTML and static asset responses, and Cloudflare sits in front of the application at the edge.'],
  },
  {
    title: 'Data handling & privacy',
    points: ['Outbound form data is HTML-escaped before email delivery to prevent injection.', 'Contact and inquiry data is used only to respond to that inquiry — it is not sold or shared with third parties.', 'Privacy and cookie policy copy is written to be PIPEDA- and GDPR-aware; read the full policy for the current scope rather than relying on marketing summaries.', 'We do not claim a formal privacy certification (e.g., a completed SOC 2 or ISO 27001 audit) because we do not currently hold one — ask us directly if your procurement process requires evidence of one.'],
  },
  {
    title: 'AI assistant (Aria) handling',
    points: ['Aria runs through a server-side Worker route — visitors never receive a direct API key.', 'Conversations are used to generate the response and route your inquiry; they are not used to train TrivianEdge products.', 'Model providers govern their own API-level data retention and training policies, which we can walk through on request for enterprise reviews.'],
  },
  {
    title: 'Employment & compliance posture',
    points: ['TrivianEdge Inc. is a federally incorporated Canadian corporation under the Canada Business Corporations Act, registered in Toronto, Ontario — that filing is public record.', 'TrivianEdge coordinates global hiring through in-country employer-of-record and payroll partners rather than claiming to be the direct legal employer in every jurisdiction — ask us for the specific structure in your target country.', 'Payroll, statutory deductions, and local employment law are administered through those partners and reviewed as part of every engagement.', 'Contracts specify IP ownership, confidentiality, and data-handling terms before any work begins.'],
  },
  {
    title: 'Operational governance',
    points: ['Requests are routed through a single API surface for easier monitoring and incident response.', 'The site is designed to keep lead capture simple, logged, and auditable rather than scattered across disconnected tools.', 'We are transparent about what is and is not yet built — see the compliance posture note above rather than a blanket claim.'],
  },
];