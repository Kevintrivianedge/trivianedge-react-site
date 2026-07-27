import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Users,
  Search,
  MessageSquare,
  ClipboardCheck,
  Repeat,
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
    question: 'What is Full-Cycle RPO?',
    answer:
      'Full-Cycle RPO is an ongoing, embedded partnership where TrivianEdge runs your entire recruitment function indefinitely — not just individual searches. We own sourcing, screening, interview coordination, offers, and onboarding for every role you hire, acting as your extended talent acquisition team for as long as the engagement runs.',
  },
  {
    question: 'How is Full-Cycle RPO different from Project-Based RPO?',
    answer:
      'Full-Cycle RPO is an open-ended engagement built for companies with continuous hiring needs — think 20+ roles a year, ongoing headcount growth, or no in-house recruiting team at all. Project-Based RPO is a defined, time-boxed hiring sprint for a specific need, like hiring 15 engineers before a product launch. Companies that start with a project often move to full-cycle once they see the volume of hiring is steady rather than one-off.',
  },
  {
    question: 'What does TrivianEdge actually own in a Full-Cycle engagement?',
    answer:
      'Everything in the hiring funnel: job description refinement, sourcing across our talent hubs, structured screening, interview scheduling and coordination with your hiring managers, offer negotiation support, and onboarding logistics. We also maintain a warm pipeline for roles you will likely need in 3–6 months, so you are never starting from zero.',
  },
  {
    question: 'Do we still control who gets hired?',
    answer:
      'Yes, always. TrivianEdge runs the process, but hiring managers make every final decision. We present shortlisted, pre-screened candidates; your team interviews and decides. We never make an offer without your sign-off.',
  },
  {
    question: 'How is Full-Cycle RPO priced?',
    answer:
      'Most Full-Cycle engagements run on a monthly retainer sized to your expected hiring volume, which is typically 40–60% cheaper than maintaining an equivalent in-house talent acquisition team once you account for salaries, tools, and job board spend. Contact us for a quote based on your role mix and volume.',
  },
  {
    question: 'How long is the minimum commitment?',
    answer:
      'There is no fixed multi-year lock-in. Most Full-Cycle engagements run in renewable quarterly terms, so the arrangement can scale up, scale down, or wind down as your hiring needs change.',
  },
  {
    question: 'Does Full-Cycle RPO work with our existing HR team and ATS?',
    answer:
      'Yes. We embed into your existing workflow rather than replacing it — using your ATS if you have one, following your employer brand and voice with candidates, and reporting into your HR or People leadership. From a candidate\'s perspective, they are dealing with your company throughout.',
  },
  {
    question: 'What happens to the roles we hire if we ever end the engagement?',
    answer:
      'Everything transfers to you: candidate pipelines, sourcing notes, interview scorecards, and any employer-branding assets we built. There is no lock-in on your own hiring data or relationships.',
  },
];

const INCLUDED = [
  { icon: Search, label: 'Sourcing & Talent Mapping' },
  { icon: ClipboardCheck, label: 'Structured Screening' },
  { icon: MessageSquare, label: 'Interview Coordination' },
  { icon: Users, label: 'Offer & Onboarding Support' },
  { icon: Repeat, label: 'Ongoing Pipeline Building' },
];

const STATS = [
  { value: 'Ongoing', label: 'Engagement Model' },
  { value: '40–60%', label: 'Cost Reduction' },
  { value: '6', label: 'Sourcing Countries' },
  { value: '100%', label: 'Embedded in Your Team' },
];

