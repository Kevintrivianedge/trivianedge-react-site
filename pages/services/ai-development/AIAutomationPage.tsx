import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  FileSearch,
  Workflow,
  Plug,
  UserCheck,
  AlertTriangle,
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
    question: 'What is AI automation, and how is it different from traditional RPA?',
    answer:
      "Traditional robotic process automation (RPA) follows fixed, rule-based steps — it breaks the moment a document or input looks different from what it was scripted for. AI automation uses LLMs and document intelligence to handle variation: reading an invoice in a format it hasn't seen before, triaging a support ticket by intent, or deciding the next step in a workflow based on context rather than a rigid script.",
  },
  {
    question: 'What kinds of processes are good candidates for AI automation?',
    answer:
      'Anything repetitive, document-heavy, or rules-adjacent but not perfectly rule-based: invoice and contract processing, support ticket triage and routing, data entry from unstructured sources, compliance checks, and multi-step approval workflows. If a human is currently reading something and making a judgment call to move it forward, it is usually a candidate.',
  },
  {
    question: 'Do AI agents make mistakes, and how do you prevent them from causing damage?',
    answer:
      "Yes, any AI system can make mistakes — which is why we design human-in-the-loop checkpoints for decisions above a risk or value threshold, confidence scoring that routes uncertain cases to a person instead of guessing, and full audit logs of every automated decision. The goal is removing repetitive work from people, not removing accountability.",
  },
  {
    question: 'Will this integrate with our existing CRM, ERP, or internal tools?',
    answer:
      'Yes — AI automation is only useful if it plugs into where the work already happens. We build integrations against your existing systems (Salesforce, HubSpot, NetSuite, custom internal tools, and most systems with an API) rather than asking you to change how your team works.',
  },
  {
    question: 'How do you measure whether the automation is actually working?',
    answer:
      'Before launch we agree on the baseline — hours spent, error rate, turnaround time on the current manual process — and report against it after launch: time saved, accuracy versus the manual baseline, and volume handled without human intervention. If the numbers don\'t hold up, we treat that as a problem to fix, not a footnote.',
  },
  {
    question: 'What happens when the automation hits something it can\'t handle?',
    answer:
      "It escalates to a human rather than guessing or failing silently. Every workflow we build has a defined fallback path — flag for review, route to a specific team member, or hold for manual approval — so edge cases get handled correctly instead of quietly breaking the process.",
  },
  {
    question: 'How much does an AI automation project cost?',
    answer:
      'It depends on process complexity and how many systems need to be integrated. TrivianEdge offshore teams typically save clients up to 40% versus hiring equivalent automation engineering talent locally. Contact us for a quote scoped to your specific workflow.',
  },
];

const INCLUDED = [
  { icon: FileSearch, label: 'Document Intelligence & Extraction' },
  { icon: Workflow, label: 'Agentic Workflow Design' },
  { icon: Plug, label: 'CRM / ERP System Integration' },
  { icon: UserCheck, label: 'Human-in-the-Loop Safeguards' },
  { icon: AlertTriangle, label: 'Monitoring & Error Handling' },
];

const STATS = [
  { value: '30 Days', label: 'To Deployed Team' },
  { value: 'Up to 40%', label: 'Cost Reduction' },
  { value: '6', label: 'Sourcing Countries' },
  { value: '100%', label: 'IP Ownership' },
];

const AIAutomationPage: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <SEOHead
        title="AI Automation & Agentic Workflow Services | TrivianEdge"
        description="TrivianEdge builds AI automation pipelines — document intelligence, agentic workflows, and system integrations — with an offshore engineering team."
        schema={[
          serviceSchema(
            'AI Automation Pipelines',
            'Artificial Intelligence Development',
            'https://www.trivianedge.com/services/ai-development/ai-automation',
          ),
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: 'Home', url: 'https://www.trivianedge.com' },
            { name: 'Services', url: 'https://www.trivianedge.com/services' },
            { name: 'AI Development', url: 'https://www.trivianedge.com/services/ai-development' },
            {
              name: 'AI Automation Pipelines',
              url: 'https://www.trivianedge.com/services/ai-development/ai-automation',
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
            <li className="text-text font-medium">AI Automation</li>
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
              AI Automation Pipelines
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-text mb-6 leading-tight">
              AI Automation:{' '}
              <span className="text-cyan-400">Handle Variation, Not Just Rules</span>
            </h1>
            <p className="text-muted text-lg max-w-2xl mx-auto mb-8">
              Document processing, agentic workflows, and system integrations that adapt to real
              inputs instead of breaking on the first exception — with a human always in the loop.
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

        {/* What is AI automation */}
        <section className="py-20 px-4 md:px-6">
          <div className="max-w-3xl mx-auto reveal">
            <h2 className="text-3xl font-bold text-text mb-6">
              Beyond Rule-Based RPA
            </h2>
            <p className="text-muted text-lg leading-relaxed mb-4">
              Traditional automation breaks the moment an input doesn't match the script it was
              built for. AI automation uses LLMs and document intelligence to handle the
              variation real business processes actually have — reading an invoice in a new
              format, triaging a ticket by intent, deciding the next step from context — with
              human-in-the-loop checkpoints on anything above a risk threshold.
            </p>
            <p className="text-muted text-lg leading-relaxed">
              If the process is a customer-facing conversation rather than a back-office workflow,{' '}
              <Link to="/services/ai-development/ai-chatbot-development" className="text-cyan-400 hover:underline">
                AI Chatbot Development
              </Link>{' '}
              is the more direct fit.
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
              Why Teams Automate With TrivianEdge
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
              Is AI Automation Right for You?
            </h2>
            <div className="space-y-4">
              {[
                { title: 'Your team is drowning in repetitive document work', desc: 'Invoices, contracts, forms, and applications that someone reads and re-keys by hand are the clearest automation win.' },
                { title: 'Your process breaks on exceptions', desc: 'If your current RPA or scripted automation fails whenever an input looks slightly different, AI automation is built for exactly that variation.' },
                { title: 'You need multi-step decisions, not single actions', desc: 'Processes that route, escalate, or branch based on content — support triage, approval chains — benefit from agentic workflows, not a single automated step.' },
                { title: 'You still want a human making the final call on judgment', desc: 'We design escalation paths for anything above a risk threshold, so automation speeds up the process without removing oversight.' },
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
              Everything you need to know about AI automation with TrivianEdge.
            </p>
            <Accordion items={FAQS} />
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center reveal">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
              Automate the Work Your Team Shouldn't Be Doing by Hand
            </h2>
            <p className="text-muted mb-8">
              Tell us about the process — we'll tell you if AI automation is the right fix.
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

export default AIAutomationPage;
