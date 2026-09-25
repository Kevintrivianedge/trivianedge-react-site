// The one plain-English description of TrivianEdge. Every place that says what
// the company is (Organization schema, default meta description, About,
// Services, llms.txt) reads from here or copies it word for word.
//
// Why one source: search engines and AI answer engines decide what an entity
// is by comparing how its pages describe it. Consistent wording is what gets
// TrivianEdge summarised correctly in Google, ChatGPT, Perplexity and Gemini.
//
// Claims policy: Microsoft = AI Cloud Partner Program member (not CSP, so no
// licence resale or billing claims). Google = capability only; the partnership
// is pending. Numbers are "typical", never guaranteed.

/** One sentence. Use where there is room for a single line. */
export const COMPANY_ONE_LINER =
  'TrivianEdge is a Toronto-based technology partner that sets up and runs Microsoft and Google Cloud, builds AI and custom software, and hires and manages offshore teams, all under one contract.';

/** About 50 words. Default meta/schema description length. */
export const COMPANY_SHORT =
  'TrivianEdge is a Toronto-based technology partner. We set up and manage Microsoft and Google Cloud, build AI and custom software, and hire and run offshore teams from six countries. Companies use us instead of juggling a cloud reseller, a software agency and a staffing firm.';

/** About 150 words. About page, llms.txt, press. */
export const COMPANY_LONG = [
  'TrivianEdge is a technology partner headquartered in Toronto, Canada. We help growing companies with three things, under one contract and one point of contact.',
  'Cloud: we plan, migrate, secure and manage Microsoft 365, Copilot, Azure, Google Workspace and Google Cloud. TrivianEdge is a member of the Microsoft AI Cloud Partner Program (Partner ID 7154428).',
  'AI and software: we build generative AI features, LLM integrations, AI agents and automations, and custom web applications. Clients own all the code.',
  'Global teams: we recruit, employ and manage dedicated staff in the Philippines, Vietnam, Sri Lanka, Turkey, South Africa and Costa Rica, for technical and non-technical roles. Teams are typically working in around 30 days, usually at up to 40% less than hiring locally in Canada, the US or the UK.',
  'TrivianEdge was founded in 2025 by Kevin Vaz, who has spent more than 20 years in outsourcing and operations.',
];

export const COMPANY_FACTS = {
  legalName: 'TrivianEdge Inc.',
  headquarters: 'Toronto, Ontario, Canada',
  founded: '2025',
  founder: 'Kevin Vaz',
  talentHubs: ['Philippines', 'Vietnam', 'Sri Lanka', 'Turkey', 'South Africa', 'Costa Rica'],
  typicalDeployment: 'around 30 days',
  microsoftPartnerId: '7154428',
};
