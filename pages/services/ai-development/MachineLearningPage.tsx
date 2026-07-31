import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Database,
  Cpu,
  LineChart,
  Radar,
  Workflow,
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
    question: 'What is machine learning development, and how is it different from generative AI?',
    answer:
      'Machine learning covers models that predict, classify, or score from structured or historical data — churn prediction, fraud detection, demand forecasting, recommendation engines. Generative AI creates new content like text or images. Many products need both: an ML model predicting risk, and a generative layer explaining the result in plain language. We scope which one your problem actually needs.',
  },
  {
    question: 'What kinds of problems can a machine learning model solve for my business?',
    answer:
      'Classification (will this customer churn, is this transaction fraudulent), regression and forecasting (demand, revenue, pricing), recommendation and ranking (what to show this user next), and anomaly detection (unusual patterns in operations or transactions). If you have historical data and a repeatable decision, it is usually a candidate for ML.',
  },
  {
    question: 'What data do I need to get started?',
    answer:
      "Enough historical examples of the outcome you're trying to predict — the more consistent and complete, the better the model. We run a data audit early in the engagement to assess what you have, identify gaps, and recommend what to collect if the current data isn't sufficient yet. Not having a mature data warehouse doesn't disqualify you; it changes where we start.",
  },
  {
    question: 'How accurate will the model be?',
    answer:
      "It depends entirely on the problem and the data — we won't promise a number before seeing your data. What we do commit to is a clear evaluation methodology (train/test/validation splits, the right metric for your problem, not just accuracy), and being transparent about model performance and its limitations before it goes into production.",
  },
  {
    question: 'Do you build the data pipeline too, or just the model?',
    answer:
      'Both, when needed. Most ML projects fail on the data engineering side, not the modeling side — getting clean, reliable, up-to-date features into the model is usually the harder problem. We handle pipeline design, feature engineering, and the model itself as one engagement, not two separate handoffs.',
  },
  {
    question: 'What happens after the model is deployed?',
    answer:
      "Models degrade as real-world data drifts from what they were trained on. We offer ongoing monitoring and retraining through our MLOps &amp; AI Infrastructure work, so accuracy doesn't quietly decay six months after launch.",
  },
  {
    question: 'How much does a machine learning engagement cost?',
    answer:
      'It scales with data complexity and the number of models needed. TrivianEdge offshore data science teams typically save clients up to 40% versus hiring equivalent talent locally in Canada, the US, or the UK. Contact us for a quote scoped to your specific problem and data.',
  },
];

const INCLUDED = [
  { icon: Database, label: 'Data Pipeline & Feature Engineering' },
  { icon: Cpu, label: 'Model Development & Training' },
  { icon: LineChart, label: 'Evaluation & Validation' },
  { icon: Workflow, label: 'Production Deployment' },
  { icon: Radar, label: 'Monitoring & Retraining' },
];

const STATS = [
  { value: '30 Days', label: 'To Deployed Team' },
  { value: 'Up to 40%', label: 'Cost Reduction' },
  { value: '6', label: 'Sourcing Countries' },
  { value: '100%', label: 'IP Ownership' },
];

const MachineLearningPage: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <SEOHead
        title="Machine Learning & Data Science Services | TrivianEdge"
        description="TrivianEdge builds predictive models, forecasting, and recommendation engines with an offshore machine learning and data science team."
        schema={[
          serviceSchema(
            'Machine Learning & Data Science',
            'Artificial Intelligence Development',
            'https://www.trivianedge.com/services/ai-development/machine-learning',
          ),
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: 'Home', url: 'https://www.trivianedge.com' },
            { name: 'Services', url: 'https://www.trivianedge.com/services' },
            { name: 'AI Development', url: 'https://www.trivianedge.com/services/ai-development' },
            {
              name: 'Machine Learning & Data Science',
              url: 'https://www.trivianedge.com/services/ai-development/machine-learning',
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
            <li className="text-text font-medium">Machine Learning</li>
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
              Machine Learning &amp; Data Science
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-text mb-6 leading-tight">
              Machine Learning:{' '}
              <span className="text-cyan-400">Predictions Your Business Can Act On</span>
            </h1>
            <p className="text-muted text-lg max-w-2xl mx-auto mb-8">
              Churn prediction, forecasting, fraud detection, and recommendation engines —
              built on your data, from pipeline to production, by an offshore team in 30 days.
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

        {/* What is ML development */}
        <section className="py-20 px-4 md:px-6">
          <div className="max-w-3xl mx-auto reveal">
            <h2 className="text-3xl font-bold text-text mb-6">
              Prediction, Not Generation
            </h2>
            <p className="text-muted text-lg leading-relaxed mb-4">
              Machine learning models predict, classify, and score from your structured and
              historical data — will this customer churn, is this transaction fraudulent, what
              will demand look like next quarter. Most ML projects fail on the data engineering
              side, not the modeling side, so we treat the pipeline and the model as one
              engagement rather than a separate handoff.
            </p>
            <p className="text-muted text-lg leading-relaxed">
              Need the model explaining its own output in plain language, or generating content
              from it?{' '}
              <Link to="/services/ai-development/generative-ai" className="text-cyan-400 hover:underline">
                Generative AI Development
              </Link>{' '}
              is the layer that sits on top of prediction work like this.
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
              Why Teams Build ML With TrivianEdge
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
              Is a Machine Learning Engagement Right for You?
            </h2>
            <div className="space-y-4">
              {[
                { title: 'You have a repeatable decision backed by historical data', desc: 'Churn, fraud, pricing, demand — if you\'ve made this call by gut feel or spreadsheet, there\'s usually a model that can do it more consistently.' },
                { title: 'You want a data science function without hiring one', desc: 'A full in-house data science team is expensive to build and hard to hire well. We give you the same capability without the headcount.' },
                { title: 'You need a recommendation or ranking engine', desc: 'Product, content, or e-commerce teams that need to surface the right item to the right user, not just a static list.' },
                { title: 'Your data lives in more than one place', desc: 'If usable features are scattered across systems, we design the pipeline that consolidates them before modeling even starts.' },
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
              Everything you need to know about machine learning and data science with TrivianEdge.
            </p>
            <Accordion items={FAQS} />
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center reveal">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
              Turn Your Data Into Predictions
            </h2>
            <p className="text-muted mb-8">
              Let's look at what you're already collecting and what it could be predicting.
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

export default MachineLearningPage;
