
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
import { ServiceCardProps, RoleCategory, Step, BlogPost, TalentHub } from './types';

/** Microsoft Bookings link used for the "Book a call" secondary CTA next to the inquiry form. */
export const BOOKING_URL =
  'https://outlook.office.com/bookwithme/user/48ce5d8759714368849f15db51a85e3d@Trivianedge.com/meetingtype/s7PQVr0JckW_iJXa78wY3g2?anonymous&ismsaljsauthenabled&ep=mlink';

export const NAV_LINKS = [
  {
    name: 'Services',
    href: '/services',
    children: [
      { name: 'All Services', href: '/services' },
      { name: 'Business Process Outsourcing', href: '/services/bpo' },
      { name: 'Recruitment Process Outsourcing', href: '/services/rpo' },
      { name: 'Full-Cycle RPO', href: '/services/rpo/full-cycle-rpo', isSub: true },
      { name: 'Project-Based RPO', href: '/services/rpo/project-based-rpo', isSub: true },
      { name: 'AI-Powered Recruitment', href: '/services/rpo/ai-powered-recruitment', isSub: true },
      { name: 'Bespoke Software Development', href: '/services/it-outsourcing' },
      { name: 'AI Development', href: '/services/ai-development', isSub: true },
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
    description: "Think of us as your global hiring department, except we already know everyone. Whether you need a software engineer in Vietnam, a customer support team in the Philippines, or an ops lead in Toronto, we find the right person and get them working for you within 30 days.",
    icon: <Users className="w-8 h-8 text-cyan-400" />,
    tags: ["Global Hiring", "24/7 Coverage", "30-Day Start"],
    features: [
      "Technical and Non-Technical Role Sourcing",
      "Cross-Timezone Team Design",
      "30-Day Deployment Model",
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
    title: "You Tell Us What You Need",
    description: "We spend time understanding your business, your goals, and exactly what kind of person would make a real difference. No guesswork, no generic job descriptions.",
    icon: <Search className="w-6 h-6 text-cyan-400" />
  },
  {
    number: "02",
    title: "We Find the Right Person",
    description: "Our network spans 6 countries and hundreds of vetted candidates. We search, screen, and shortlist the best match for your role, usually within a week.",
    icon: <Globe className="w-6 h-6 text-cyan-400" />
  },
  {
    number: "03",
    title: "They Start in 30 Days",
    description: "We onboard your new team member and make sure they fit right into your existing workflow. Day one feels like they have been there for months.",
    icon: <Zap className="w-6 h-6 text-cyan-400" />
  },
  {
    number: "04",
    title: "We Keep Making It Better",
    description: "We track how things are going and scale your team as your business grows. Good results get built on. Anything that is not working gets fixed fast.",
    icon: <TrendingUp className="w-6 h-6 text-cyan-400" />
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "cargo-login-case-study",
    title: "Cargo Login: How 24/7 Cross-Timezone Ops Increased Revenue",
    excerpt: "Cargo Login needed more than recruitment support. They needed an operations partner to keep workflows moving across time zones while the US team was offline. Read the full story.",
    content: "Cargo Login had a common but costly problem: once the US team signed off, key logistics work paused until the next day. Documentation queues grew overnight, urgent requests sat unresolved, and the team started each morning already behind.\n\nThe fix was not just adding headcount. We designed a cross-timezone operating model that kept execution moving.\n\nTrivianEdge deployed a Philippines-based specialist for documentation continuity and a Canada-based operator focused on trucking-side workflow ownership. Together, they created round-the-clock coverage with clear handoffs instead of stop-start execution.\n\nWith this setup, overnight backlog dropped, daily operations became more predictable, and Cargo Login regained momentum. The commercial impact was straightforward: fewer delays, cleaner throughput, and stronger revenue continuity.\n\nThis is how we approach delivery: not resume matching, but operational fit. The goal is to make the system run better, not just fill a role.",
    author: "TrivianEdge Editorial",
    date: "Jan 15, 2025",
    readTime: "5 min read",
    category: "Case Study",
    imageGradient: "from-cyan-500/45 to-cyan-700/25",
    slug: "cargo-login-case-study",
    metaDescription: "Case study: Cargo Login used TrivianEdge cross-timezone operations in the Philippines and Canada to keep logistics workflows moving and grow revenue.",
    metaKeywords: ["cargo login", "cross-timezone operations", "logistics staffing", "Philippines talent", "TrivianEdge case study"],
    datePublished: "2025-01-15",
    dateModified: "2025-01-15",
    imageUrl: "https://www.trivianedge.com/og-image.png",
  },
  {
    id: "keynotive-case-study",
    title: "Keynotive: Running Two Sales Teams Across Time Zones",
    excerpt: "Keynotive needed to grow pipeline quickly without adding heavy internal overhead. TrivianEdge deployed two parallel offshore teams across time zones for cold calling, email, and sign-up execution. Read the full story.",
    content: "Keynotive wanted growth, but without creating a heavy in-house sales structure. The goal was simple: increase pipeline activity while keeping overhead controlled.\n\nTrivianEdge deployed two offshore sales teams across different time zones. Both teams ran in parallel on cold calling, outbound email, and business sign-up workflows.\n\nTo make the model work, we standardized the operating layer around shared CRM usage, channel ownership, reporting cadence, and handoff discipline. This prevented overlap and reduced dropped opportunities between shifts.\n\nThe result was a more consistent sales engine: activity continued while one team was offline, and Keynotive gained stronger pipeline visibility and execution rhythm.\n\nThe lesson is clear. Offshore works best when process quality is treated as a core product, not an afterthought.",
    author: "TrivianEdge Editorial",
    date: "Feb 03, 2025",
    readTime: "4 min read",
    category: "Case Study",
    imageGradient: "from-cyan-500/45 to-cyan-700/25",
    slug: "keynotive-case-study",
    metaDescription: "Case study: Keynotive scaled outbound sales with two offshore teams across time zones, improving pipeline consistency and execution visibility.",
    metaKeywords: ["keynotive", "offshore sales teams", "cold calling outsourcing", "multi-timezone sales", "TrivianEdge case study"],
    datePublished: "2025-02-03",
    dateModified: "2025-02-03",
    imageUrl: "https://www.trivianedge.com/og-image.png",
  },
  {
    id: "hub-flx-case-study",
    title: "Hub-Flx: Bringing Software Products to the UAE and GCC",
    excerpt: "Hub-Flx partnered with TrivianEdge to expand Medtech, ERP, and data migration products into the UAE and GCC. The engagement focused on disciplined regional execution, partner strategy, and market traction. Read the full story.",
    content: "Hub-Flx wanted to expand software offerings into UAE and wider GCC markets, where expectations are high and buying processes can be complex.\n\nThe challenge was not product ambition. It was disciplined regional execution: market entry sequence, local partner strategy, procurement realities, and category-specific positioning for products such as Medtech, ERP, and data migration tools.\n\nTrivianEdge supported the expansion model as an operating partner, helping shape go-to-market priorities and practical partnership paths.\n\nThat support created stronger regional traction and a more credible expansion posture.\n\nThe work continues as an active partnership, focused on sustainable rollout rather than short-term launch activity.",
    author: "TrivianEdge Editorial",
    date: "Mar 10, 2025",
    readTime: "6 min read",
    category: "Case Study",
    imageGradient: "from-cyan-500/45 to-cyan-700/25",
    slug: "hub-flx-case-study",
    metaDescription: "Case study: Hub-Flx expanded Medtech, ERP, and data migration solutions into UAE and GCC markets with TrivianEdge operating support.",
    metaKeywords: ["hub-flx", "UAE expansion", "GCC software market", "medtech deployment", "TrivianEdge case study"],
    datePublished: "2025-03-10",
    dateModified: "2025-03-10",
    imageUrl: "https://www.trivianedge.com/og-image.png",
  },
  {
    id: "1",
    title: "Why HR and Ops Are Always Arguing (And How to Fix It)",
    excerpt: "HR often optimizes for profile quality while Ops optimizes for delivery under pressure. This gap slows hiring and increases execution risk during scale. Read the full story.",
    content: "In many growth companies, hiring discussions break in the same place: HR optimizes for profile quality, while Ops optimizes for execution under pressure.\n\nBoth views matter, but when they are disconnected, hiring decisions drift toward impressive resumes that do not always perform in live operating conditions.\n\nThe fix is to define one shared scorecard before interviews begin. That scorecard should combine role capability, communication behavior, and delivery fit for the team environment.\n\nIn practical terms, this means asking fewer abstract questions and more scenario-based questions tied to your real workflow.\n\nWhen HR and Ops evaluate the same outcomes, hiring becomes faster, onboarding is cleaner, and performance risk drops early.",
    author: "TrivianEdge Editorial",
    date: "Oct 12, 2024",
    readTime: "6 min read",
    category: "Operations",
    imageGradient: "from-cyan-500/45 to-cyan-700/25",
    slug: "hr-ops-alignment-guide",
    metaDescription: "HR and Ops misalignment slows hiring and delivery. Learn a practical framework to align scorecards, interviews, and execution outcomes.",
    metaKeywords: ["HR operations alignment", "hiring strategy", "operational staffing", "remote team management", "TrivianEdge"],
    datePublished: "2024-10-12",
    dateModified: "2024-10-12",
    imageUrl: "https://www.trivianedge.com/og-image.png",
  },
  {
    id: "2",
    title: "Why 'Body Shopping' is Dead (And What's Replacing It)",
    excerpt: "The old outsourcing model optimized for low-cost headcount, not reliable outcomes. Modern teams win by building autonomous global capability with clear ownership. Read the full story.",
    content: "Traditional outsourcing earned a poor reputation for a reason: it often optimized for headcount cost, not delivery quality.\n\nThat model is being replaced by something more effective: outcome-led global teams with clear ownership.\n\nModern buyers are no longer asking, \"How cheap can we hire?\" They are asking, \"Can this team deliver reliably in our environment?\"\n\nThe answer depends on operating design. Teams need context, role clarity, communication rhythm, and decision boundaries to work autonomously.\n\nWhen those pieces are in place, offshore capability stops being a cost lever and becomes a growth lever.",
    author: "AI Research Lead",
    date: "Sep 28, 2024",
    readTime: "8 min read",
    category: "AI & Tech",
    imageGradient: "from-cyan-500/45 to-cyan-700/25",
    slug: "end-of-body-shopping-global-talent",
    metaDescription: "Body shopping is being replaced by outcome-led global teams. Learn how to build offshore capability with ownership, context, and quality.",
    metaKeywords: ["global talent outsourcing", "AI staffing", "remote teams", "offshore development", "TrivianEdge"],
    datePublished: "2024-09-28",
    dateModified: "2024-09-28",
    imageUrl: "https://www.trivianedge.com/og-image.png",
  },
  {
    id: "3",
    title: "Beyond Silicon Valley: Where the Real Tech Talent is Hiding",
    excerpt: "Top engineering talent is increasingly distributed beyond traditional tech hubs. Companies that master global integration gain better access, resilience, and speed. Read the full story.",
    content: "Top engineering talent is no longer concentrated in one region. It is increasingly distributed across strong global hubs.\n\nThat shift gives companies a strategic advantage if they build hiring and onboarding systems that work across borders.\n\nMarkets such as Vietnam and Turkey now produce high-quality technical talent with strong execution capability, especially when integrated into clear product workflows.\n\nThe real differentiator is not location. It is integration quality: role definition, communication cadence, and leadership ownership.\n\nTeams that master this model gain broader access to talent and reduce dependence on a single expensive market.",
    author: "Global Strategy Director",
    date: "Sep 15, 2024",
    readTime: "5 min read",
    category: "Global Strategy",
    imageGradient: "from-cyan-500/45 to-cyan-700/25",
    slug: "global-tech-talent-beyond-silicon-valley",
    metaDescription: "Top tech talent is global. Learn how to access emerging hubs and integrate distributed engineers for stronger execution and resilience.",
    metaKeywords: ["global tech talent", "Vietnam developers", "emerging tech hubs", "offshore engineering", "TrivianEdge global strategy"],
    datePublished: "2024-09-15",
    dateModified: "2024-09-15",
    imageUrl: "https://www.trivianedge.com/og-image.png",
  },
  {
    id: "4",
    title: "The Real Cost of a Bad Hire (And It's Not Just Money)",
    excerpt: "A bad hire costs more than recruiting spend and onboarding time. The deeper impact is team friction, reduced momentum, and hidden performance drag. Read the full story.",
    content: "A bad hire costs more than recruiting spend. It creates drag across the entire team.\n\nWhen one role is misaligned, high performers absorb extra coordination, rework, and quality recovery. That is where morale and momentum decline.\n\nThe best prevention method is a tighter selection framework. Beyond skills, evaluate collaboration style, ownership habits, and ability to operate in your real constraints.\n\nThis is especially important in remote and cross-timezone teams, where communication quality can make or break delivery.\n\nHiring accuracy is not just a talent metric. It is an operating metric.",
    author: "TrivianEdge Editorial",
    date: "Nov 05, 2024",
    readTime: "4 min read",
    category: "Hiring",
    imageGradient: "from-cyan-500/45 to-cyan-700/25",
    slug: "real-cost-of-bad-hire",
    metaDescription: "The real cost of a bad hire is team drag. Learn how to improve hiring accuracy with operational and collaboration-based evaluation.",
    metaKeywords: ["bad hire cost", "hiring mistakes", "talent acquisition", "team morale", "operational alignment"],
    datePublished: "2024-11-05",
    dateModified: "2024-11-05",
    imageUrl: "https://www.trivianedge.com/og-image.png",
  },
  {
    id: "5",
    title: "Why 'Culture Fit' is a Trap (And What to Look for Instead)",
    excerpt: "Hiring for culture fit can unintentionally reward sameness. Hiring for culture add strengthens team capability and improves decision quality over time. Read the full story.",
    content: "\"Culture fit\" sounds safe, but it can unintentionally reward sameness over capability.\n\nHigh-performing teams usually need \"culture add\": people who strengthen weak areas without breaking shared standards.\n\nThe practical question is not, \"Do they feel familiar?\" It is, \"Do they raise the team's execution quality?\"\n\nIn global teams, this matters even more. Different working styles can be a strategic advantage when expectations are explicit and communication norms are clear.\n\nHiring for culture add creates healthier debate, better decisions, and stronger long-term resilience.",
    author: "TrivianEdge Editorial",
    date: "Nov 18, 2024",
    readTime: "5 min read",
    category: "Culture",
    imageGradient: "from-cyan-500/45 to-cyan-700/25",
    slug: "culture-fit-vs-culture-add",
    metaDescription: "Culture fit can reward sameness. Learn why culture add improves team capability, decision quality, and long-term performance.",
    metaKeywords: ["culture fit vs culture add", "diversity hiring", "global team culture", "remote work culture", "team building"],
    datePublished: "2024-11-18",
    dateModified: "2024-11-18",
    imageUrl: "https://www.trivianedge.com/og-image.png",
  },
  {
    id: "6",
    title: "The Asynchronous Work Myth: Why You Still Need to Talk",
    excerpt: "Async work supports focus, but it does not fully replace live collaboration. High-performing remote teams combine async discipline with targeted synchronous conversations. Read the full story.",
    content: "Asynchronous work is powerful, especially for distributed teams. But async alone is rarely enough.\n\nWhen teams rely only on text updates, misunderstandings increase and trust grows slowly.\n\nThe best remote operating model combines both modes: async for documentation and status, sync for decisions, problem solving, and relationship health.\n\nA short live conversation can resolve friction that would otherwise take days in chat threads.\n\nThe goal is not more meetings. The goal is higher signal communication at the right moments.",
    author: "TrivianEdge Editorial",
    date: "Dec 02, 2024",
    readTime: "6 min read",
    category: "Remote Work",
    imageGradient: "from-cyan-500/45 to-cyan-700/25",
    slug: "async-work-myth-remote-teams",
    metaDescription: "Async work improves focus but cannot replace trust-building conversations. Learn how remote teams balance async execution with targeted live communication.",
    metaKeywords: ["async remote work", "remote team communication", "distributed teams", "work from home productivity", "TrivianEdge remote work"],
    datePublished: "2024-12-02",
    dateModified: "2024-12-02",
    imageUrl: "https://www.trivianedge.com/og-image.png",
  },
  {
    id: "rag-vs-fine-tuning",
    title: "RAG or Fine-Tuning: How to Actually Decide",
    excerpt: "Most AI projects reach for fine-tuning when the real problem is that the model just does not have the right information. Here is how we tell the two apart before scoping a build. Read the full story.",
    content: "Every team building an AI feature eventually hits the same fork in the road. Do you retrieve information and hand it to the model, or do you train the model itself to know more. The two options get lumped together as \"AI stuff\" in a lot of planning conversations, and that is where projects start losing months.\n\nWe have built both, and the honest answer is that most products need retrieval first, sometimes never touch fine-tuning at all, and get burned when a team defaults to fine-tuning because it sounds more impressive on a roadmap slide.\n\n## What retrieval actually solves\n\nRetrieval-augmented generation, RAG for short, means the model looks something up before it answers. You store your documents, your support tickets, your product catalog, whatever the source of truth is, as searchable chunks. When a user asks a question, the system finds the relevant chunks and feeds them to the model alongside the question.\n\nThis solves a specific problem. The model does not know your business. Today's frontier models know a huge amount about the world, but nothing about your return policy from last Tuesday or the pricing tier you added in March. Retrieval closes that gap without touching the model at all.\n\nIt is also the cheaper, faster, more reversible option. You can swap your retrieval pipeline, change your chunking strategy, or update your documents on a Tuesday afternoon. Fine-tuning a model is a bigger commitment, and undoing a bad fine-tune usually means starting over.\n\n## When fine-tuning actually earns its cost\n\nFine-tuning makes sense in a narrower set of cases than most teams assume. The two that come up most in our engagements are format consistency at volume and domain vocabulary a general model does not have.\n\nIf you need thousands of outputs a day in a very specific structure, a fine-tuned model can hit that format reliably where prompting alone starts to drift after enough edge cases. And if your data has patterns a general model consistently misreads, like legal contract clauses, medical shorthand, or internal product codenames, fine-tuning on that vocabulary can close the gap faster than trying to explain it in every prompt.\n\nNeither of those is \"we want the AI to sound more like us.\" Prompting handles tone. Fine-tuning is for behavior a prompt genuinely cannot fix.\n\nBefore choosing either, ask what is actually going wrong. If the model gives confident, wrong answers because it does not have your data, that is a retrieval problem. If the model has the right information but keeps missing your format or your domain terms, that is closer to a fine-tuning problem. Teams that skip this diagnosis end up fine-tuning a model to fix a retrieval gap, which does not work, because the model still does not have the missing information. It is just more confidently wrong, and more expensive to maintain.\n\nCost matters too, but not in the way people expect. Fine-tuning is not just training cost. It is the evaluation harness you need to catch regressions, the retraining cadence as your data changes, and the fact that a fine-tuned model is now something you own and maintain, not an API you call. Retrieval keeps that maintenance burden lower, since your knowledge base can update without retraining anything.\n\nOur default advice is to start with retrieval, always. Get the grounding right, measure where it actually falls short, and only reach for fine-tuning once you can point to a specific, recurring failure that better retrieval and better prompting cannot solve. Most projects stop needing anything more.\n\nIf you are mid-scoping an AI feature and cannot tell which side of that line you are on, that is a normal place to be. It is usually a half-hour conversation to figure out, not a six-month research project.",
    author: "AI Research Lead",
    date: "Jul 31, 2026",
    readTime: "3 min read",
    category: "AI & Tech",
    imageGradient: "from-cyan-500/45 to-cyan-700/25",
    slug: "rag-vs-fine-tuning",
    metaDescription: "RAG and fine-tuning solve different problems. A practical guide to telling them apart before you scope an AI development project.",
    metaKeywords: ["RAG vs fine-tuning", "retrieval augmented generation", "LLM fine-tuning", "AI development", "TrivianEdge AI"],
    datePublished: "2026-07-31",
    dateModified: "2026-07-31",
    imageUrl: "https://www.trivianedge.com/og-image.png",
  },
  {
    id: "bpo-vs-rpo-difference",
    title: "BPO vs. RPO: What the Difference Actually Means for Your Hiring",
    excerpt: "The two terms get used interchangeably in sales calls, and that is exactly where the confusion starts. Here is the practical test for telling them apart before you sign anything. Read the full story.",
    content: "Business Process Outsourcing and Recruitment Process Outsourcing get used interchangeably in sales calls, and that is where the confusion starts. They solve different problems, and most growing companies eventually need both.\n\n## What BPO actually covers\n\nBPO means handing an outside partner ongoing operational work: back-office admin, finance and accounting, customer support, data entry, IT helpdesk. The partner runs the function day to day. You get the output, not the headcount management.\n\n## What RPO actually covers\n\nRPO is narrower and more specific. It is about the hiring pipeline itself: sourcing, screening, interviewing, and onboarding for roles that stay on your own team once filled. An RPO partner is not doing your customer support forever. They are finding, vetting, and placing the person who will.\n\n## Where the confusion comes from\n\nThe overlap happens because both models use offshore talent, both promise cost savings, and both get pitched by generalist outsourcing vendors who blur the line to close a bigger deal. A vendor that says yes to everything is usually built deep in neither.\n\n## Why most companies need both, just not from the same place\n\nA finance team might need BPO for transaction processing and RPO for filling a controller role. Those require different skills on the vendor side: one is operational management, the other is recruiting expertise. The mistake we see most often is a company signing one contract expecting it to cover both, then discovering months in that their \"outsourcing partner\" was never actually built to run a hiring pipeline, or the reverse.\n\n## The practical test\n\nAsk what happens to the person after the engagement starts. If they join your payroll and become part of your team, you were buying RPO. If the work stays with the vendor and you never manage the individual doing it, you were buying BPO. Everything else is packaging. Our own [BPO](/services/bpo) and [RPO](/services/rpo) practices run as separate disciplines for exactly this reason, even when the same client uses both.",
    author: "TrivianEdge Editorial",
    date: "Aug 12, 2026",
    readTime: "4 min read",
    category: "Operations",
    imageGradient: "from-cyan-500/45 to-cyan-700/25",
    slug: "bpo-vs-rpo-difference",
    metaDescription: "BPO and RPO get pitched as the same thing. Learn the practical test for telling them apart and why most companies end up needing both.",
    metaKeywords: ["BPO vs RPO", "business process outsourcing", "recruitment process outsourcing", "outsourcing models", "TrivianEdge operations"],
    datePublished: "2026-08-12",
    dateModified: "2026-08-12",
    imageUrl: "https://www.trivianedge.com/og-image.png",
  },
  {
    id: "offshore-team-cost-2026",
    title: "What an Offshore Team Actually Costs in 2026",
    excerpt: "Up to 40 percent savings is true directionally, but it hides where the number actually comes from and where it quietly stops applying. Here is the real breakdown. Read the full story.",
    content: "Every cost conversation about offshore hiring starts with the same claim: up to 40 percent savings. That number is true directionally, but it hides where the savings actually come from, and where they do not.\n\n## The obvious saving: salary\n\nA mid-level software engineer in Toronto or Austin costs meaningfully more in salary alone than the same skill level in Manila, Ho Chi Minh City, or Colombo. That gap is real, and it is the number most cost calculators show. It is also the smallest part of the full picture.\n\n## The saving nobody quotes: employer overhead\n\nBenefits, payroll taxes, office space, equipment, and the HR and legal time spent on compliance in a country you do not operate in add 20 to 40 percent on top of salary for a direct hire. An offshore team built through an employer-of-record model folds all of that into one line item, and most of it disappears because you are not the one filing the paperwork.\n\n## The cost that gets ignored: management drag\n\nA team hired directly but managed badly costs more than its salary line, because existing staff spend hours untangling handoffs, chasing status updates, and redoing work that missed context. This is the cost that generic low-cost offshore providers create, because staffing without an operating system just relocates the labor, not the risk.\n\n## The real 2026 number\n\nFor a mix of back-office, support, and mid-level engineering roles sourced from Sri Lanka, the Philippines, Vietnam, Turkey, South Africa, and Costa Rica, fully loaded cost, including compliance, payroll administration, and management overhead, lands between 35 and 45 percent below the equivalent fully loaded cost of a direct North American hire. That is the range across our own engagements, not a marketing ceiling.\n\n## Where it stops being a saving\n\nIf a role requires daily real-time collaboration with almost no timezone overlap, or deep tacit knowledge that only exists in one person's head, moving it offshore without a transition plan usually costs more than it saves in year one. The savings compound after the ramp period, not before it.\n\nThe honest way to size this for your own business is to run the actual numbers against your own roles rather than a flat percentage. Our [savings calculator](/savings-calculator) does that math against real salary and overhead data instead.",
    author: "TrivianEdge Editorial",
    date: "Aug 21, 2026",
    readTime: "5 min read",
    category: "Operations",
    imageGradient: "from-cyan-500/45 to-cyan-700/25",
    slug: "offshore-team-cost-2026",
    metaDescription: "The real cost breakdown behind offshore hiring in 2026: salary, employer overhead, and management drag, and where the savings stop applying.",
    metaKeywords: ["offshore team cost", "offshore hiring 2026", "cost of outsourcing", "employer of record cost", "TrivianEdge savings"],
    datePublished: "2026-08-21",
    dateModified: "2026-08-21",
    imageUrl: "https://www.trivianedge.com/og-image.png",
  },
  {
    id: "ai-changing-what-you-outsource",
    title: "AI Is Not Replacing Outsourcing. It Is Changing What Gets Outsourced.",
    excerpt: "Tier-one support and first-draft work are shrinking as offshore categories. A different kind of work is growing to replace it, and it needs the same operational skills offshoring has always required. Read the full story.",
    content: "Every year someone predicts AI will kill outsourcing. The logic sounds reasonable: if a model can draft the email, summarize the ticket, or write the first pass of code, why pay a person to do it. The prediction keeps missing because it assumes outsourcing was only ever about cheap labor for repetitive tasks. It was not, and the work actually moving offshore right now proves it.\n\n## What AI is genuinely absorbing\n\nTier-one support responses, first-draft documentation, basic data entry, and routine QA checks are shrinking as a category of offshore work, because a model does a passable first pass on all four faster than a person can. Teams that built their entire offshore strategy on volume headcount in those categories are the ones actually feeling pressure.\n\n## What is growing instead\n\nSomeone still has to review the model's output, catch the cases where it is confidently wrong, handle the escalation the model could not resolve, and maintain the systems that keep the model grounded in current, accurate information. That work requires judgment, and judgment is exactly what offshore teams have always provided when hiring is done properly. The shift is from doing the task to supervising, correcting, and improving the system doing the task.\n\n## Where this shows up in our own engagements\n\nOur AI development work now sits next to, not instead of, our BPO and RPO lines for the same clients. A support team we staff might use an AI system to triage tickets, with the offshore team handling the fraction that need real judgment, plus the ongoing work of tuning the triage rules as new ticket types appear. That second part did not exist as a job two years ago. It exists now, and it needs the same operational skills offshore hiring has always required: attention to detail, consistency, and the ability to work inside someone else's system without constant supervision.\n\n## The practical takeaway\n\nIf an offshore strategy is still scoped around task volume, plan for that scope to shrink. If it is scoped around outcomes handled by people who can adapt to new tools, it will keep growing, just with different day-to-day work inside it. The question worth asking before the next hiring conversation is not whether AI replaces the role. It is whether the role, as currently defined, still needs to exist in its current form, or needs to be redefined around supervising and improving what the AI already does. Our [AI development](/services/ai-development) team and our staffing practice increasingly work the same engagements for exactly this reason.",
    author: "AI Research Lead",
    date: "Sep 02, 2026",
    readTime: "5 min read",
    category: "AI & Tech",
    imageGradient: "from-cyan-500/45 to-cyan-700/25",
    slug: "ai-changing-what-you-outsource",
    metaDescription: "AI is shrinking some categories of offshore work and growing others. What that actually means for how you scope an outsourcing strategy in 2026.",
    metaKeywords: ["AI and outsourcing", "future of BPO", "AI offshore teams", "outsourcing trends 2026", "TrivianEdge AI development"],
    datePublished: "2026-09-02",
    dateModified: "2026-09-02",
    imageUrl: "https://www.trivianedge.com/og-image.png",
  }
];
