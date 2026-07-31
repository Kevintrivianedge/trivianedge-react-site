import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  MessagesSquare,
  Database,
  UserPlus,
  BarChart3,
  ShieldAlert,
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
    question: 'Should I build a custom AI chatbot or use an off-the-shelf platform?',
    answer:
      "Off-the-shelf platforms are fast to set up but limited to whatever the vendor supports — usually generic scripted flows or shallow AI on top of your help docs. A custom-built chatbot is worth it once you need deep integration with your own data and systems, a specific brand voice, or logic that a template can't express. TrivianEdge's own site assistant, Aria, is an example of what a custom-built AI chatbot looks like in production, not a demo.",
  },
  {
    question: 'How do you stop the chatbot from making up answers?',
    answer:
      "By grounding every response in retrieval — the bot answers from your actual support docs, product data, or knowledge base rather than the model's general training. We add confidence thresholds so uncertain answers fall back to \"I don't know, let me connect you with someone\" instead of guessing, and we run structured evaluation before launch and after any change to the knowledge base or prompts.",
  },
  {
    question: 'Can the chatbot hand off to a human?',
    answer:
      'Yes, and it should — a chatbot that traps a frustrated user with no way to reach a person is worse than no chatbot at all. We build escalation logic based on sentiment, repeated failed attempts, or explicit request, handing off to your existing support tools (Zendesk, Intercom, Slack, or a custom queue) with the full conversation history attached.',
  },
  {
    question: 'What can an AI chatbot actually do beyond answering FAQs?',
    answer:
      'Qualify and route sales leads before a human ever gets involved, walk a user through a multi-step process (onboarding, troubleshooting, order status), pull live data from your systems to answer account-specific questions, and act as an internal assistant over your team\'s own documentation and policies — not just a customer-facing FAQ widget.',
  },
  {
    question: 'Where can the chatbot live — just our website?',
    answer:
      'We deploy to whatever channels make sense for your users: a website widget, Slack or Microsoft Teams for internal tools, WhatsApp or SMS for customer-facing use cases, or embedded directly inside your product as an in-app assistant.',
  },
  {
    question: 'How do you measure whether the chatbot is actually working?',
    answer:
      'Ticket deflection rate, resolution without human handoff, user satisfaction on chatbot-only conversations, and lead qualification accuracy for sales use cases — agreed before launch, tracked after. If deflection or accuracy isn\'t where it should be, that\'s a knowledge-base and prompt problem we keep iterating on, not a one-time delivery.',
  },
  {
    question: 'How much does AI chatbot development cost?',
    answer:
      'It depends on the complexity of the knowledge base, integrations, and channels involved. TrivianEdge offshore teams typically save clients up to 40% versus hiring equivalent AI engineering talent locally. Contact us for a quote scoped to your use case.',
  },
];

const INCLUDED = [
  { icon: MessagesSquare, label: 'Conversation Design & Scripting' },
  { icon: Database, label: 'Knowledge-Base RAG Integration' },
  { icon: UserPlus, label: 'Human Handoff & Escalation' },
  { icon: ShieldAlert, label: 'Hallucination Guardrails' },
  { icon: BarChart3, label: 'Analytics & Continuous Tuning' },
];

const STATS = [
  { value: '30 Days', label: 'To Deployed Team' },
  { value: 'Up to 40%', label: 'Cost Reduction' },
  { value: '6', label: 'Sourcing Countries' },
  { value: '100%', label: 'IP Ownership' },
];

const AIChatbotDevelopmentPage: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <SEOHead
        title="AI Chatbot Development Services | TrivianEdge"
        description="TrivianEdge builds custom AI chatbots grounded in your own data — support, sales, and internal assistants — deployed by an offshore team in 30 days."
        schema={[
          serviceSchema(
            'AI Chatbot Development',
            'Artificial Intelligence Development',
            'https://www.trivianedge.com/services/ai-development/ai-chatbot-development',
          ),
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: 'Home', url: 'https://www.trivianedge.com' },
            { name: 'Services', url: 'https://www.trivianedge.com/services' },
            { name: 'AI Development', url: 'https://www.trivianedge.com/services/ai-development' },
            {
              name: 'AI Chatbot Development',
              url: 'https://www.trivianedge.com/services/ai-development/ai-chatbot-development',
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
            <li className="text-text font-medium">AI Chatbot Development</li>
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
              AI Chatbot Development
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-text mb-6 leading-tight">
              AI Chatbots:{' '}
              <span className="text-cyan-400">Grounded in Your Data, Not a Script</span>
            </h1>
            <p className="text-muted text-lg max-w-2xl mx-auto mb-8">
              Support, sales, and internal assistants that answer from your actual knowledge
              base and know when to hand off to a human — built and deployed in 30 days.
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

        {/* What is AI chatbot development */}
        <section className="py-20 px-4 md:px-6">
          <div className="max-w-3xl mx-auto reveal">
            <h2 className="text-3xl font-bold text-text mb-6">
              Custom-Built, Not a Widget on Top of Your Docs
            </h2>
            <p className="text-muted text-lg leading-relaxed mb-4">
              Off-the-shelf chatbot platforms are fast to set up but limited to whatever the
              vendor supports. A custom-built chatbot earns its cost once you need deep
              integration with your own systems, a specific brand voice, or logic a template
              can't express — grounded in retrieval so it answers from your actual data, with a
              clear handoff to a human when it should.
            </p>
            <p className="text-muted text-lg leading-relaxed">
              If the goal is automating a back-office workflow rather than a conversation,{' '}
              <Link to="/services/ai-development/ai-automation" className="text-cyan-400 hover:underline">
                AI Automation Pipelines
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
              Why Teams Build Chatbots With TrivianEdge
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
              Is a Custom AI Chatbot Right for You?
            </h2>
            <div className="space-y-4">
              {[
                { title: 'Your support team answers the same questions repeatedly', desc: 'A chatbot grounded in your actual docs can deflect the repetitive volume, freeing your team for the cases that need a human.' },
                { title: 'You need 24/7 lead qualification', desc: 'Sales teams that lose leads to timezone gaps can qualify and route them the moment they arrive, any hour.' },
                { title: 'Off-the-shelf platforms feel too generic', desc: 'If you\'ve tried a templated chatbot and it can\'t handle your specific product, data, or brand voice, that\'s the signal you need a custom build.' },
                { title: 'You want an internal assistant over your own documentation', desc: 'Policies, playbooks, and internal knowledge scattered across tools can live behind one assistant your team actually uses.' },
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
              Everything you need to know about AI chatbot development with TrivianEdge.
            </p>
            <Accordion items={FAQS} />
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center reveal">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
              Build a Chatbot That Actually Knows Your Business
            </h2>
            <p className="text-muted mb-8">
              Let's scope the knowledge base, the guardrails, and the channels it needs to live on.
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

export default AIChatbotDevelopmentPage;
