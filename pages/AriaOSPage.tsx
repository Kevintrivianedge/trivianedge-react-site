import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Sparkles,
  ShieldCheck,
  Users2,
  Wallet,
  ClipboardCheck,
  Globe2,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import SEOHead from '../components/SEOHead';
import Accordion from '../components/Accordion';
import RelatedLinks from '../components/RelatedLinks';
import { faqSchema, breadcrumbSchema } from '../utils/seo';

const ARIA_URL = 'https://trivian-aria.com';

const FAQS = [
  {
    question: 'What is Aria OS?',
    answer:
      'Aria OS is the autonomous workforce operating system built by TrivianEdge. It runs hiring, onboarding, payroll, leave, compliance, and performance for global teams through a single AI core called Aria, replacing fragmented HRIS, payroll, and ATS tools with one system of record.',
  },
  {
    question: 'How much does Aria OS cost?',
    answer:
      'Aria OS is free forever for the first 10 employees, full product included. Beyond 10 employees it is USD $2.50 per active employee per month in Sri Lanka, CAD $5.99 in Canada, and USD $5.99 in the United States, billed monthly or annually (annual billing is roughly 17% cheaper). Enterprise plans with SAML SSO, SCIM, and data residency are quoted on request.',
  },
  {
    question: 'How is Aria OS different from Rippling, Deel, or Gusto?',
    answer:
      'Traditional HR platforms are forms-and-dashboards tools you operate manually. Aria OS is autonomous: you talk to Aria and she prepares and executes the work directly against your live employee record. Consequential actions like releasing payroll or changing access still require human approval, and every action is audit-logged.',
  },
  {
    question: 'Which countries does Aria OS support for payroll?',
    answer:
      'Aria OS runs statutory payroll for Sri Lanka (EPF, ETF, PAYE), Canada (CPP, EI, and provincial rules), and the United States (FICA, federal and state withholding, 401(k), Forms 941/940/W-2).',
  },
  {
    question: 'Is Aria OS built by TrivianEdge?',
    answer:
      'Yes. Aria OS is a product built and operated by TrivianEdge, the same company behind TrivianEdge\'s BPO, offshore software development, and global talent services. It runs as a separate production SaaS application at trivian-aria.com.',
  },
  {
    question: 'Does Aria train on my company data?',
    answer:
      'No. Employee records stay inside your workspace and are not used to train models for other customers.',
  },
];

const CAPABILITIES = [
  { icon: Users2, title: 'Hiring & onboarding', desc: 'Aria screens candidates, drafts job descriptions, and prepares new-hire onboarding from a single conversation.' },
  { icon: Wallet, title: 'Payroll, run correctly', desc: 'Statutory payroll for Sri Lanka, Canada, and the United States — EPF/ETF/PAYE, CPP/EI, FICA and withholding, all prepared for your approval.' },
  { icon: ClipboardCheck, title: 'Leave & compliance', desc: 'Leave requests, approvals, and compliance tracking live in the same record as payroll, so the numbers always agree.' },
  { icon: ShieldCheck, title: 'Human approval, always', desc: 'Aria prepares the work. Consequential actions — payroll release, access changes — require a human to approve, and every action is logged for audit.' },
];

