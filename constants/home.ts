// Homepage content. Kept out of App.tsx so the page and its FAQPage schema
// (built in App.tsx getSEOProps) read from one source.
//
// Claims policy: Microsoft wording must match constants/microsoftPartner.ts
// (AI Cloud Partner Program member, not CSP). Google partnership is pending,
// so Google Cloud is described as a capability only, never as a partnership.

export const HOME_TITLE =
  'Microsoft & Google Cloud, AI & Offshore Teams | TrivianEdge';

export const HOME_DESCRIPTION =
  'Toronto-based partner for Microsoft and Google cloud, AI and custom software, and offshore teams, typically live in around 30 days. Book a free 15-minute call.';

export interface Pillar {
  id: string;
  kicker: string;
  title: string;
  /** One-sentence direct answer, written to be quotable by AI search. */
  answer: string;
  items: string[];
  href: string;
  cta: string;
}

export const PILLARS: Pillar[] = [
  {
    id: 'cloud',
    kicker: '01 · Cloud',
    title: 'Microsoft and Google cloud, set up and run properly.',
    answer:
      'We plan, migrate, secure and manage Microsoft 365, Copilot, Azure, Google Workspace and Google Cloud, so your team stops fighting its tools and gets on with the work.',
    items: ['Microsoft 365 & Copilot rollout', 'Azure migration & cost review', 'Google Workspace migration', 'Google Cloud architecture', 'Identity, MFA & security baselines'],
    href: '/services/cloud',
    cta: 'Explore cloud services',
  },
  {
    id: 'ai',
    kicker: '02 · AI & Software',
    title: 'AI and custom software your team actually uses.',
    answer:
      'We build AI features, LLM integrations, automations and custom apps that plug into the systems you already run. You own 100% of the code.',
    items: ['Generative AI & LLM integration', 'AI agents & automation', 'Custom web & internal tools', 'MLOps'],
    href: '/services/ai-development',
    cta: 'Explore AI development',
  },
  {
    id: 'teams',
    kicker: '03 · Global Teams',
    title: 'Offshore teams, hired and managed for you.',
    answer:
      'We recruit, employ and manage dedicated staff in six countries, for technical and non-technical roles. Teams are typically working in around 30 days, at up to 40% less than hiring locally.',
    items: ['Business process outsourcing (BPO)', 'Recruitment process outsourcing (RPO)', 'Offshore engineering teams', 'Payroll & local compliance'],
    href: '/services',
    cta: 'Explore team services',
  },
];

/** Plain facts shown under the hero. Each must be verifiable. The 40% figure
 * is substantiated by the methodology note on /proof. The Microsoft Partner ID
 * lives in the hero badge, FAQ and schema instead. */
export const HERO_FACTS = [
  { k: 'Headquarters', v: 'Toronto, Canada' },
  { k: 'Talent hubs', v: '6 countries' },
  { k: 'Typical team deployment', v: 'Around 30 days' },
  { k: 'Vs. hiring locally', v: 'Up to 40% less' },
];

export const HOME_FAQS = [
  {
    question: 'What happens on the 15-minute call?',
    answer:
      "You tell us what you're trying to fix or build, and we ask questions. If we can help, we follow up with a written plan and a rough estimate. If we can't, we'll say so. The call is free and there is no obligation.",
  },
  {
    question: 'What does TrivianEdge do?',
    answer:
      'TrivianEdge is a Toronto-based technology partner with three services: Microsoft and Google cloud implementation and management, AI and custom software development, and offshore team staffing (BPO and RPO). Clients use one contract and one point of contact for all three.',
  },
  {
    question: 'Is TrivianEdge a Microsoft partner?',
    answer:
      'Yes. TrivianEdge is a member of the Microsoft AI Cloud Partner Program (Partner ID 7154428) and a Microsoft Commercial Marketplace publisher. We deliver Microsoft 365, Copilot, and Azure migration, security, and managed services.',
  },
  {
    question: 'Does TrivianEdge work with Google Workspace and Google Cloud?',
    answer:
      'Yes. We plan and run Google Workspace migrations and administration, and design and manage workloads on Google Cloud. Many clients run both Microsoft and Google, and we manage the two side by side.',
  },
  {
    question: 'Can TrivianEdge migrate us from Google Workspace to Microsoft 365, or the other way?',
    answer:
      'Yes. We migrate mail, calendars, files, and identities in either direction, in phases, so staff keep working during the move. Every migration starts with an inventory and a cut-over plan agreed before any data moves.',
  },
  {
    question: 'Can TrivianEdge build AI and software for my business?',
    answer:
      'Yes. We build custom applications, internal tools, and AI features such as LLM integrations, agents, and automations, on top of your existing systems or from scratch. You own 100% of the code.',
  },
  {
    question: 'Where is TrivianEdge based, and where are its teams?',
    answer:
      'TrivianEdge is headquartered in Toronto, Ontario, Canada, and serves clients across North America, the UK, Australia, and the Middle East. Our talent operations span six countries: the Philippines, Vietnam, Sri Lanka, Turkey, South Africa, and Costa Rica.',
  },
  {
    question: 'How quickly can TrivianEdge deploy an offshore team?',
    answer:
      'Typically around 30 days, covering sourcing, screening, contracts, payroll setup, and onboarding. Specialised roles can take longer, and simpler ones can move faster.',
  },
  {
    question: 'How much does it cost to work with TrivianEdge?',
    answer:
      'It depends on scope. Offshore teams usually cost up to 40% less than hiring locally in Canada, the US, or the UK. Cloud and software projects are quoted after a free scoping call, where we give you a written estimate.',
  },
  {
    question: 'Do I need a legal entity abroad to hire through TrivianEdge?',
    answer:
      'No. TrivianEdge works with in-country employer-of-record and payroll partners, so you can hire in any of our six countries without setting up a foreign entity. You receive one invoice from us.',
  },
  {
    question: 'Is there a minimum contract size?',
    answer:
      'No. You can start with one person or one project. Many clients begin with a scoped project and move to an ongoing arrangement once they have seen results.',
  },
];
