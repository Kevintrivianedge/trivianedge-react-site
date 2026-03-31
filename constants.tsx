
import React from 'react';
import { 
  Cpu, 
  Globe, 
  Zap, 
  Target, 
  ShieldCheck, 
  BarChart4, 
  Layers,
  Users,
  Briefcase,
  TrendingUp,
  Search,
  MessageSquare,
  Network
} from 'lucide-react';
import { ServiceCardProps, RoleCategory, Step, WhyUsItem, BlogPost, TalentHub } from './types';

export const NAV_LINKS = [
  { name: 'Talent Hubs', href: '#talent-hubs' },
  { name: 'Roles', href: '#roles' },
  { name: 'Process', href: '#process' },
  { name: 'Aria', href: '#aria' },
  { name: 'Blog', href: '#blog' },
];

export const SERVICES: ServiceCardProps[] = [
  {
    title: "Global Talent & Remote Workforce Solutions",
    description: "TrivianEdge architecturally aligns global talent acquisition with your operational goals. We go beyond traditional outsourcing by providing Recruitment-as-a-Service for both technical and non-technical roles, ensuring your distributed teams are culturally and operationally integrated.",
    icon: <Users className="w-8 h-8 text-cyan-400" />,
    tags: ["Technical Recruiting", "Non-Tech Staffing", "Embedded Teams"],
    features: [
      "Technical Talent Sourcing (Devs, DevOps, AI)",
      "Non-Technical Staffing (Ops, Finance, Admin)",
      "Recruitment-as-a-Service Model",
      "Offshore Workforce Scaling"
    ],
    outcomes: [
      "40% Workforce Cost Reduction",
      "2.4x Faster Time-to-Hire"
    ]
  },
  {
    title: "Managed Technical & IT Services",
    description: "Enterprise-grade reliability for distributed organizations. TrivianEdge Managed IT Services provide comprehensive cloud infrastructure management and cybersecurity compliance support (SOC 2, ISO 27001), ensuring your remote operations are secure and scalable.",
    icon: <ShieldCheck className="w-8 h-8 text-violet-400" />,
    tags: ["Cybersecurity", "DevOps", "Cloud Ops"],
    features: [
      "24/7 Security Monitoring & SOC 2 Readiness",
      "Cloud Infrastructure Management",
      "DevOps & CI/CD Pipeline Services",
      "IT Support Outsourcing"
    ],
    outcomes: [
      "99.99% Infrastructure Uptime",
      "Zero Compliance Gaps"
    ]
  },
  {
    title: "AI & Business Process Automation",
    description: "Accelerate operational efficiency with TrivianEdge AI solutions. We implement intelligent process automation and custom LLM integrations to replace manual workflows, allowing your human talent to focus on high-value strategy.",
    icon: <Cpu className="w-8 h-8 text-magenta-400" />,
    tags: ["AI Implementation", "Workflow Auto", "LLM Integration"],
    features: [
      "Intelligent Process Automation (IPA)",
      "Custom LLM Integration & Training",
      "Workflow Automation Consulting",
      "Data-Driven Operational Optimization"
    ],
    outcomes: [
      "60% Reduction in Manual Tasks",
      "Scalable Operational Architecture"
    ]
  },
  {
    title: "Remote Operations & Workforce Architecture",
    description: "The blueprint for distributed success. We design the KPI frameworks, SLA governance, and cross-border operational structures that allow remote teams to function as a cohesive, high-performance unit.",
    icon: <Layers className="w-8 h-8 text-emerald-400" />,
    tags: ["Ops Consulting", "KPI Design", "Team Structure"],
    features: [
      "Global Team Structuring & Design",
      "KPI Framework & SLA Governance",
      "Remote Workforce Management",
      "Cross-Border Ops Consulting"
    ],
    outcomes: [
      "Seamless Distributed Alignment",
      "Predictable Execution Standards"
    ]
  },
  {
    title: "Finance & Back-Office Managed Services",
    description: "Scalable financial operations for growing enterprises. TrivianEdge provides dedicated remote accounting teams, virtual CFO services, and back-office support to ensure your financial infrastructure scales as fast as your revenue.",
    icon: <BarChart4 className="w-8 h-8 text-orange-400" />,
    tags: ["Virtual CFO", "Accounting", "Back-Office"],
    features: [
      "Finance & Accounting Outsourcing",
      "Virtual CFO & Financial Reporting",
      "Payroll Processing & AR/AP Management",
      "Back-Office Ops Outsourcing"
    ],
    outcomes: [
      "Audit-Ready Financials",
      "30% Reduction in Admin Overhead"
    ]
  }
];