const AriaOSPage: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <SEOHead
        title="Aria OS | Autonomous Workforce Operating System by TrivianEdge"
        description="Aria OS by TrivianEdge is the autonomous workforce OS for hiring, payroll, compliance, and performance. Free for the first 10 employees. Live in Sri Lanka, Canada, and the US."
        keywords="Aria OS, TrivianEdge Aria, autonomous workforce OS, AI HR software, AI payroll software, HRIS alternative, autonomous HR platform"
        schema={[
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Aria OS',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            description:
              'The autonomous workforce operating system by TrivianEdge — hiring, payroll, compliance and performance, run by a single AI core.',
            url: ARIA_URL,
            creator: {
              '@type': 'Organization',
              '@id': 'https://www.trivianedge.com/#organization',
              name: 'TrivianEdge',
            },
            offers: [
              { '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'USD', description: 'Free forever for the first 10 employees' },
              { '@type': 'Offer', name: 'Aria', price: '2.50', priceCurrency: 'USD', description: 'Per active employee, per month, beyond 10 employees (Sri Lanka pricing; CAD $5.99 in Canada, USD $5.99 in the US)' },
            ],
          },
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: 'Home', url: 'https://www.trivianedge.com' },
            { name: 'Aria OS', url: 'https://www.trivianedge.com/ai-ventures/aria' },
          ]),
        ]}
      />

      <div className="bg-background min-h-screen text-text">
        <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-2">
          <ol className="flex items-center gap-2 text-xs text-muted">
            <li><Link to="/" className="hover:text-cyan-400 transition-colors">Home</Link></li>
            <li className="text-border">/</li>
            <li className="text-text font-medium">Aria OS</li>
          </ol>
        </nav>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 0.6 }}
          className="pt-8 pb-20 px-4 md:px-6 text-center"
        >
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-6">
              <Sparkles className="w-3 h-3" />
              A TrivianEdge AI Venture
            </div>
            <h1 className="display-hero text-5xl md:text-7xl font-bold text-text mb-6 leading-tight">
              Aria OS: the{' '}
              <span className="text-holo">autonomous workforce operating system</span>
            </h1>
            <p className="text-muted text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Hiring, payroll, leave, compliance, and performance — run by one AI core, Aria, instead of a stack of disconnected HR tools. Built by TrivianEdge, live today for teams in Sri Lanka, Canada, and the United States.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {[
                { icon: CheckCircle2, label: 'Free for 10 employees' },
                { icon: ShieldCheck, label: 'Human approval on every action' },
                { icon: Globe2, label: 'Sri Lanka · Canada · US payroll' },
              ].map(({ icon: Icon, label }) => (
                <span key={label} className="flex items-center gap-2 px-4 py-2 glass rounded-full border-border text-sm font-medium text-muted">
                  <Icon className="w-4 h-4 text-cyan-400" />
                  {label}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <a
                href={ARIA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold premium-button micro-press-button"
              >
                Visit Aria OS
                <ExternalLink className="w-4 h-4" />
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold border border-border text-text"
              >
                Talk to TrivianEdge
              </Link>
            </div>
          </div>
        </motion.section>

        <section className="py-20 px-4 md:px-6 bg-surface/30">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-4 text-center reveal">What Aria OS runs for you</h2>
            <p className="text-muted text-center max-w-2xl mx-auto mb-12 reveal">
              One system of record instead of a fragmented HRIS, payroll tool, and ATS that never agree with each other.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CAPABILITIES.map(({ icon: Icon, title, desc }, idx) => (
                <div
                  key={title}
                  style={{ transitionDelay: `${idx * 60}ms` }}
                  className="glass rounded-2xl p-6 border-border reveal"
                >
                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 w-fit mb-4">
                    <Icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="font-bold text-text mb-2">{title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 md:px-6">
          <div className="max-w-3xl mx-auto reveal">
            <h2 className="text-3xl font-bold text-text mb-6">Pricing</h2>
            <p className="text-muted text-lg leading-relaxed mb-6">
              Aria OS is free forever for the first 10 employees, full product included. Beyond 10 employees, pricing is per active employee per month: <strong className="text-text">USD $2.50</strong> in Sri Lanka, <strong className="text-text">CAD $5.99</strong> in Canada, and <strong className="text-text">USD $5.99</strong> in the United States. Annual billing runs roughly 17% cheaper than monthly. Enterprise plans — SAML SSO, SCIM, a signed DPA, and data residency — are quoted on request.
            </p>
            <a href={`${ARIA_URL}/pricing`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-cyan-400 font-semibold hover:underline">
              See full pricing on Aria OS <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </section>

        <section className="py-20 px-4 md:px-6 bg-surface/30">
          <div className="max-w-3xl mx-auto reveal">
            <h2 className="text-3xl font-bold text-text mb-6">How Aria OS relates to TrivianEdge</h2>
            <p className="text-muted text-lg leading-relaxed">
              Aria OS is built and operated by TrivianEdge — the same team behind{' '}
              <Link to="/services/bpo" className="text-cyan-400 hover:underline">BPO</Link>,{' '}
              <Link to="/services/rpo" className="text-cyan-400 hover:underline">recruitment process outsourcing</Link>, and{' '}
              <Link to="/services/ai-development" className="text-cyan-400 hover:underline">AI development services</Link>. Where TrivianEdge staffs and manages your offshore team, Aria OS is the software that runs the HR, payroll, and compliance work behind any workforce — TrivianEdge-sourced or not. It ships as a standalone production application at{' '}
              <a href={ARIA_URL} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">trivian-aria.com</a>.
            </p>
          </div>
        </section>

        <section className="py-20 px-4 md:px-6">
          <div className="max-w-3xl mx-auto reveal">
            <h2 className="text-3xl font-bold text-text mb-4 text-center">Frequently Asked Questions</h2>
            <p className="text-muted text-center mb-10">Everything you need to know about Aria OS.</p>
            <Accordion items={FAQS} />
          </div>
        </section>

        <RelatedLinks
          links={[
            { label: 'BPO services', desc: 'TrivianEdge-managed offshore teams for back-office and support functions.', to: '/services/bpo' },
            { label: 'RPO', desc: 'Recruitment process outsourcing to hire direct employees.', to: '/services/rpo' },
            { label: 'AI development', desc: 'Custom AI products and automation built by TrivianEdge engineers.', to: '/services/ai-development' },
            { label: 'About TrivianEdge', desc: 'The company behind Aria OS and TrivianEdge\'s outsourcing services.', to: '/about' },
          ]}
        />

        <section className="py-24 px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center reveal">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">Run your workforce on Aria OS</h2>
            <p className="text-muted mb-8">Free for the first 10 employees. No implementation project, no forms-and-dashboards setup.</p>
            <a
              href={ARIA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold premium-button micro-press-button"
            >
              Get started with Aria OS
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </section>
      </div>
    </>
  );
};

export default AriaOSPage;
