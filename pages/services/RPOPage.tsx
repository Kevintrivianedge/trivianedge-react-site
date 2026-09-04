import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import RelatedLinks from '../../components/RelatedLinks';
import {
  Users,
  Target,
  Cpu,
  Clock,
  TrendingDown,
  Globe2,
  CheckCircle2,
} from 'lucide-react';
import SEOHead from '../../components/SEOHead';
import Accordion from '../../components/Accordion';
import { serviceSchema, faqSchema, breadcrumbSchema } from '../../utils/seo';

const FAQS = [
  {
    question: 'What is RPO and how does it work?',
    answer:
      'Recruitment Process Outsourcing (RPO) means TrivianEdge takes over your entire hiring function as an embedded part of your HR team. Instead of posting jobs and hoping for applications, we actively source candidates, screen them, manage the interview process, handle offers, and onboard new hires. You get a fully managed hiring desk without the cost of building one in-house.',
  },
  {
    question: 'How is RPO different from a staffing agency?',
    answer:
      'A staffing agency fills individual job orders one at a time, usually from a generic candidate pool. RPO is a strategic partnership where TrivianEdge owns your entire recruitment process end-to-end. We work within your brand, use your ATS if you have one, develop your employer value proposition, and build talent pipelines for roles you will need in 3 to 6 months. The outcome is not just filled positions — it is a better-functioning hiring function.',
  },
  {
    question: 'How quickly can TrivianEdge RPO start delivering?',
    answer:
      'We embed our RPO team and begin delivering shortlisted candidates within 30 days. The first week covers discovery and role briefing, weeks two and three cover active sourcing and screening, and by week four you are reviewing qualified candidates.',
  },
  {
    question: 'What types of roles can TrivianEdge RPO fill?',
    answer:
      'We fill both technical and non-technical roles globally. Technical: software engineers, AI/ML developers, data scientists, DevOps engineers, QA, product managers, and cloud architects. Non-technical: operations managers, finance analysts, HR professionals, sales development reps, customer success, and executive assistants.',
  },
  {
    question: 'How much does RPO cost compared to traditional recruiting?',
    answer:
      'TrivianEdge RPO typically reduces cost-per-hire by 40% compared to traditional agency recruiting and up to 60% compared to building an internal talent acquisition team from scratch. You avoid recruiter salaries, job board fees, and the overhead of managing hiring infrastructure. Contact us for a custom quote based on your volume and role mix.',
  },
  {
    question: 'How does embedded RPO work in practice?',
    answer:
      'Our RPO team integrates directly into your HR function. We attend your hiring manager meetings, use your job descriptions and communication style, represent your company to candidates, and provide weekly pipeline reports. From the candidate\'s perspective, they are interacting with your company, not a third-party firm.',
  },
  {
    question: 'Can TrivianEdge RPO hire in any country?',
    answer:
      'Yes. We source and place talent across 6 countries — the Philippines, Vietnam, Sri Lanka, Turkey, South Africa, and Costa Rica — and can manage hiring in many more markets. We handle local employment law, contracts, and payroll in each jurisdiction so you do not need a local entity.',
  },
  {
    question: "What's the difference between Full-Cycle RPO and Project RPO?",
    answer:
      'Full-Cycle RPO is an ongoing engagement where TrivianEdge runs your entire recruitment function indefinitely. Project RPO is a defined hiring burst — for example, hiring 20 engineers over 90 days for a product launch. Both models are available and can be combined based on your business needs.',
  },
  {
    question: 'Do you handle visa and work permit requirements?',
    answer:
      'For offshore placements, work permits are not required as the employees work from their home countries. TrivianEdge handles all local employment contracts and compliance. For onshore placements in Canada, the US, or the UK, we can advise on visa pathways, but candidate sponsorship depends on the client\'s situation.',
  },
  {
    question: 'How do you screen candidates before presenting them?',
    answer:
      'Every candidate goes through a structured four-stage process: initial profile review against role requirements, a skills assessment tailored to the role, a structured competency interview, and a communication and cultural fit evaluation. Only candidates who clear all four stages are presented to you.',
  },
  {
    question: 'What happens if a placed candidate does not work out?',
    answer:
      'TrivianEdge offers a replacement guarantee for every placement. If a hire leaves or underperforms within the agreed warranty period, we re-run the search at no additional cost. The exact terms depend on the engagement model and are agreed upon upfront.',
  },
  {
    question: 'Is RPO suitable for startups or only large companies?',
    answer:
      'RPO works at any scale. Startups use project-based RPO to make their first 5 to 10 critical hires without building a full internal recruiting function. Mid-market companies use full-cycle RPO to replace expensive in-house teams. Enterprises use RPO to handle overflow volume or specific geographies. TrivianEdge structures the engagement to match your stage.',
  },
];

