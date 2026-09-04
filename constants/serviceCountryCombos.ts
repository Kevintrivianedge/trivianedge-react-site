import { ServiceCountryCombo } from '../types';

export const SERVICE_COUNTRY_COMBOS: ServiceCountryCombo[] = [
  {
    service: 'bpo',
    serviceName: 'BPO',
    serviceHref: '/services/bpo',
    countrySlug: 'philippines',
    hubId: 'phl',
    angle: 'The Philippines is TrivianEdge\'s deepest BPO hub — native-level English, a mature IT-BPM ecosystem, and a workforce built around operational and customer-facing excellence. It is the hub most of our back-office, support, and finance-ops BPO placements come from.',
    typicalRoles: ['Customer support specialists', 'Back-office & data processing', 'Finance & accounting support', 'Administrative controllers', 'Documentation & compliance specialists'],
    faqs: [
      { question: 'Why is the Philippines TrivianEdge\'s primary BPO hub?', answer: 'Native-level English fluency, deep Western cultural alignment, and a mature IT-BPM ecosystem across Metro Manila and secondary cities make integration with North American and Australian businesses fast and low-friction.' },
      { question: 'What time zone fit does a Philippines BPO team offer?', answer: 'GMT+8 — this aligns well with US night-shift coverage and Australian daytime hours, which is part of why cross-timezone BPO models (like the one built for Cargo Login) often anchor on a Philippines-based team.' },
      { question: 'What roles does TrivianEdge typically place from the Philippines?', answer: 'Customer support, back-office and data processing, finance and accounting support, and documentation-heavy operational roles — the functions where operational precision and communication quality matter most.' },
    ],
  },
  {
    service: 'rpo',
    serviceName: 'RPO',
    serviceHref: '/services/rpo',
    countrySlug: 'sri-lanka',
    hubId: 'lka',
    angle: 'Sri Lanka is TrivianEdge\'s software engineering talent hub — boutique engineering depth and strong problem-solving for complex, enterprise-grade systems. RPO placements from Sri Lanka skew toward technical and engineering roles rather than volume operational hiring.',
    typicalRoles: ['Full-stack & backend engineers', 'Data engineers & architects', '.NET / Java engineers', 'Cloud & DevOps specialists', 'QA engineers'],
    faqs: [
      { question: 'Why hire engineers through RPO in Sri Lanka?', answer: 'Sri Lanka has a resilient talent base known for boutique software engineering and complex data architecture, with exceptional English proficiency and a culture of transparent, collaborative project management — good fit for embedded technical hiring, not just staffing.' },
      { question: 'How does RPO in Sri Lanka differ from BPO in the Philippines?', answer: 'RPO places direct hires onto your own team — you own the employment relationship\'s day-to-day management once they\'re hired, coordinated through in-country EOR partners. It\'s a fit when you want engineers who are functionally part of your team, not an outsourced function.' },
      { question: 'What is the time zone overlap for a Sri Lanka-based engineering hire?', answer: 'GMT+5:30 — partial overlap with European and Asia-Pacific working hours, which most engineering teams manage well with a few hours of daily overlap plus async workflows.' },
    ],
  },
  {
    service: 'ai-development',
    serviceName: 'AI Development',
    serviceHref: '/services/ai-development',
    countrySlug: 'vietnam',
    hubId: 'vnm',
    angle: 'Vietnam is TrivianEdge\'s fastest-growing tech hub — a large, tech-savvy young talent pool with heavy government investment in digital infrastructure and STEM education, and strong adoption of modern AI/ML tooling and Agile practices.',
    typicalRoles: ['AI & machine learning engineers', 'LLM integration engineers', 'Backend engineers (Node.js, Golang, Python)', 'Data scientists', 'MLOps engineers'],
    faqs: [
      { question: 'Why build AI products with a Vietnam-based team?', answer: 'Vietnam combines rapid development cycles with a workforce that\'s highly adaptive to modern Agile and DevOps frameworks, backed by aggressive government investment in STEM education and digital infrastructure — a strong fit for fast-moving AI feature work.' },
      { question: 'What AI development work does TrivianEdge typically staff from Vietnam?', answer: 'LLM integration, RAG systems, and AI feature engineering are common — teams built on current OpenAI, Anthropic, and open-weight models, plus the data and MLOps engineering to support them in production.' },
      { question: 'What is the time zone alignment with Vietnam?', answer: 'GMT+7 — strong APAC alignment, and workable overlap windows for North American and European teams that build async-friendly workflows around it.' },
    ],
  },
  {
    service: 'it-outsourcing',
    serviceName: 'IT Outsourcing',
    serviceHref: '/services/it-outsourcing',
    countrySlug: 'costa-rica',
    hubId: 'cri',
    angle: 'Costa Rica is the premier nearshore option for North American IT outsourcing — bilingual talent, US-aligned time zones, and a stable, business-friendly environment that makes real-time collaboration with US and Canadian teams straightforward.',
    typicalRoles: ['Full-stack engineers (React, Node.js, Ruby on Rails)', 'DevOps & cloud engineers', 'QA engineers', 'Cybersecurity specialists', 'Technical project managers'],
    faqs: [
      { question: 'Why choose Costa Rica for nearshore IT outsourcing?', answer: 'Costa Rica offers US Central/Eastern-aligned time zones (GMT-6), fluent bilingual talent, and a politically stable, business-friendly environment — ideal when your team needs real-time overlap with US or Canadian working hours rather than an overnight handoff model.' },
      { question: 'How is nearshore different from TrivianEdge\'s other offshore hubs?', answer: 'Nearshore hubs like Costa Rica prioritize timezone overlap for real-time collaboration, while hubs like the Philippines or Sri Lanka are often chosen for cost efficiency or specific technical depth even with less daily overlap. We help you match the hub to how your team actually needs to work.' },
      { question: 'What kind of engineering work fits a Costa Rica team best?', answer: 'Work that benefits from daily real-time collaboration with a North American product or engineering team — full-stack development, DevOps, and QA where fast, synchronous back-and-forth speeds up delivery.' },
    ],
  },
];
