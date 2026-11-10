// Homepage content. Kept out of App.tsx so the page and its FAQPage schema
// (built in App.tsx getSEOProps) read from one source.
//
// Claims policy: Microsoft wording must match constants/microsoftPartner.ts
// (AI Cloud Partner Program member, not CSP). Google wording must match
// constants/googlePartner.ts (Partner Network member, no tier or resale).

export const HOME_TITLE =
  'Offshore Software Development & IT Staffing | TrivianEdge';

export const HOME_DESCRIPTION =
  'TrivianEdge provides offshore outsourcing, bespoke software development, talent outsourcing, and IT staff augmentation for companies that need to scale.';

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
    id: 'staff-augmentation',
    kicker: '01 · Staff augmentation',
    title: 'Add an offshore specialist',
    answer: 'We source offshore professionals to fill skills gaps on your existing team.',
    items: ['Software developers', 'QA engineers', 'Technical and operations specialists'],
    href: '/services/staff-augmentation',
    cta: 'Explore staff augmentation',
  },
  {
    id: 'dedicated-teams',
    kicker: '02 · Talent outsourcing',
    title: 'Build a dedicated offshore team',
    answer: 'We recruit, onboard and support an offshore team for ongoing engineering, customer support or back-office work.',
    items: ['Dedicated engineering teams', 'Customer support and back-office teams', 'Payroll and local compliance support'],
    href: '/services/dedicated-offshore-teams',
    cta: 'Explore dedicated teams',
  },
  {
    id: 'bespoke-software',
    kicker: '03 · Software development',
    title: 'Develop bespoke software',
    answer: 'We scope and build custom software around your requirements. You own the code.',
    items: ['Web applications and internal tools', 'Systems integration', 'AI development and automation'],
    href: '/services/it-outsourcing',
    cta: 'Explore bespoke software',
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
      'TrivianEdge is a Toronto-based offshore outsourcing company. We source specialists for existing teams, build dedicated offshore teams, and develop bespoke software. We also provide Microsoft and Google cloud services.',
  },
  {
    question: 'Is TrivianEdge a Microsoft partner?',
    answer:
      'Yes. TrivianEdge is a member of the Microsoft AI Cloud Partner Program (Partner ID 7154428) and a Microsoft Commercial Marketplace publisher. We deliver Microsoft 365, Copilot, and Azure migration, security, and managed services.',
  },
  {
    question: 'Does TrivianEdge work with Google Workspace and Google Cloud?',
    answer:
      'Yes. TrivianEdge is a member of the Google Partner Network. We plan and run Google Workspace migrations and administration, and design and manage workloads on Google Cloud. Many clients run both Microsoft and Google, and we manage the two side by side.',
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
