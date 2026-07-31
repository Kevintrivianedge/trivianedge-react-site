import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Rocket,
  Radar,
  Gauge,
  GitBranch,
  LifeBuoy,
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
    question: 'What is MLOps, exactly?',
    answer:
      'MLOps is the infrastructure and process work that keeps a machine learning or AI model reliable in production — deployment pipelines, monitoring, drift detection, versioning, and retraining. A model that works well in a notebook is not the same as a model that stays accurate and fast under real production load for months. MLOps is the difference between the two.',
  },
  {
    question: 'We already have a model — can you take over deploying and maintaining it?',
    answer:
      "Yes, this is one of our most common engagements. We audit the existing model and pipeline, identify what's fragile or manual, and build proper deployment, monitoring, and retraining infrastructure around it — without requiring you to rebuild the model itself from scratch.",
  },
  {
    question: 'What is model drift, and how do you monitor for it?',
    answer:
      "Drift is when real-world data gradually diverges from what a model was trained on, causing accuracy to degrade silently — the model keeps producing confident answers, just wrong ones. We set up monitoring that tracks input distribution and prediction confidence over time, alerting before accuracy visibly drops rather than after a business problem surfaces.",
  },
  {
    question: 'Our AI costs are growing faster than usage — can you fix that?',
    answer:
      'Usually, yes. Common levers are right-sizing model choice to task complexity, caching repeated inference calls, batching requests, and optimizing how context is passed to the model. We audit current spend against actual usage patterns and identify where the biggest, lowest-risk savings are before touching anything in production.',
  },
  {
    question: 'Does this require migrating to a specific cloud provider?',
    answer:
      "No. We work across AWS SageMaker, Azure ML, and Kubernetes-based self-hosted infrastructure, and we design around whatever you're already running rather than forcing a migration as a prerequisite.",
  },
  {
    question: 'What happens if a new model version performs worse after deployment?',
    answer:
      'Every deployment we build includes versioning and rollback — if a new model or prompt version underperforms against the previous one on your evaluation metrics, we roll back immediately rather than leaving a regression live while it gets diagnosed.',
  },
  {
    question: 'How much does ongoing MLOps support cost?',
    answer:
      'It scales with how many models are in production and how much monitoring and retraining they need. TrivianEdge offshore infrastructure teams typically save clients up to 40% versus hiring equivalent talent locally. Contact us for a quote scoped to your current AI footprint.',
  },
];

const INCLUDED = [
  { icon: Rocket, label: 'Model Deployment & Serving' },
  { icon: Radar, label: 'Drift Detection & Monitoring' },
  { icon: Gauge, label: 'Cost & Latency Optimization' },
  { icon: GitBranch, label: 'CI/CD & Versioning' },
  { icon: LifeBuoy, label: 'Ongoing Infrastructure Support' },
];

const STATS = [
  { value: '30 Days', label: 'To Deployed Team' },
  { value: 'Up to 40%', label: 'Cost Reduction' },
  { value: '6', label: 'Sourcing Countries' },
  { value: '100%', label: 'IP Ownership' },
];

const MLOpsPage: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <SEOHead
        title="MLOps & AI Infrastructure Services | TrivianEdge"
        description="TrivianEdge builds MLOps infrastructure — deployment, drift monitoring, and cost optimization — to keep production AI and ML models reliable."
        schema={[
          serviceSchema(
            'MLOps & AI Infrastructure',
            'Artificial Intelligence Development',
            'https://www.trivianedge.com/services/ai-development/mlops',
          ),
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: 'Home', url: 'https://www.trivianedge.com' },
            { name: 'Services', url: 'https://www.trivianedge.com/services' },
            { name: 'AI Development', url: 'https://www.trivianedge.com/services/ai-development' },
            {
              name: 'MLOps & AI Infrastructure',
              url: 'https://www.trivianedge.com/services/ai-development/mlops',
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
            <li><Link to="/services/ai-development" className="hover:text-cyan-400 transition-colors">AI Development</Link></li>
            <li className="text-border">/</li>
            <li className="text-text font-medium">MLOps &amp; AI Infrastructure</li>
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
              MLOps &amp; AI Infrastructure
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-text mb-6 leading-tight">
              MLOps:{' '}
              <span className="text-cyan-400">Keep Your AI Reliable After Launch</span>
            </h1>
            <p className="text-muted text-lg max-w-2xl mx-auto mb-8">
              Deployment pipelines, drift detection, and cost optimization for models already
              in production — or ones stuck in a notebook, waiting to get there.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {[
                { icon: Clock, label: '30-Day Deployment' },
                { icon: TrendingDown, label: 'Up to 40% Cost Reduction' },
                { icon: Globe2, label: '6 Sourcing Countries' },
                { icon: CheckCircle2, label: '100% IP Ownership' },
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

        {/* What is MLOps */}
        <section className="py-20 px-4 md:px-6">
          <div className="max-w-3xl mx-auto reveal">
            <h2 className="text-3xl font-bold text-text mb-6">
              A Model in a Notebook Isn't a Model in Production
            </h2>
            <p className="text-muted text-lg leading-relaxed mb-4">
              MLOps is the infrastructure and process work that keeps an AI or ML model reliable
              once real users and real data hit it — deployment pipelines, drift monitoring,
              versioning with rollback, and cost control as usage scales. It's the difference
              between a model that worked well in testing and one that stays accurate months
              later.
            </p>
            <p className="text-muted text-lg leading-relaxed">
              Need the model built first, not just deployed?{' '}
              <Link to="/services/ai-development/machine-learning" className="text-cyan-400 hover:underline">
                Machine Learning &amp; Data Science
              </Link>{' '}
              covers the development work this infrastructure supports.
            </p>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-20 px-4 md:px-6 bg-surface/30">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-12 text-center reveal">
              What's Included
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

        {/* Stats */}
        <section className="py-20 px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-12 text-center reveal">
              Why Teams Trust TrivianEdge With Production AI
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
              Is MLOps &amp; AI Infrastructure Right for You?
            </h2>
            <div className="space-y-4">
              {[
                { title: 'You have a model stuck in a notebook', desc: 'It works in testing but no one has built the pipeline to get it into production reliably — this is the most common starting point.' },
                { title: 'Your AI costs are spiraling relative to usage', desc: 'If the model bill keeps climbing faster than your user base, there is usually real optimization headroom left unexamined.' },
                { title: 'You\'ve been burned by silent accuracy decay', desc: 'A model that quietly gets worse over months without anyone noticing until a business problem surfaces needs drift monitoring, not another rebuild.' },
                { title: 'You need reliability, not just a working prototype', desc: 'Teams shipping AI to real customers need versioning, rollback, and monitoring — the same production discipline as any other critical system.' },
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
              Everything you need to know about MLOps and AI infrastructure with TrivianEdge.
            </p>
            <Accordion items={FAQS} />
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center reveal">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
              Get Your AI Production-Ready
            </h2>
            <p className="text-muted mb-8">
              Let's audit what you have and build the infrastructure to keep it reliable.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold premium-button"
            >
              Start your AI project
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default MLOpsPage;
