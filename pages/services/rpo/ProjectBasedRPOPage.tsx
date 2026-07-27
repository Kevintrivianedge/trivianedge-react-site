import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Rocket,
  Calendar,
  Target,
  Zap,
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
    question: 'What is Project-Based RPO?',
    answer:
      'Project-Based RPO is a defined, time-boxed recruitment engagement built around a specific hiring goal — for example, hiring 20 engineers in 90 days ahead of a product launch, or staffing a new department after a funding round. It has a clear start, end, and scope, unlike an ongoing Full-Cycle RPO engagement.',
  },
  {
    question: 'When does Project-Based RPO make sense instead of Full-Cycle RPO?',
    answer:
      'Choose Project-Based RPO when your hiring need is a burst rather than a continuous function: a funding round, a product launch, a seasonal peak, or a startup making its first 5–10 critical hires. If your hiring volume is steady year-round, Full-Cycle RPO is usually more cost-effective.',
  },
  {
    question: 'How fast can a hiring project start?',
    answer:
      'Most projects kick off within a week of scoping. A typical 90-day project breaks down as: week one for discovery and role briefing, weeks two through ten for active sourcing, screening, and interviews, with candidates typically ready for your review starting in week three or four.',
  },
  {
    question: 'What is the minimum size for a hiring project?',
    answer:
      'There is no fixed minimum — we\'ve run projects as small as a handful of critical early hires for pre-seed startups, up to 50+ roles for enterprise expansions. Pricing and timeline scale with scope.',
  },
  {
    question: 'What happens when the project ends?',
    answer:
      'You keep everything: the candidates hired, any remaining pipeline, and documentation on our sourcing approach. If new hiring needs come up afterward, you can run another project or convert to a Full-Cycle RPO engagement — there\'s no obligation either way.',
  },
  {
    question: 'How is a hiring project priced?',
    answer:
      'Project-Based RPO is typically priced per role or as a fixed project fee based on scope, role complexity, and timeline — rather than an open-ended monthly retainer. This makes budgeting straightforward for a one-time hiring push. Contact us for a scoped quote.',
  },
  {
    question: 'Can Project-Based RPO cover both technical and non-technical roles in the same project?',
    answer:
      'Yes. A single project can span software engineers, AI/ML specialists, operations staff, and customer-facing roles at the same time — useful when a launch or expansion requires building out several functions at once.',
  },
  {
    question: 'Is Project-Based RPO a good fit for a startup\'s first hires?',
    answer:
      'Yes — it\'s one of the most common use cases. Startups get a structured, professional hiring process for their first critical roles without the cost or delay of building an internal recruiting function first.',
  },
];

const USE_CASES = [
  { icon: Rocket, label: 'Product Launches' },
  { icon: Calendar, label: 'Seasonal Hiring Peaks' },
  { icon: Target, label: 'Post-Funding Scale-Ups' },
  { icon: Zap, label: 'Startup First Hires' },
];

const STATS = [
  { value: '90 Days', label: 'Typical Project Length' },
  { value: 'Fixed Scope', label: 'Pricing Model' },
  { value: '6', label: 'Sourcing Countries' },
  { value: 'No Lock-In', label: 'After the Project Ends' },
];

