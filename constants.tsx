
import React from 'react';
import {
  Cpu,
  Globe,
  Zap,
  ShieldCheck,
  BarChart4,
  Layers,
  Users,
  TrendingUp,
  Search
} from 'lucide-react';
import { ServiceCardProps, RoleCategory, Step, TalentHub } from './types';

/** Microsoft Bookings link used for the "Book a call" secondary CTA next to the inquiry form. */
export const BOOKING_URL =
  'https://bookings.cloud.microsoft/book/TrivianEdge@Trivianedge.com/?ismsaljsauthenabled';

export const NAV_LINKS = [
  {
    name: 'Services',
    href: '/services',
    children: [
      { name: 'All Services', href: '/services' },
      { name: 'Offshore Staff Augmentation', href: '/services/staff-augmentation' },
      { name: 'Dedicated Offshore Teams', href: '/services/dedicated-offshore-teams' },
      { name: 'Bespoke Software Development', href: '/services/it-outsourcing' },
      { name: 'AI Development', href: '/services/ai-development', isSub: true },
      { name: 'Business Process Outsourcing', href: '/services/bpo' },
      { name: 'Recruitment Process Outsourcing', href: '/services/rpo' },
      { name: 'Full-Cycle RPO', href: '/services/rpo/full-cycle-rpo', isSub: true },
      { name: 'Project-Based RPO', href: '/services/rpo/project-based-rpo', isSub: true },
      { name: 'AI-Powered Recruitment', href: '/services/rpo/ai-powered-recruitment', isSub: true },
      { name: 'Microsoft & Google Cloud', href: '/services/cloud' },
      { name: 'Industries We Serve', href: '/industries' },
    ],
  },
  {
    name: 'Compare',
    href: '/compare/bpo-vs-internal-team',
    children: [
      { name: 'BPO vs. Internal Team', href: '/compare/bpo-vs-internal-team' },
      { name: 'RPO vs. Recruitment Agency', href: '/compare/rpo-vs-recruitment-agency' },
      { name: 'EOR Partner vs. Foreign Entity', href: '/compare/eor-vs-foreign-entity' },
      { name: 'AI Dev Agency vs. In-House Team', href: '/compare/ai-development-agency-vs-in-house-team' },
      { name: 'Bespoke Software vs. Freelance Platforms', href: '/compare/bespoke-software-vs-freelance-platforms' },
    ],
  },
  { name: 'Venture Studio', href: '/venture-studio' },
  { name: 'Proof', href: '/proof' },
  { name: 'Trust', href: '/trust' },
  { name: 'About', href: '/about' },
  { name: 'Blog', href: '/blog' },
];

export const SERVICES: ServiceCardProps[] = [
  {
    title: "We Build Your Team",
    description: "Think of us as your global hiring department, except we already know everyone. Whether you need a software engineer in Vietnam, a customer support team in the Philippines, or an ops lead in Toronto, we find the right person and typically get them working for you in around 30 days.",
    icon: <Users className="w-8 h-8 text-cyan-400" />,
    tags: ["Global Hiring", "24/7 Coverage", "Start in Around 30 Days"],
    features: [
      "Technical and Non-Technical Role Sourcing",
      "Cross-Timezone Team Design",
      "Deployment in Around 30 Days",
      "Full Onboarding and Integration"
    ],
    outcomes: [
      "Your team running 24/7 across time zones",
      "Revenue keeps moving while you sleep"
    ]
  },
  {
    title: "We Keep Your Tech Running",
    description: "Your servers, your software, your security monitored and managed around the clock so you never wake up to a crisis. Think of it as having your own IT department, without the overhead of building one in-house.",
    icon: <ShieldCheck className="w-8 h-8 text-cyan-400" />,
    tags: ["Cybersecurity", "DevOps", "Cloud Management"],
    features: [
      "24/7 Security Monitoring and Compliance",
      "Cloud Infrastructure Management",
      "DevOps and CI/CD Pipeline Services",
      "IT Support Outsourcing"
    ],
    outcomes: [
      "99.99% uptime across your infrastructure",
      "Security gaps closed before they become problems"
    ]
  },
  {
    title: "We Open New Doors for You",
    description: "Want to sell in a new country? We build the entire strategy, find local partners, and run the outreach from day one. When Hub-Flx wanted to expand into the UAE, we did not just give advice. We did the work.",
    icon: <Cpu className="w-8 h-8 text-cyan-400" />,
    tags: ["Market Entry", "Sales Strategy", "Regional Growth"],
    features: [
      "Full Sales Strategy and Execution",
      "Local Market Sourcing and Outreach",
      "Regional Partnership Development",
      "Product Fit and Scale Consulting"
    ],
    outcomes: [
      "Active partners and revenue in new markets",
      "UAE and GCC regional expansion underway"
    ]
  },
  {
    title: "We Design How Your Team Works",
    description: "When your team is spread across time zones, things can fall through the cracks. We design the systems, the handoffs, the check-ins, and the scorecards that keep everyone moving together like a relay race where the baton never drops.",
    icon: <Layers className="w-8 h-8 text-cyan-400" />,
    tags: ["Ops Consulting", "KPI Design", "Team Structure"],
    features: [
      "Global Team Structuring and Design",
      "KPI Frameworks and SLA Governance",
      "Cross-Timezone Handoff Protocols",
      "Ongoing Performance Management"
    ],
    outcomes: [
      "Broken processes fixed and streamlined",
      "Predictable results across every time zone"
    ]
  },
  {
    title: "We Handle Your Back Office",
    description: "Payroll, accounting, invoicing, admin. The stuff that is essential but eats up your time and does not grow your business. We take it completely off your plate so you can focus on the work that actually matters.",
    icon: <BarChart4 className="w-8 h-8 text-cyan-400" />,
    tags: ["Virtual CFO", "Accounting", "Back-Office"],
    features: [
      "Finance and Accounting Outsourcing",
      "Virtual CFO and Financial Reporting",
      "Payroll Processing and AR/AP Management",
      "Back-Office Operations Outsourcing"
    ],
    outcomes: [
      "Audit-ready financials at all times",
      "30% reduction in admin overhead"
    ]
  }
];