export const TALENT_HUBS: TalentHub[] = [
  {
    id: "lka",
    country: "Sri Lanka",
    flag: "🇱🇰",
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

export const WHY_US: WhyUsItem[] = [
  {
    title: "Built by Operators",
    description: "We aren't just recruiters. We are veterans of IT, Finance, and Healthcare who know what delivery actually looks like.",
    icon: <Target className="w-6 h-6 text-cyan-400" />
  },
  {
    title: "AI-Driven Matching",
    description: "Our proprietary algorithms analyze operational compatibility, not just keywords on a resume.",
    icon: <Zap className="w-6 h-6 text-blue-400" />
  },
  {
    title: "Global Talent Without Chaos",
    description: "Structured talent pipelines that integrate seamlessly into your existing workflows from day one.",
    icon: <Globe className="w-6 h-6 text-emerald-400" />
  },
  {
    title: "Cost Efficiency",
    description: "Save up to 40% on labor costs without compromising on technical quality or communication standards.",
    icon: <BarChart4 className="w-6 h-6 text-orange-400" />
  },
  {
    title: "Structured Delivery",
    description: "We implement SLA governance and KPI frameworks to ensure your remote team performs like a local unit.",
    icon: <Layers className="w-6 h-6 text-magenta-400" />
  },
  {
    title: "Designed for Scale",
    description: "Whether you need a single engineer or a 50-person ops department, our process is built for speed.",
    icon: <TrendingUp className="w-6 h-6 text-violet-400" />
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
    gradient: "from-violet-500/20 to-magenta-500/20",
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
    title: "Discovery & Blueprint",
    description: "We analyze your execution bottlenecks and operational language to define the exact profile required.",
    icon: <Search className="w-6 h-6 text-cyan-400" />
  },
  {
    number: "02",
    title: "AI-Powered Sourcing",
    description: "Our engine scans global hubs (Philippines, Vietnam, Turkey, etc.) to find the top match.",
    icon: <Globe className="w-6 h-6 text-violet-400" />
  },
  {
    number: "03",
    title: "Deployment & Sync",
    description: "Rapid onboarding and integration into your tech stack and communication channels.",
    icon: <Zap className="w-6 h-6 text-magenta-400" />
  },
  {
    number: "04",
    title: "Continuous Evolution",
    description: "Ongoing performance tracking and scaling as your business demands growth.",
    icon: <TrendingUp className="w-6 h-6 text-emerald-400" />
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "Why HR and Ops Are Always Arguing (And How to Fix It)",
    excerpt: "HR wants a perfect resume; Ops wants someone who can actually do the job. Here's why this disconnect is killing your scale-up.",
    content: "If you've ever sat in a hiring meeting at a fast-growing tech company, you've probably witnessed the classic standoff. HR is thrilled because they found a candidate with a degree from a top-tier university and a resume full of buzzwords. Meanwhile, the Operations lead is pulling their hair out because the candidate couldn't explain how they'd actually solve a real-world deployment issue.\n\nIt's a tale as old as time: HR speaks the language of pedigree and 'culture fit,' while Ops speaks the language of execution and targets. When these two departments aren't on the same page, you end up hiring people who look great on paper but stumble when it's time to actually deliver.\n\nI've seen this happen so many times. A company hires a brilliant engineer who simply cannot adapt to the chaotic, fast-paced reality of a startup. It's not that they aren't smart; it's just that they were hired for their background, not their operational readiness.\n\nAt TrivianEdge, we realized that the only way to fix this is to change the conversation. We have to stop translating between HR and Ops and start using a shared language—the language of delivery. Instead of asking 'Where did they work before?', we need to ask 'Can they execute this specific project under these specific constraints?' When you align your hiring process with your actual operational goals, everything changes. You hire faster, onboard smoother, and actually hit those growth milestones you promised your investors.",
    author: "TrivianEdge Editorial",
    date: "Oct 12, 2024",
    readTime: "6 min read",
    category: "Operations",
    imageGradient: "from-cyan-500/20 to-blue-500/20",
    slug: "hr-ops-alignment-guide",
    metaDescription: "HR wants a perfect resume; Ops wants execution. Learn why this disconnect kills scale-ups and how TrivianEdge solves the HR-Ops language gap.",
    metaKeywords: ["HR operations alignment", "hiring strategy", "operational staffing", "remote team management", "TrivianEdge"],
    datePublished: "2024-10-12",
    dateModified: "2024-10-12",
    imageUrl: "https://www.trivianedge.com/og-image.jpg",
  },
  {
    id: "2",
    title: "Why 'Body Shopping' is Dead (And What's Replacing It)",
    excerpt: "The old model of outsourcing was just about filling seats with cheap labor. Today, it's about building autonomous, high-performing global teams.",
    content: "Let's be real: traditional outsourcing has a terrible reputation, and honestly, it deserves it. For decades, the industry was built on the 'body shopping' model. You needed 10 developers, an agency found 10 warm bodies in a low-cost region, and you spent the next six months micromanaging them because the quality was, well, questionable.\n\nIt was a race to the bottom, focused entirely on cost rather than value. But the game has fundamentally changed.\n\nToday, the best companies aren't looking for cheap labor; they're looking for global talent. They realize that a brilliant engineer in Buenos Aires or Ho Chi Minh City can deliver just as much value as someone in San Francisco, provided they are integrated properly into the team.\n\nWe're moving away from treating offshore teams as order-takers and starting to treat them as autonomous partners. This means giving them the context, the tools, and the trust to actually own their work. It's not about outsourcing a task; it's about distributing your capabilities.\n\nThis shift is huge. When you stop micromanaging hours and start managing outcomes, you unlock a level of speed and innovation that the old body-shopping model could never touch. It takes more effort upfront to build this kind of trust and alignment, but the payoff is a resilient, global team that actually drives your business forward.",
    author: "AI Research Lead",
    date: "Sep 28, 2024",
    readTime: "8 min read",
    category: "AI & Tech",
    imageGradient: "from-violet-500/20 to-magenta-500/20",
    slug: "end-of-body-shopping-global-talent",
    metaDescription: "Traditional outsourcing body shopping is dead. Discover what's replacing it: autonomous global talent pipelines that actually deliver results.",
    metaKeywords: ["global talent outsourcing", "AI staffing", "remote teams", "offshore development", "TrivianEdge"],
    datePublished: "2024-09-28",
    dateModified: "2024-09-28",
    imageUrl: "https://www.trivianedge.com/og-image.jpg",
  },
  {
    id: "3",
    title: "Beyond Silicon Valley: Where the Real Tech Talent is Hiding",
    excerpt: "Silicon Valley might have the venture capital, but the next generation of top-tier engineering talent is emerging in places you might not expect.",
    content: "If you ask the average person where the best software engineers live, they'll probably say Silicon Valley, maybe Seattle or New York. And sure, there's incredible talent there. But if you're only looking in the usual tech hubs, you are missing out on a massive, global shift.\n\nThe truth is, the actual muscle of software engineering is becoming incredibly distributed. We're seeing absolute powerhouse talent emerging from regions that weren't even on the radar a decade ago.\n\nTake Vietnam, for example. There's a generation of developers there who grew up with a heavy focus on STEM education and are now cutting their teeth in a wildly fast-paced startup ecosystem. They aren't just good coders; they are incredibly scrappy and adaptive. Or look at Turkey—it's become this amazing bridge between European business culture and deep technical expertise, producing engineers who are fantastic at tackling complex, messy operational challenges.\n\nI was talking to a CTO recently who was struggling to hire locally. We helped him build a small team in Istanbul, and he was blown away. Not just by their technical chops, but by their work ethic and how quickly they integrated with his core team.\n\nThe companies that win in the next decade won't be the ones fighting over the same expensive talent in San Francisco. They'll be the ones who figure out how to tap into these emerging global hubs and build truly borderless teams.",
    author: "Global Strategy Director",
    date: "Sep 15, 2024",
    readTime: "5 min read",
    category: "Global Strategy",
    imageGradient: "from-emerald-500/20 to-teal-500/20",
    slug: "global-tech-talent-beyond-silicon-valley",
    metaDescription: "The best engineering talent isn't all in Silicon Valley. Discover emerging global tech hubs in Vietnam, Turkey, and beyond with TrivianEdge.",
    metaKeywords: ["global tech talent", "Vietnam developers", "emerging tech hubs", "offshore engineering", "TrivianEdge global strategy"],
    datePublished: "2024-09-15",
    dateModified: "2024-09-15",
    imageUrl: "https://www.trivianedge.com/og-image.jpg",
  },
  {
    id: "4",
    title: "The Real Cost of a Bad Hire (And It's Not Just Money)",
    excerpt: "We all know bad hires are expensive. But the real damage? It's the silent toll it takes on your team's morale and momentum.",
    content: "Let's be honest for a second. We've all been there. You're desperate to fill a role, the candidate looks great on paper, and they nailed the interview. Fast forward three months, and you're spending more time managing their mistakes than actually doing your own job.\n\nSure, the financial cost of a bad hire is painful—recruiting fees, onboarding time, severance. But that's just the tip of the iceberg. The real damage is the silent, creeping toll it takes on your best people. When a high performer has to constantly pick up the slack for someone who just isn't getting it, resentment builds. Fast. Suddenly, your top engineers are burning out, not because of the workload, but because of the friction.\n\nI remember talking to a founder last year who almost lost his entire core engineering team because of one toxic senior hire. It took them six months to recover their momentum after letting the person go.\n\nSo, how do we fix this? It starts with looking beyond the resume. Skills can be taught, but alignment—how someone communicates, how they handle failure, how they collaborate—is much harder to train. At TrivianEdge, we've started incorporating behavioral and operational alignment checks early in the process. It's not foolproof, but it catches the red flags that a standard technical interview usually misses. Because at the end of the day, you're not just hiring a set of skills; you're adding a new dynamic to your team's ecosystem.",
    author: "Sarah Jenkins",
    date: "Nov 05, 2024",
    readTime: "4 min read",
    category: "Hiring",
    imageGradient: "from-orange-500/20 to-red-500/20",
    slug: "real-cost-of-bad-hire",
    metaDescription: "A bad hire costs more than money. Learn how poor hiring decisions silently destroy team morale and momentum — and how to prevent it.",
    metaKeywords: ["bad hire cost", "hiring mistakes", "talent acquisition", "team morale", "operational alignment"],
    datePublished: "2024-11-05",
    dateModified: "2024-11-05",
    imageUrl: "https://www.trivianedge.com/og-image.jpg",
  },
  {
    id: "5",
    title: "Why 'Culture Fit' is a Trap (And What to Look for Instead)",
    excerpt: "Hiring for 'culture fit' often just means hiring people exactly like you. Here's why you should be hiring for 'culture add' instead.",
    content: "For years, 'culture fit' was the golden rule of hiring. If someone didn't pass the proverbial 'beer test' (would you want to grab a beer with them after work?), they didn't get the job. But here's the uncomfortable truth: hiring for culture fit is often just a polite way of saying 'we only hire people who look, think, and act exactly like us.'\n\nWhen you build a team of clones, you create an echo chamber. Everyone agrees on the strategy, everyone laughs at the same jokes, and nobody challenges the status quo. It feels great—until you hit a complex problem that requires a totally different perspective, and your team is completely paralyzed.\n\nInstead of looking for a culture fit, we need to start looking for a 'culture add.' What is your team currently missing? Do you have too many big-picture thinkers and not enough detail-oriented executors? Do you have a team of optimists who need a healthy dose of pragmatism?\n\nI recently worked with a startup that was struggling to launch their product. Their engineering team was brilliant but chaotic. They didn't need another rockstar coder; they needed someone who loved documentation and process. They hired a project manager who was the complete opposite of their typical 'culture fit'—she was quiet, methodical, and strictly 9-to-5. Within a month, she had the team running like a well-oiled machine.\n\nWhen you hire globally, this becomes even more important. Embracing different working styles, communication norms, and problem-solving approaches isn't just a nice-to-have; it's a competitive advantage. So next time you're interviewing, don't ask yourself if the candidate fits in. Ask yourself what they bring that you don't already have.",
    author: "Marcus Chen",
    date: "Nov 18, 2024",
    readTime: "5 min read",
    category: "Culture",
    imageGradient: "from-yellow-500/20 to-amber-500/20",
    slug: "culture-fit-vs-culture-add",
    metaDescription: "Culture fit hiring creates echo chambers. Learn why culture add is the smarter strategy for building diverse, high-performing global teams.",
    metaKeywords: ["culture fit vs culture add", "diversity hiring", "global team culture", "remote work culture", "team building"],
    datePublished: "2024-11-18",
    dateModified: "2024-11-18",
    imageUrl: "https://www.trivianedge.com/og-image.jpg",
  },
  {
    id: "6",
    title: "The Asynchronous Work Myth: Why You Still Need to Talk",
    excerpt: "Async work is great for deep focus, but it's terrible for building trust. Here's how to strike the right balance in a remote team.",
    content: "If you read enough tech blogs, you might start to believe that asynchronous work is the holy grail of productivity. Just write everything down in a Notion doc, assign a Jira ticket, and let your team work in blissful, uninterrupted silence. No meetings, no Slack pings, just pure deep work.\n\nIt sounds amazing in theory. In practice? It can be incredibly lonely and surprisingly inefficient.\n\nDon't get me wrong, I love async work. It's essential for getting complex tasks done, especially when your team is spread across three different time zones. But we've swung the pendulum too far. We've forgotten that humans are social creatures, and trust isn't built in a Google Doc comment thread.\n\nThink about the last time you had a misunderstanding over text or email. A slightly blunt message can spiral into a days-long passive-aggressive standoff. If you had just hopped on a quick five-minute call, you would have heard the tone of their voice, realized they were just stressed about a deadline, and resolved the issue instantly.\n\nIn our rush to optimize every minute of the workday, we've optimized out the human connection. At TrivianEdge, we've found that the most successful remote teams don't eliminate meetings; they just make them count. We use async for status updates and information sharing, but we mandate synchronous time for brainstorming, complex problem-solving, and—most importantly—just hanging out.\n\nYou don't need to go back to back-to-back Zoom calls. But if you haven't actually spoken to your lead developer in two weeks, it might be time to schedule a quick coffee chat. Trust me, it's worth the interruption.",
    author: "Elena Rodriguez",
    date: "Dec 02, 2024",
    readTime: "6 min read",
    category: "Remote Work",
    imageGradient: "from-pink-500/20 to-rose-500/20",
    slug: "async-work-myth-remote-teams",
    metaDescription: "Async work doesn't replace human connection. Learn how the most successful remote teams balance async productivity with essential synchronous communication.",
    metaKeywords: ["async remote work", "remote team communication", "distributed teams", "work from home productivity", "TrivianEdge remote work"],
    datePublished: "2024-12-02",
    dateModified: "2024-12-02",
    imageUrl: "https://www.trivianedge.com/og-image.jpg",
  }
];
