import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Cpu,
  Search,
  ListChecks,
  UserCheck,
  Clock,
  TrendingDown,
  Globe2,
  CheckCircle2,
} from 'lucide-react';
import SEOHead from '../../../components/SEOHead';
import Accordion from '../../../components/Accordion';
import { serviceSchema, faqSchema, breadcrumbSchema } from '../../../utils/seo';

const FAQS = [
  {
    question: 'What does "AI-powered recruitment" mean at TrivianEdge?',
    answer:
      'We use AI tools to speed up the parts of recruiting that are repetitive and time-consuming — sourcing candidates across large talent pools, matching resumes against role requirements, and running initial skills screening. Every candidate who reaches your team has been reviewed and approved by a human recruiter first. AI narrows the pool faster; it does not make hiring decisions.',
  },
  {
    question: 'Where exactly is AI used in the hiring process?',
    answer:
      'AI supports three stages: sourcing (identifying and ranking candidates from our talent network against your role requirements), initial screening (structured skills assessments and resume-to-role matching), and scheduling (coordinating interviews across time zones). Interviews, judgment calls, and final shortlisting are handled by our recruiters.',
  },
  {
    question: 'Does AI ever reject a candidate automatically?',
    answer:
      'No. AI tools help prioritize and rank candidates, but a human recruiter reviews every profile before anyone is filtered out. We don\'t use fully automated rejection, since that carries real fairness and quality risks we\'re not willing to take with your hiring.',
  },
  {
    question: 'How much faster is AI-powered sourcing compared to manual search?',
    answer:
      'For high-volume roles, AI-assisted sourcing typically cuts the time to build an initial qualified candidate pool by more than half compared to fully manual search, because it can screen far more profiles against your specific requirements in the same amount of time. That time saving is passed through as a faster time-to-shortlist for you.',
  },
  {
    question: 'Is AI-powered recruitment more expensive than standard RPO?',
    answer:
      'No — it\'s included as part of how TrivianEdge delivers both Full-Cycle and Project-Based RPO, not a separate paid add-on. It\'s a tool our recruiters use, not a different service tier.',
  },
  {
    question: 'What roles benefit most from AI-assisted sourcing?',
    answer:
      'High-volume and technical roles benefit the most, since AI matching is strongest when there\'s a large, well-defined candidate pool to search — software engineers, data roles, customer support, and operations positions are common examples. For highly specialized executive searches, our recruiters lean more heavily on direct outreach and referral networks.',
  },
  {
    question: 'How do you handle candidate data and privacy with AI tools?',
    answer:
      'Candidate data is only used for matching and screening against the roles you\'ve engaged us to fill, and is handled under the same compliance posture — PIPEDA and GDPR-aligned — that covers the rest of our operations. See our Trust page for details on our data-handling practices.',
  },
];

const AI_STAGES = [
  { icon: Search, label: 'AI-Assisted Sourcing' },
  { icon: ListChecks, label: 'Automated Skills Matching' },
  { icon: UserCheck, label: 'Human-Reviewed Screening' },
  { icon: Cpu, label: 'Smart Interview Scheduling' },
];

const STATS = [
  { value: '2x+', label: 'Faster Initial Sourcing' },
  { value: '100%', label: 'Human-Reviewed Shortlists' },
  { value: '6', label: 'Sourcing Countries' },
  { value: '0', label: 'Automated Rejections' },
];