const ProjectBasedRPOPage: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <SEOHead
        title="Project-Based RPO | Hiring Bursts & Recruitment Sprints | TrivianEdge"
        description="Need to hire fast for a launch, funding round, or seasonal peak? TrivianEdge's project-based RPO delivers defined, time-boxed hiring sprints with no long-term commitment."
        schema={[
          serviceSchema(
            'Project-Based RPO',
            'Recruitment Process Outsourcing',
            'https://www.trivianedge.com/services/rpo/project-based-rpo',
          ),
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: 'Home', url: 'https://www.trivianedge.com' },
            { name: 'Services', url: 'https://www.trivianedge.com/services' },
            { name: 'RPO Services', url: 'https://www.trivianedge.com/services/rpo' },
            {
              name: 'Project-Based RPO',
              url: 'https://www.trivianedge.com/services/rpo/project-based-rpo',
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
            <li className="text-text font-medium">Project-Based RPO</li>
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
              Project-Based RPO:{' '}
              <span className="text-cyan-400">Hire Fast, Without the Long-Term Commitment</span>
            </h1>
            <p className="text-muted text-lg max-w-2xl mx-auto mb-8">
              A defined hiring sprint with a clear scope, timeline, and budget — built for launches,
              funding rounds, and seasonal peaks where you need a burst of great hires, not an
              ongoing recruiting function.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {[
                { icon: Clock, label: 'Defined Timeline' },
                { icon: TrendingDown, label: 'Fixed, Scoped Pricing' },
                { icon: Globe2, label: '6 Sourcing Countries' },
                { icon: CheckCircle2, label: 'No Long-Term Lock-In' },
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

        {/* What is Project-Based RPO */}
        <section className="py-20 px-4 md:px-6">
          <div className="max-w-3xl mx-auto reveal">
            <h2 className="text-3xl font-bold text-text mb-6">
              A Hiring Sprint, Not an Open-Ended Retainer
            </h2>
            <p className="text-muted text-lg leading-relaxed mb-4">
              Project-Based RPO exists for the moment when you need a specific number of people,
              hired well, by a specific date — not a permanent recruiting function. TrivianEdge
              scopes the roles, timeline, and budget upfront, then runs the entire hiring process
              inside that window.
            </p>
            <p className="text-muted text-lg leading-relaxed">
              If your hiring is continuous rather than a one-time push, our{' '}
              <Link to="/services/rpo/full-cycle-rpo" className="text-cyan-400 hover:underline">
                Full-Cycle RPO
              </Link>{' '}
              model is typically the better long-term fit.
            </p>
          </div>
        </section>

        {/* Use cases */}
        <section className="py-20 px-4 md:px-6 bg-surface/30">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-12 text-center reveal">
              When Project-Based RPO Makes Sense
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {USE_CASES.map(({ icon: Icon, label }, idx) => (
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
              How a Typical Project Runs
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

        {/* Timeline */}
        <section className="py-20 px-4 md:px-6 bg-surface/30">
          <div className="max-w-3xl mx-auto reveal">
            <h2 className="text-3xl font-bold text-text mb-4">
              Example: A 90-Day Hiring Sprint
            </h2>
            <p className="text-muted text-lg mb-12 leading-relaxed">
              Every project is scoped to your timeline, but this is a representative shape for a
              mid-size hiring push.
            </p>
            <div className="space-y-8">
              {[
                { step: '01', title: 'Scope and discovery', desc: 'We define the roles, seniority mix, budget, and target start dates, and agree on the project fee upfront.' },
                { step: '02', title: 'Sourcing and screening ramp-up', desc: 'Our team searches across 6 talent hubs in parallel, running structured screening against each role\'s requirements.' },
                { step: '03', title: 'Candidate delivery and interviews', desc: 'Shortlisted candidates start reaching your hiring managers from week three or four, with a steady cadence through the project.' },
                { step: '04', title: 'Offers, onboarding, and wrap-up', desc: 'We support offer negotiation and onboarding logistics, then hand over any remaining pipeline when the project closes.' },
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

        {/* FAQ */}
        <section className="py-20 px-4 md:px-6">
          <div className="max-w-3xl mx-auto reveal">
            <h2 className="text-3xl font-bold text-text mb-4 text-center">
              Frequently Asked Questions
            </h2>
            <p className="text-muted text-center mb-10">
              Everything you need to know about Project-Based RPO with TrivianEdge.
            </p>
            <Accordion items={FAQS} />
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center reveal">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
              Scope Your Next Hiring Sprint
            </h2>
            <p className="text-muted mb-8">
              Tell us how many roles, what timeline, and we'll build the plan around it.
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

export default ProjectBasedRPOPage;
