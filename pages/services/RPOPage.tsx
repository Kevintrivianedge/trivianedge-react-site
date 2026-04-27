import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
    question: 'What is RPO?',
    answer:
      'Recruitment Process Outsourcing (RPO) is when TrivianEdge manages your entire hiring function as an embedded extension of your HR team — from sourcing to onboarding.',
  },
  {
    question: 'How is RPO different from a staffing agency?',
    answer:
      'RPO owns your full recruitment strategy end-to-end. A staffing agency only fills individual job orders. TrivianEdge RPO acts as your in-house talent team.',
  },
  {
    question: 'How fast can TrivianEdge RPO deploy?',
    answer:
      'We embed our RPO team and begin delivering shortlisted candidates within 30 days.',
  },
  {
    question: 'What roles can TrivianEdge RPO fill?',
    answer:
      'Software engineers, AI/ML developers, data scientists, product managers, DevOps, and operations roles globally.',
  },
  {
    question: 'How much does RPO cost?',
    answer:
      'TrivianEdge RPO reduces cost-per-hire by up to 40% compared to traditional agency recruiting. Contact us for a custom quote.',
  },
];

const RPO_MODELS = [
  {
    icon: Users,
    title: 'Full-Cycle RPO',
    description:
      'End-to-end recruitment management embedded into your organisation.',
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
  { value: '40%', label: 'Cost Reduction' },
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
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="pt-32 pb-20 px-4 md:px-6 text-center"
        >
          <div className="max-w-4xl mx-auto">
            <p className="text-xs font-mono tracking-widest uppercase text-cyan-400 mb-4">
              Recruitment Process Outsourcing
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-text mb-6 leading-tight">
              Recruitment Process Outsourcing (RPO) Services —{' '}
              <span className="text-cyan-400">Canada</span>
            </h1>

            {/* Trust bar */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {[
                { icon: Clock, label: '30-Day Deployment' },
                { icon: TrendingDown, label: '40% Cost Reduction' },
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

        {/* What is RPO */}
        <section className="py-20 px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-6">
              What is Recruitment Process Outsourcing?
            </h2>
            <p className="text-muted text-lg leading-relaxed">
              RPO services Canada businesses use to transform their talent
              acquisition by embedding TrivianEdge directly into their HR team.
              Unlike a traditional recruiter, we own your entire hiring process
              — from sourcing strategy and candidate screening to offer
              management and onboarding. This enables faster hiring, lower
              cost-per-hire, and access to global talent across technology,
              finance, and AI roles. Combine our RPO with{' '}
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

        {/* RPO Models */}
        <section className="py-20 px-4 md:px-6 bg-surface/30">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-12 text-center">
              Our RPO Models
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {RPO_MODELS.map(({ icon: Icon, title, description, href }) => (
                <Link
                  key={title}
                  to={href}
                  className="glass rounded-2xl p-8 border-border hover:border-cyan-500/40 transition-colors group"
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

        {/* Stats */}
        <section className="py-20 px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-12 text-center">
              Why Choose TrivianEdge RPO?
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {STATS.map(({ value, label }) => (
                <div
                  key={label}
                  className="glass rounded-2xl p-6 border-border text-center"
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

        {/* Industries */}
        <section className="py-20 px-4 md:px-6 bg-surface/30">
          <div className="max-w-3xl mx-auto text-center">
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

        {/* FAQ */}
        <section className="py-20 px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-10 text-center">
              Frequently Asked Questions
            </h2>
            <Accordion items={FAQS} />
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
              Start Hiring in 30 Days
            </h2>
            <p className="text-muted mb-8">
              Embedded talent acquisition with up to 40% lower cost-per-hire.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-background font-bold rounded-full transition-colors"
            >
              Book a Free Consultation
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default RPOPage;