const RPO_MODELS = [
  {
    icon: Users,
    title: 'Full-Cycle RPO',
    description:
      'End-to-end recruitment management embedded into your organization.',
    href: '/services/rpo/full-cycle-rpo',
  },
  {
    icon: Target,
    title: 'Project-Based RPO',
    description: 'Scalable hiring bursts for rapid headcount growth.',
    href: '/services/rpo/project-based-rpo',
  },
  {
    icon: Cpu,
    title: 'AI-Powered Recruitment',
    description: 'AI-driven sourcing and screening for faster, better hires.',
    href: '/services/rpo/ai-powered-recruitment',
  },
];

const STATS = [
  { value: '30 Days', label: 'Deployment' },
  { value: 'Up to 40%', label: 'Cost Reduction' },
  { value: '6', label: 'Time Zones' },
  { value: '100%', label: 'Embedded' },
];

const INDUSTRIES = [
  'Technology',
  'AI & Machine Learning',
  'Software Engineering',
  'Finance',
  'Healthcare',
  'Operations',
  'Product & Design',
  'Data Science',
];

const RPOPage: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <SEOHead
        title="RPO Services Canada | Recruitment Process Outsourcing | TrivianEdge"
        description="Scale your hiring with TrivianEdge RPO. We embed into your HR team, source top talent globally, and deliver shortlisted candidates in 30 days."
        schema={[
          serviceSchema(
            'RPO Services',
            'Recruitment Process Outsourcing',
            'https://www.trivianedge.com/services/rpo',
          ),
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: 'Home', url: 'https://www.trivianedge.com' },
            { name: 'Services', url: 'https://www.trivianedge.com/services' },
            {
              name: 'RPO Services',
              url: 'https://www.trivianedge.com/services/rpo',
            },
          ]),
        ]}
      />

      <div className="bg-background min-h-screen text-text">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-2">
          <ol className="flex items-center gap-2 text-xs text-muted">
            <li><Link to="/" className="hover:text-cyan-400 transition-colors">Home</Link></li>
            <li className="text-border">/</li>
            <li><Link to="/services" className="hover:text-cyan-400 transition-colors">Services</Link></li>
            <li className="text-border">/</li>
            <li className="text-text font-medium">RPO</li>
          </ol>
        </nav>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 0.6 }}
          className="pt-8 pb-20 px-4 md:px-6 text-center"
        >
          <div className="max-w-4xl mx-auto">
            <p className="text-xs font-mono tracking-widest uppercase text-cyan-400 mb-4">
              Recruitment Process Outsourcing
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-text mb-6 leading-tight">
              Recruitment Process Outsourcing (RPO) Services:{' '}
              <span className="text-cyan-400">Canada</span>
            </h1>

            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {[
                { icon: Clock, label: '30-Day Deployment' },
                { icon: TrendingDown, label: 'Up to 40% Cost Reduction' },
                { icon: Globe2, label: '6 Time Zones' },
                { icon: CheckCircle2, label: 'AI-Powered Hiring' },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="flex items-center gap-2 px-4 py-2 glass rounded-full border-border text-sm font-medium text-muted"
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </motion.section>

        <section className="py-20 px-4 md:px-6">
          <div className="max-w-3xl mx-auto reveal">
            <h2 className="text-3xl font-bold text-text mb-6">
              What is Recruitment Process Outsourcing?
            </h2>
            <p className="text-muted text-lg leading-relaxed">
              Recruitment Process Outsourcing (RPO) is when an external partner manages some or all of your hiring process — sourcing, screening, interviewing, and onboarding — as an extension of your team. TrivianEdge's RPO service sits inside your hiring process and does the heavy lifting, so you can hire at speed with less friction. Combine our RPO with{' '}
              <Link
                to="/services/bpo"
                className="text-cyan-400 hover:underline"
              >
                BPO services
              </Link>{' '}
              or our{' '}
              <Link
                to="/services/ai-development"
                className="text-cyan-400 hover:underline"
              >
                AI development services
              </Link>{' '}
              for a fully integrated offshore operating model.
            </p>
          </div>
        </section>

        <section className="py-20 px-4 md:px-6 bg-surface/30">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-12 text-center reveal">
              Our RPO Models
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {RPO_MODELS.map(({ icon: Icon, title, description, href }, idx) => (
                <Link
                  key={title}
                  to={href}
                  style={{ transitionDelay: `${idx * 60}ms` }}
                  className="glass rounded-2xl p-8 border-border hover:border-cyan-500/40 transition-colors group reveal"
                >
                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 w-fit mb-4">
                    <Icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="font-bold text-text text-lg mb-2 group-hover:text-cyan-400 transition-colors">
                    {title}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed">
                    {description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-12 text-center reveal">
              Why Choose TrivianEdge RPO?
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {STATS.map(({ value, label }, idx) => (
                <div
                  key={label}
                  style={{ transitionDelay: `${idx * 60}ms` }}
                  className="glass rounded-2xl p-6 border-border text-center reveal"
                >
                  <p className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">
                    {value}
                  </p>
                  <p className="text-muted text-sm font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 md:px-6 bg-surface/30">
          <div className="max-w-3xl mx-auto text-center reveal">
            <h2 className="text-3xl font-bold text-text mb-10">
              Industries We Place Talent In
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {INDUSTRIES.map(industry => (
                <span
                  key={industry}
                  className="px-4 py-2 glass rounded-full border-border text-sm font-medium text-muted"
                >
                  {industry}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 px-4 md:px-6">
          <div className="max-w-3xl mx-auto reveal">
            <h2 className="text-3xl font-bold text-text mb-4">How Our RPO Process Works</h2>
            <p className="text-muted text-lg mb-12 leading-relaxed">
              From your first conversation to your first hire, the whole process runs in about 30 days.
            </p>
            <div className="space-y-8">
              {[
                { step: '01', title: 'Role and culture briefing', desc: 'We spend time understanding what each role actually requires, what your team culture looks like, and what good looks like to you. Generic job descriptions produce generic hires — we go deeper.' },
                { step: '02', title: 'Active sourcing across 6 countries', desc: 'Our team proactively searches LinkedIn, talent networks, and our existing candidate database. We do not wait for applications — we go find the right people.' },
                { step: '03', title: 'Four-stage screening', desc: 'Profile review, skills assessment, competency interview, and communication evaluation. Every shortlisted candidate clears all four stages before you see them.' },
                { step: '04', title: 'You interview, we manage logistics', desc: 'We coordinate interviews, manage candidate communication, handle offers, and run background checks. You focus on making the decision.' },
                { step: '05', title: 'Onboarding and handover', desc: 'We handle contracts, payroll setup, and compliance documentation. Once the hire is in place, we transition ongoing HR management so your new team member feels fully set up from day one.' },
              ].map(item => (
                <div key={item.step} className="flex gap-6">
                  <div className="text-4xl font-bold text-cyan-400/30 leading-none w-12 shrink-0">{item.step}</div>
                  <div>
                    <h3 className="font-bold text-text text-lg mb-2">{item.title}</h3>
                    <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 md:px-6 bg-surface/30">
          <div className="max-w-3xl mx-auto reveal">
            <h2 className="text-3xl font-bold text-text mb-4 text-center">Frequently Asked Questions</h2>
            <p className="text-muted text-center mb-10">
              Everything you need to know about RPO and how TrivianEdge handles your hiring.
            </p>
            <Accordion items={FAQS} />
          </div>
        </section>

        <RelatedLinks
          links={[
            { label: 'RPO vs. recruitment agency', desc: 'How embedded RPO actually differs from a transactional agency search.', to: '/compare/rpo-vs-recruitment-agency' },
            { label: 'BPO', desc: 'Need an outsourced team running day to day, not just direct hires? See our BPO services.', to: '/services/bpo' },
            { label: 'AI-powered recruitment', desc: 'How TrivianEdge uses AI sourcing and screening inside the RPO process.', to: '/services/rpo/ai-powered-recruitment' },
            { label: 'RPO in Sri Lanka', desc: 'Boutique software engineering talent — one of our six sourcing hubs.', to: '/services/rpo/sri-lanka' },
            { label: 'Case studies', desc: 'See how TrivianEdge clients built teams across six talent hubs.', to: '/proof' },
            { label: 'Savings calculator', desc: 'Model the real cost-per-hire difference for your roles.', to: '/savings-calculator' },
          ]}
        />

        <section className="py-24 px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center reveal">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
              Start Hiring in 30 Days
            </h2>
            <p className="text-muted mb-8">
              Embedded talent acquisition with up to 40% lower cost-per-hire.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold premium-button"
            >
              Book a free consultation
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default RPOPage;