const AIPoweredRecruitmentPage: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <SEOHead
        title="AI-Powered Recruitment Services | AI Sourcing & Screening | TrivianEdge"
        description="TrivianEdge combines AI-driven sourcing, matching, and screening with human recruiters to cut time-to-shortlist without handing hiring decisions to a black box."
        schema={[
          serviceSchema(
            'AI-Powered Recruitment',
            'Recruitment Process Outsourcing',
            'https://www.trivianedge.com/services/rpo/ai-powered-recruitment',
          ),
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: 'Home', url: 'https://www.trivianedge.com' },
            { name: 'Services', url: 'https://www.trivianedge.com/services' },
            { name: 'RPO Services', url: 'https://www.trivianedge.com/services/rpo' },
            {
              name: 'AI-Powered Recruitment',
              url: 'https://www.trivianedge.com/services/rpo/ai-powered-recruitment',
            },
          ]),
        ]}
      />

      <div className="bg-background min-h-screen text-text">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-2">
          <ol className="flex items-center gap-2 text-xs text-muted flex-wrap">
            <li><Link to="/" className="hover:text-cyan-400 transition-colors">Home</Link></li>
            <li className="text-border">/</li>
            <li><Link to="/services" className="hover:text-cyan-400 transition-colors">Services</Link></li>
            <li className="text-border">/</li>
            <li><Link to="/services/rpo" className="hover:text-cyan-400 transition-colors">RPO</Link></li>
            <li className="text-border">/</li>
            <li className="text-text font-medium">AI-Powered Recruitment</li>
          </ol>
        </nav>

        {/* Hero */}
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
              AI-Powered Recruitment:{' '}
              <span className="text-cyan-400">Faster Sourcing, Sharper Screening</span>
            </h1>
            <p className="text-muted text-lg max-w-2xl mx-auto mb-8">
              AI narrows the candidate pool faster than manual search alone. Our recruiters still
              make every judgment call — nobody is filtered out or hired by an algorithm.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {[
                { icon: Clock, label: 'Faster Time-to-Shortlist' },
                { icon: TrendingDown, label: 'No Added Cost' },
                { icon: Globe2, label: '6 Sourcing Countries' },
                { icon: CheckCircle2, label: 'Human-Reviewed, Always' },
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

        {/* What it means */}
        <section className="py-20 px-4 md:px-6">
          <div className="max-w-3xl mx-auto reveal">
            <h2 className="text-3xl font-bold text-text mb-6">
              AI Finds and Filters. Recruiters Decide.
            </h2>
            <p className="text-muted text-lg leading-relaxed mb-4">
              Sourcing and initial screening are the most time-consuming, repetitive parts of
              recruiting — and the parts AI is genuinely good at. TrivianEdge uses AI tools to
              search our talent network, rank candidates against your specific role requirements,
              and run structured skills assessments at a speed manual search can't match.
            </p>
            <p className="text-muted text-lg leading-relaxed">
              What AI does not do is make the hiring call. Every shortlist that reaches you has
              been reviewed by a human recruiter, applied on top of either our{' '}
              <Link to="/services/rpo/full-cycle-rpo" className="text-cyan-400 hover:underline">
                Full-Cycle
              </Link>{' '}
              or{' '}
              <Link to="/services/rpo/project-based-rpo" className="text-cyan-400 hover:underline">
                Project-Based
              </Link>{' '}
              RPO model.
            </p>
          </div>
        </section>

        {/* Where AI is used */}
        <section className="py-20 px-4 md:px-6 bg-surface/30">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-12 text-center reveal">
              Where AI Fits in the Hiring Pipeline
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {AI_STAGES.map(({ icon: Icon, label }, idx) => (
                <div
                  key={label}
                  style={{ transitionDelay: `${idx * 60}ms` }}
                  className="glass rounded-2xl p-6 border-border flex flex-col items-center gap-3 text-center reveal"
                >
                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                    <Icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <p className="font-semibold text-text text-sm">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-12 text-center reveal">
              The Impact, in Numbers
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {STATS.map(({ value, label }, idx) => (
                <div
                  key={label}
                  style={{ transitionDelay: `${idx * 60}ms` }}
                  className="glass rounded-2xl p-6 border-border text-center reveal"
                >
                  <p className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">{value}</p>
                  <p className="text-muted text-sm font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Human-in-the-loop */}
        <section className="py-20 px-4 md:px-6 bg-surface/30">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-6 reveal">
              Why We Keep a Human in the Loop
            </h2>
            <div className="space-y-4">
              {[
                { title: 'Fairness and accuracy', desc: 'Fully automated candidate rejection carries real bias and accuracy risks. Every filtered-out candidate has still been reviewed by a recruiter, not just a model.' },
                { title: 'Context AI can\'t see', desc: 'Culture fit, communication style, and career trajectory require judgment. AI surfaces the right candidates faster; people evaluate whether they\'re actually the right fit.' },
                { title: 'Accountability', desc: 'When a hire doesn\'t work out, there\'s a recruiter who made the call and can explain why — not an opaque scoring system.' },
              ].map((item, idx) => (
                <div key={item.title} style={{ transitionDelay: `${idx * 60}ms` }} className="glass rounded-2xl border-border p-6 reveal">
                  <h3 className="font-bold text-text mb-2">{item.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 px-4 md:px-6">
          <div className="max-w-3xl mx-auto reveal">
            <h2 className="text-3xl font-bold text-text mb-4 text-center">
              Frequently Asked Questions
            </h2>
            <p className="text-muted text-center mb-10">
              Everything you need to know about AI-powered recruitment with TrivianEdge.
            </p>
            <Accordion items={FAQS} />
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center reveal">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
              Hire Faster Without Losing Judgment
            </h2>
            <p className="text-muted mb-8">
              See how AI-assisted sourcing fits into your hiring timeline.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold premium-button"
            >
              Get a free consultation
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default AIPoweredRecruitmentPage;
