import { IndustryPageData } from '../types';

export const INDUSTRIES: IndustryPageData[] = [
  {
    slug: 'logistics',
    name: 'Logistics & Supply Chain',
    metaTitle: 'Logistics & Supply Chain Outsourcing | TrivianEdge',
    tagline: 'Coverage that follows the freight, not the office hours.',
    description: 'Logistics does not stop when your local team logs off. Documentation, dispatch, and exception handling keep moving overnight, and the businesses that handle that well are the ones that built cross-timezone coverage on purpose instead of hiring more people in the same timezone and hoping for the best.',
    challenges: [
      'Work queues up overnight when the home-market team goes offline',
      'Documentation and compliance paperwork falls behind shipment volume',
      'Dispatch, tracking, and exception handling need coverage across time zones, not just extra headcount in one office',
      'Scaling ops headcount up and down with freight volume without a fixed local payroll commitment',
    ],
    howWeHelp: [
      { service: 'BPO', description: 'Blended, cross-timezone operations teams that own documentation, dispatch support, and back-office workflows around the clock.', href: '/services/bpo' },
      { service: 'RPO', description: 'Hire dedicated logistics coordinators and ops leads directly onto your team when a function needs to be a permanent hire, not an outsourced one.', href: '/services/rpo' },
      { service: 'IT Outsourcing', description: 'Custom dispatch, tracking, or EDI integration tooling built by an offshore engineering team that understands logistics workflows.', href: '/services/it-outsourcing' },
    ],
    relatedCaseStudyClient: 'Cargo Login',
    commonRoles: ['Documentation & compliance specialists', 'Dispatch coordinators', 'Trucking operations leads', 'Customer support for shipment tracking', 'Data entry & EDI processing'],
    faqs: [
      { question: 'Can TrivianEdge cover overnight logistics operations?', answer: 'Yes — this is one of our most common logistics engagements. We build blended coverage models, typically pairing an offshore specialist for overnight continuity with a home-market operator for handoffs, so work keeps moving instead of queuing up until the next shift.' },
      { question: 'Do you have experience with logistics-specific workflows?', answer: 'Yes. Our Cargo Login engagement involved documentation continuity and trucking-side workflow ownership across a cross-timezone team — see the full case study for what that looked like in practice.' },
      { question: 'Can you build custom logistics software, not just staff a team?', answer: 'Yes. Our IT outsourcing and bespoke software team builds dispatch, tracking, and integration tooling alongside the operations team, so the process and the software supporting it are built by people who understand both.' },
    ],
  },
  {
    slug: 'saas-growth',
    name: 'SaaS & Growth-Stage Companies',
    metaTitle: 'SaaS & Growth-Stage Outsourcing Teams | TrivianEdge',
    tagline: 'Outbound throughput without building a management layer first.',
    description: 'Growth-stage companies need more pipeline activity than their current team can generate, but hiring and managing a full outbound function in-house is slow and expensive before you know which motions actually work. Offshore growth teams let you scale outbound activity without committing to that overhead upfront.',
    challenges: [
      'Outbound volume needs to scale faster than local hiring allows',
      'Building an in-house SDR/growth management layer is expensive before the playbook is proven',
      'Multiple outbound motions (cold calling, email, sign-up generation) need to run in parallel without fragmenting ownership',
      'Engineering capacity is stretched between product work and internal tooling',
    ],
    howWeHelp: [
      { service: 'BPO', description: 'Parallel offshore teams running cold outbound, email marketing, and sign-up generation as one coordinated operating model.', href: '/services/bpo' },
      { service: 'RPO', description: 'Scale your core team — engineers, ops, and revenue roles — as you move past the outsourced-motion stage.', href: '/services/rpo' },
      { service: 'AI Development', description: 'AI-assisted outbound tooling, lead scoring, and internal automations built by an offshore engineering team.', href: '/services/ai-development' },
    ],
    relatedCaseStudyClient: 'Keynotive',
    commonRoles: ['SDRs / outbound callers', 'Email marketing specialists', 'Sign-up / lead generation specialists', 'Growth engineers', 'Customer success & onboarding'],
    faqs: [
      { question: 'Can TrivianEdge run multiple outbound motions at once?', answer: 'Yes — our Keynotive engagement ran two offshore teams in parallel across cold calling, email marketing, and sign-up generation under one operating model, rather than as separate, disconnected hires.' },
      { question: 'Do we need to build a management layer for an offshore growth team?', answer: 'No. TrivianEdge manages HR, performance, and day-to-day operations for the team; you keep control of strategy, messaging, and targets.' },
      { question: 'How fast can an outbound team be live?', answer: 'TrivianEdge\'s standard deployment window is 30 days — sourcing, screening, legal setup, payroll, and onboarding included.' },
    ],
  },
  {
    slug: 'healthcare-medtech',
    name: 'Healthcare & Medtech',
    metaTitle: 'Healthcare & Medtech Software Outsourcing | TrivianEdge',
    tagline: 'Software and market-entry support for medtech products — built carefully, not casually.',
    description: 'Healthcare and medtech products carry real compliance stakes, and we treat that seriously: we do not claim formal healthcare certifications we do not hold, and we work with your legal and compliance team to confirm what a specific engagement requires. What we bring is engineering and market-entry execution for medtech, health-adjacent, and regulated-adjacent software products.',
    challenges: [
      'Medtech products need engineering teams who move carefully around compliance requirements, not just fast',
      'Entering a new regional market (e.g. GCC) means navigating unfamiliar regulatory and commercial landscapes',
      'Data handling for health-adjacent products needs documented, auditable controls',
      'Product and engineering bandwidth is often the bottleneck, not the market opportunity',
    ],
    howWeHelp: [
      { service: 'IT Outsourcing', description: 'Bespoke software delivery for medtech and health-adjacent products, with data handling documented and auditable.', href: '/services/it-outsourcing' },
      { service: 'AI Development', description: 'AI features built with data minimization, access controls, and audit logging — see our Trust page for what that means in practice.', href: '/services/ai-development' },
      { service: 'BPO', description: 'Operational and market-entry support so your team can focus on the regulated core of the product.', href: '/services/bpo' },
    ],
    relatedCaseStudyClient: 'Hub-Flx',
    commonRoles: ['Full-stack engineers', 'Data engineers', 'QA & compliance-aware testers', 'Market-entry / regional expansion support', 'Data migration specialists'],
    faqs: [
      { question: 'Does TrivianEdge hold healthcare compliance certifications?', answer: 'We do not claim certifications we do not hold. We design systems to support GDPR, PIPEDA, and HIPAA-aligned requirements where applicable, through controls like data minimization, access restrictions, and audit logging, and we work with your legal and compliance team to confirm what your specific engagement requires.' },
      { question: 'Have you supported medtech companies before?', answer: 'Yes — our Hub-Flx engagement supported regional expansion planning and delivery for medtech, ERP, and data-migration products entering the UAE and GCC market.' },
      { question: 'Can you handle patient or health data?', answer: 'Any engagement involving sensitive health data starts with a scoping conversation about your specific regulatory obligations — we\'d rather define that upfront than make a blanket claim that doesn\'t hold up to your compliance team\'s review.' },
    ],
  },
  {
    slug: 'education',
    name: 'Education',
    metaTitle: 'Education Software & Outsourcing Solutions | TrivianEdge',
    tagline: 'Modern public-facing systems and real operational verification, not spreadsheets.',
    description: 'Schools and education providers are often running on public websites and administrative processes that haven\'t kept pace with what\'s actually possible — manual attendance tracking, outdated public sites, and no real-time visibility into day-to-day operations. TrivianEdge builds the software layer that fixes that.',
    challenges: [
      'Public-facing websites are outdated and don\'t reflect the institution well',
      'Attendance and staff verification are tracked manually, with no real-time record',
      'Faculty and staff need a secure, purpose-built portal instead of ad hoc tools',
      'Engineering capacity to build and maintain this software doesn\'t exist in-house',
    ],
    howWeHelp: [
      { service: 'IT Outsourcing', description: 'Full site rebuilds, secure faculty portals, and custom systems like GPS-based attendance verification.', href: '/services/it-outsourcing' },
      { service: 'BPO', description: 'Ongoing administrative and operational support once the systems are live.', href: '/services/bpo' },
    ],
    relatedCaseStudyClient: 'Capricorn College',
    commonRoles: ['Full-stack engineers', 'UI/UX designers', 'QA engineers', 'Systems administrators', 'Administrative operations support'],
    faqs: [
      { question: 'Have you built systems for schools before?', answer: 'Yes — our Capricorn College engagement delivered a complete public site rebuild, a secure faculty portal, and a GPS-based attendance verification system, replacing a manual, honor-system process with a live, verifiable record.' },
      { question: 'Can you build a custom attendance or verification system?', answer: 'Yes. This is exactly the kind of purpose-built system TrivianEdge\'s bespoke software team delivers — scoped to how your institution actually operates, not a generic off-the-shelf tool.' },
      { question: 'Do you handle ongoing maintenance after launch?', answer: 'Yes. We can maintain and improve what we build post-launch, and pair it with ongoing administrative support through our BPO services if needed.' },
    ],
  },
];