const FullCycleRPOPage: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <SEOHead
        title="Full-Cycle RPO Services | Embedded Recruitment Outsourcing | TrivianEdge"
        description="TrivianEdge's full-cycle RPO embeds a complete hiring function into your HR team — sourcing, screening, interviews, and onboarding, managed end-to-end, indefinitely."
        schema={[
          serviceSchema(
            'Full-Cycle RPO',
            'Recruitment Process Outsourcing',
            'https://www.trivianedge.com/services/rpo/full-cycle-rpo',
          ),
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: 'Home', url: 'https://www.trivianedge.com' },
            { name: 'Services', url: 'https://www.trivianedge.com/services' },
            { name: 'RPO Services', url: 'https://www.trivianedge.com/services/rpo' },
            {
              name: 'Full-Cycle RPO',
              url: 'https://www.trivianedge.com/services/rpo/full-cycle-rpo',
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
            <li className="text-text font-medium">Full-Cycle RPO</li>
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
              Full-Cycle RPO:{' '}
              <span className="text-cyan-400">Your Entire Hiring Function, Embedded</span>
            </h1>
            <p className="text-muted text-lg max-w-2xl mx-auto mb-8">
              TrivianEdge becomes your ongoing talent acquisition team — sourcing, screening,
              interviewing, and onboarding every hire, indefinitely, without you building an
              in-house recruiting function from scratch.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {[
                { icon: Clock, label: 'Ongoing Engagement' },
                { icon: TrendingDown, label: '40–60% Cost Reduction' },
                { icon: Globe2, label: '6 Sourcing Countries' },
                { icon: CheckCircle2, label: 'Fully Embedded' },
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

        {/* What is Full-Cycle RPO */}
        <section className="py-20 px-4 md:px-6">
          <div className="max-w-3xl mx-auto reveal">
            <h2 className="text-3xl font-bold text-text mb-6">
              What Makes RPO "Full-Cycle"?
            </h2>
            <p className="text-muted text-lg leading-relaxed mb-4">
              A staffing agency fills one job order at a time. Full-Cycle RPO is different:
              TrivianEdge takes ownership of your entire recruitment function, on an ongoing basis,
              as an embedded extension of your HR team. We don't just fill open roles — we build
              and maintain the hiring engine behind them.
            </p>
            <p className="text-muted text-lg leading-relaxed">
              If your hiring need is a defined, time-boxed burst rather than a continuous function,{' '}
              <Link to="/services/rpo/project-based-rpo" className="text-cyan-400 hover:underline">
                Project-Based RPO
              </Link>{' '}
              is usually the better fit. Full-Cycle is built for companies hiring continuously
              across the year.
            </p>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-20 px-4 md:px-6 bg-surface/30">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-12 text-center reveal">
              What's Included in Full-Cycle RPO
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {INCLUDED.map(({ icon: Icon, label }, idx) => (
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

        {/* Why choose stats */}
        <section className="py-20 px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-12 text-center reveal">
              Why Companies Move to Full-Cycle RPO
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

        {/* Who it's for */}
        <section className="py-20 px-4 md:px-6 bg-surface/30">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-6 reveal">
              Is Full-Cycle RPO Right for You?
            </h2>
            <div className="space-y-4">
              {[
                { title: 'You hire continuously, not in bursts', desc: 'Companies with steady, year-round hiring — 20+ roles annually — get the most value from an embedded, ongoing team rather than repeated one-off searches.' },
                { title: 'You don\'t have an in-house TA function', desc: 'Full-Cycle RPO replaces the need to hire, train, and manage your own recruiting team, at a fraction of the fully-loaded cost.' },
                { title: 'You need pipeline, not just placements', desc: 'We build a warm talent pipeline for roles you\'ll need in 3–6 months, so hiring stops being reactive.' },
                { title: 'You want one point of accountability', desc: 'Instead of juggling agencies, job boards, and internal recruiters, one embedded TrivianEdge team owns the whole funnel.' },
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
              Everything you need to know about Full-Cycle RPO with TrivianEdge.
            </p>
            <Accordion items={FAQS} />
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center reveal">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
              Build Your Embedded Hiring Team
            </h2>
            <p className="text-muted mb-8">
              Stop starting hiring from zero every time. Let's talk about your volume and roles.
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

export default FullCycleRPOPage;