export const TALENT_HUBS: TalentHub[] = [
  {
    id: "lka",
    country: "Sri Lanka",
    flag: "🇱🇰",
    flagCode: "lk",
    specialty: "High-End Software Engineering",
    description: "A resilient hub known for boutique software engineering and complex data architecture. Sri Lankan talent excels in problem-solving for enterprise systems.",
    infrastructure: "Modern tech parks with 24/7 high-speed fiber connectivity and reliable power grids back the digital export economy.",
    communication: "Exceptional English proficiency with a cultural focus on collaborative project management and transparency.",
    gradient: "from-amber-500/20 to-orange-600/20",
    keyCities: ["Colombo", "Kandy", "Galle"],
    educationFocus: "Computer Science, Data Engineering, Mathematics",
    timeZoneAlignment: "GMT+5:30 (Partial Overlap with EU/Asia/Aus)",
    popularTech: ["Java / Spring Boot", "React & Node.js", ".NET Core", "AWS / Azure", "Data Science"]
  },
  {
    id: "phl",
    country: "Philippines",
    flag: "🇵🇭",
    flagCode: "ph",
    specialty: "Operational & Service Excellence",
    description: "The global gold standard for customer experience and operational support. Filipino talent offers unmatched scalability and workflow precision.",
    infrastructure: "Highly mature IT-BPM ecosystem with state-of-the-art facilities across Metro Manila and secondary emerging cities.",
    communication: "Native-level English fluency and deep Western cultural alignment make integration seamless for North American enterprises.",
    gradient: "from-blue-500/20 to-red-500/20",
    keyCities: ["Manila", "Cebu City", "Davao"],
    educationFocus: "Business Administration, IT, Communications",
    timeZoneAlignment: "GMT+8 (US Night Shift / AU Day Alignment)",
    popularTech: ["PHP / Laravel", "Python", "Salesforce", "Netsuite", "Customer Support Tools"]
  },
  {
    id: "vnm",
    country: "Vietnam",
    flag: "🇻🇳",
    flagCode: "vn",
    specialty: "Next-Gen Tech & Development",
    description: "A fast-growth hub with a massive, tech-savvy youth population. Vietnam is the go-to for rapid development cycles and AI implementation.",
    infrastructure: "Aggressive government investment in digital infrastructure and STEM education has created a high-bandwidth development environment.",
    communication: "Technical communication is precise, with a workforce that is highly adaptive to modern Agile and DevOps frameworks.",
    gradient: "from-red-600/20 to-yellow-500/20",
    keyCities: ["Ho Chi Minh City", "Hanoi", "Da Nang"],
    educationFocus: "STEM, Software Engineering, AI/ML",
    timeZoneAlignment: "GMT+7 (APAC Alignment)",
    popularTech: ["Node.js", "Golang", "C++", "Python", "Mobile (Flutter/React Native)"]
  },
  {
    id: "tur",
    country: "Turkey",
    flag: "🇹🇷",
    flagCode: "tr",
    specialty: "Strategic Bridge Ops & Tech",
    description: "Bridging Europe and Asia, Turkish talent offers high technical competence and a strategic geographic advantage for global uptime.",
    infrastructure: "Advanced industrial and technological infrastructure supporting high-availability systems and complex logistics.",
    communication: "Bilingual talent pool with a strong presence in European markets, offering sophisticated business communication skills.",
    gradient: "from-red-500/20 to-gray-400/20",
    keyCities: ["Istanbul", "Ankara", "Izmir"],
    educationFocus: "Engineering, Industrial Design, Logistics",
    timeZoneAlignment: "GMT+3 (Perfect EU / UK Alignment)",
    popularTech: ["Java", "Angular", "Mobile (Native)", "Unity / Gaming", "Cybersecurity"]
  },
  {
    id: "zaf",
    country: "South Africa",
    flag: "🇿🇦",
    flagCode: "za",
    specialty: "Financial & Specialized Ops",
    description: "A powerhouse for finance, legal, and specialized BPO. South Africa offers high-value expertise for complex operational roles.",
    infrastructure: "World-class financial systems and a robust telecommunications backbone optimized for international business services.",
    communication: "Neutral accents and high English proficiency, perfectly synchronized with UK and European business hours.",
    gradient: "from-emerald-500/20 to-green-600/20",
    keyCities: ["Cape Town", "Johannesburg", "Durban"],
    educationFocus: "Finance, Law, Accounting, Actuarial Science",
    timeZoneAlignment: "GMT+2 (UK / EU Alignment)",
    popularTech: ["C# / .NET", "Python", "Azure", "SAP", "FinTech Stacks"]
  },
  {
    id: "cri",
    country: "Costa Rica",
    flag: "🇨🇷",
    flagCode: "cr",
    specialty: "Premium Nearshore Tech",
    description: "The premier nearshore destination for North America. Known for its political stability and highly educated tech workforce.",
    infrastructure: "Renewable energy-powered infrastructure and high-quality connectivity in a business-friendly, stable environment.",
    communication: "Fluent bilingual talent (English/Spanish) with a deep understanding of US corporate culture and timezones.",
    gradient: "from-blue-600/20 to-white/10",
    keyCities: ["San Jose", "Heredia", "Alajuela"],
    educationFocus: "Computer Science, English, Cyber Security",
    timeZoneAlignment: "GMT-6 (US Central/Eastern Alignment)",
    popularTech: ["React", "Node.js", "Ruby on Rails", "AWS", "Python"]
  }
];

