import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Plug,
  SlidersHorizontal,
  Gauge,
  Shuffle,
  LineChart,
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
    question: 'What is LLM integration?',
    answer:
      'LLM integration means wiring an existing large language model — a current OpenAI or Anthropic model, or an open-weight model — into your product, so it handles a real task inside your existing software rather than living as a standalone chat window. That includes API orchestration, prompt design, output parsing, error handling, and cost and latency control at production scale.',
  },
  {
    question: 'When should I integrate an existing model versus fine-tune one?',
    answer:
      "Integration is faster and usually the right first step — you're using a model as-is, guided by prompts and retrieved context. Fine-tuning makes sense when prompting alone can't get the consistency, format, or domain vocabulary you need, or when you're running high volume and a smaller fine-tuned model can match a larger general model's quality at lower cost. We assess this during scoping rather than defaulting to either.",
  },
  {
    question: 'Which models and open-source options do you fine-tune?',
    answer:
      'For fine-tuning, we work with current open-weight model families like Llama and Mistral, using parameter-efficient techniques like LoRA to adapt them without the cost of a full retrain. For integration, we work across OpenAI, Anthropic, HuggingFace-hosted models, and orchestration frameworks like LangChain and LlamaIndex.',
  },
  {
    question: 'How much training data do I need to fine-tune a model?',
    answer:
      "It depends on the task. Some fine-tunes work well with a few hundred well-labeled examples; others need thousands. If you don't have existing data, we help you structure and label a starting set as part of the engagement, and for many integration-only use cases minimal custom data is needed at all.",
  },
  {
    question: 'Can you avoid locking us into a single AI vendor?',
    answer:
      'Yes — this is one of the most common reasons companies come to us. We design an abstraction layer that routes between models (OpenAI, Anthropic, open-source) based on cost, latency, or capability, so a pricing change or outage at one provider doesn\'t take down your product. Multi-model routing and fallback logic is part of the standard integration architecture.',
  },
  {
    question: 'How do you control cost and latency once this is live?',
    answer:
      'Model selection matched to task complexity (not defaulting to the biggest model for everything), prompt and context-window optimization, caching repeated queries, and monitoring token spend per feature so cost stays predictable as usage scales. We treat this as an ongoing responsibility, not a one-time setup.',
  },
  {
    question: 'How much does LLM integration or fine-tuning cost?',
    answer:
      'It varies by scope — a single integrated feature is a smaller build than a fine-tuned model with an evaluation harness. TrivianEdge offshore teams typically save up to 40% versus hiring equivalent AI engineering talent locally. Contact us for a quote scoped to your use case.',
  },
];

const INCLUDED = [
  { icon: Plug, label: 'API Integration & Orchestration' },
  { icon: SlidersHorizontal, label: 'Fine-Tuning & LoRA Adaptation' },
  { icon: Shuffle, label: 'Multi-Model Routing & Fallback' },
  { icon: Gauge, label: 'Cost & Latency Optimization' },
  { icon: LineChart, label: 'Evaluation & Benchmarking' },
];

const STATS = [
  { value: '30 Days', label: 'To Deployed Team' },
  { value: 'Up to 40%', label: 'Cost Reduction' },
  { value: '6', label: 'Sourcing Countries' },
  { value: '100%', label: 'IP Ownership' },
];

const LLMIntegrationPage: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <SEOHead
        title="LLM Integration & Fine-Tuning Services | TrivianEdge"
        description="TrivianEdge integrates and fine-tunes LLMs — OpenAI, Anthropic Claude, and open-source models — into your product with an offshore AI team."
        schema={[
          serviceSchema(
            'LLM Integration & Fine-Tuning',
            'Artificial Intelligence Development',
            'https://www.trivianedge.com/services/ai-development/llm-integration',
          ),
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: 'Home', url: 'https://www.trivianedge.com' },
            { name: 'Services', url: 'https://www.trivianedge.com/services' },
            { name: 'AI Development', url: 'https://www.trivianedge.com/services/ai-development' },
            {
              name: 'LLM Integration & Fine-Tuning',
              url: 'https://www.trivianedge.com/services/ai-development/llm-integration',
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
            <li className="text-text font-medium">LLM Integration</li>
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
              LLM Integration &amp; Fine-Tuning
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-text mb-6 leading-tight">
              LLM Integration:{' '}
              <span className="text-cyan-400">Put a Model to Work Inside Your Product</span>
            </h1>
            <p className="text-muted text-lg max-w-2xl mx-auto mb-8">
              OpenAI, Anthropic Claude, and open-source models wired into your existing software —
              or fine-tuned on your own data — without vendor lock-in.
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

        {/* What is LLM integration */}
        <section className="py-20 px-4 md:px-6">
          <div className="max-w-3xl mx-auto reveal">
            <h2 className="text-3xl font-bold text-text mb-6">
              Integration vs. Fine-Tuning: Choosing the Right Path
            </h2>
            <p className="text-muted text-lg leading-relaxed mb-4">
              Most products should start with integration — prompting and retrieved context
              guiding a current OpenAI or Anthropic model. Fine-tuning earns its cost when
              prompting alone can't hit the consistency, format, or domain vocabulary you need, or
              when a smaller fine-tuned model can match a larger general model at a fraction of
              the inference cost at your volume.
            </p>
            <p className="text-muted text-lg leading-relaxed">
              If the product needs to generate content grounded in your own knowledge base rather
              than just process a task,{' '}
              <Link to="/services/ai-development/generative-ai" className="text-cyan-400 hover:underline">
                Generative AI Development
              </Link>{' '}
              covers the retrieval and content layer on top of this integration work.
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
              Why Teams Integrate LLMs With TrivianEdge
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
              Is LLM Integration Right for You?
            </h2>
            <div className="space-y-4">
              {[
                { title: 'You want AI features fast, without building from scratch', desc: 'Integration gets a model doing real work inside your product in weeks, using proven APIs rather than training something new.' },
                { title: 'You have proprietary data worth fine-tuning on', desc: 'If your domain has specific terminology, formats, or edge cases a general model gets wrong, a fine-tuned model closes that gap.' },
                { title: 'You\'re worried about single-vendor risk', desc: 'A pricing change or outage at one AI provider shouldn\'t take down your product — multi-model routing protects against that.' },
                { title: 'Cost is scaling faster than usage', desc: 'If your model bill is growing disproportionately to your user base, optimization — smaller models, caching, smarter routing — usually has real headroom left.' },
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
              Everything you need to know about LLM integration and fine-tuning with TrivianEdge.
            </p>
            <Accordion items={FAQS} />
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center reveal">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
              Put an LLM to Work in Your Product
            </h2>
            <p className="text-muted mb-8">
              Let's figure out whether integration or fine-tuning is the right call for your use case.
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

export default LLMIntegrationPage;
