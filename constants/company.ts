// The one plain-English description of TrivianEdge. Every place that says what
// the company is (Organization schema, default meta description, About,
// Services, llms.txt) reads from here or copies it word for word.
//
// Why one source: search engines and AI answer engines decide what an entity
// is by comparing how its pages describe it. Consistent wording is what gets
// TrivianEdge summarised correctly in Google, ChatGPT, Perplexity and Gemini.
//
// Claims policy: Microsoft = AI Cloud Partner Program member (not CSP, so no
// licence resale or billing claims). Google = Partner Network member (no tier,
// no resale). Numbers are "typical", never guaranteed.

/** One sentence. Use where there is room for a single line. */
export const COMPANY_ONE_LINER =
  'TrivianEdge is a Toronto-based offshore outsourcing company specializing in talent outsourcing, resource augmentation, and bespoke software development.';

/** About 50 words. Default meta/schema description length. */
export const COMPANY_SHORT =
  'TrivianEdge is a Toronto-based offshore outsourcing company specializing in talent outsourcing, resource augmentation, and bespoke software development. We supply offshore professionals, build dedicated teams, and develop custom software. We also provide Microsoft and Google cloud services.';

/** About 150 words. About page, llms.txt, press. */
export const COMPANY_LONG = [
  'TrivianEdge is a Toronto-based offshore outsourcing company specializing in talent outsourcing, resource augmentation, and bespoke software development.',
  'TrivianEdge sources offshore professionals based on each client\'s requirements. Clients can add specialists, such as software developers and QA engineers, to an existing team through IT staff augmentation or build a dedicated offshore team. We also provide business process outsourcing (BPO) and recruitment process outsourcing (RPO).',
  'We recruit, employ and manage dedicated staff in the Philippines, Vietnam, Sri Lanka, Turkey, South Africa and Costa Rica, for technical and non-technical roles. Teams are typically working in around 30 days, usually at up to 40% less than hiring locally in Canada, the US or the UK.',
  'Our bespoke software development services cover custom web applications, systems integration, and AI-powered automation. Clients own the code.',
  'We also plan, migrate, secure and manage Microsoft 365, Copilot, Azure, Google Workspace and Google Cloud. TrivianEdge is a member of the Microsoft AI Cloud Partner Program (Partner ID 7154428) and the Google Partner Network.',
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
  googlePartnerId: 'eullM5rLyn',
};