export const ROLES: RoleCategory[] = [
  {
    title: "Tech & Engineering",
    gradient: "from-cyan-500/20 to-blue-500/20",
    roles: [
      "AI & Machine Learning Engineers",
      "Full-Stack Software Engineers",
      "Data Scientists & Architects",
      "Cloud & DevOps Specialists",
      "UI/UX Product Designers",
      "Cybersecurity Analysts"
    ]
  },
  {
    title: "Operations & Delivery",
    gradient: "from-cyan-500/20 to-emerald-500/20",
    roles: [
      "Operational Lead / Managers",
      "Financial Analysts",
      "HR & Talent Strategists",
      "Customer Support Experts",
      "Administrative Controllers",
      "Project & Scrum Masters"
    ]
  }
];

export const STEPS: Step[] = [
  {
    number: "01",
    title: "A 15-minute call",
    description: "Tell us what's slowing you down. We ask a lot of questions and skip the pitch. If we're not the right fit, we'll tell you.",
    icon: <Search className="w-6 h-6 text-cyan-400" />
  },
  {
    number: "02",
    title: "A plan you can read",
    description: "You get a written plan in plain English: what you need, where it happens, what it costs and how long it takes. No commitment until you say yes.",
    icon: <Globe className="w-6 h-6 text-cyan-400" />
  },
  {
    number: "03",
    title: "We hire, build or migrate",
    description: "We run the search, the build or the move. For offshore teams that covers sourcing, screening, contracts, payroll and onboarding, typically in around 30 days.",
    icon: <Zap className="w-6 h-6 text-cyan-400" />
  },
  {
    number: "04",
    title: "We stay accountable",
    description: "One point of contact, regular check-ins, and fast fixes when something isn't working. As you grow, the team or the system grows with you.",
    icon: <TrendingUp className="w-6 h-6 text-cyan-400" />
  }
];
