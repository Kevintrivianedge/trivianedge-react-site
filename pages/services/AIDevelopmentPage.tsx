import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  MessageSquare,
  BarChart2,
  Zap,
  Bot,
  Server,
} from 'lucide-react';
import SEOHead from '../../components/SEOHead';
import Accordion from '../../components/Accordion';
import { serviceSchema, faqSchema, breadcrumbSchema } from '../../utils/seo';

const FAQS = [
  {
    question: 'What AI development services does TrivianEdge offer?',
    answer:
      'TrivianEdge builds generative AI applications, LLM integrations, machine learning models, AI automation pipelines, AI chatbots, and MLOps infrastructure. We work with OpenAI, Anthropic Claude, HuggingFace, LangChain, TensorFlow, PyTorch, AWS SageMaker, and Azure AI. Whether you need a standalone AI product or AI embedded into your existing software, our team handles the full build.',
  },
  {
    question: 'How much does AI development cost with TrivianEdge?',
    answer:
      'TrivianEdge offshore AI development typically saves 40–60% compared to onshore North American or UK teams. A senior AI engineer in Canada or the US costs $150,000–$200,000 per year. Through our offshore model, you access the same skill level at significantly lower cost. We scope each project individually — contact us for an estimate based on your specific requirements.',
  },
  {
    question: 'How quickly can an AI development project start?',
    answer:
      'We assemble and deploy a dedicated offshore AI development team within 30 days of engagement. The first week is scoping and technical architecture, week two covers environment setup and sprint planning, and active development begins in week three.',
  },
  {
    question: 'Can TrivianEdge integrate OpenAI and Anthropic APIs into my existing software?',
    answer:
      'Yes. Our engineers are experienced with OpenAI GPT-4o, Anthropic Claude 3, HuggingFace models, LangChain, LlamaIndex, and all major AI APIs. We can add AI capabilities to your existing product — whether that is a web app, mobile app, internal tool, or enterprise system — without rebuilding what already works.',
  },
  {
    question: 'Do you build custom LLMs or fine-tune existing models?',
    answer:
      'Yes. TrivianEdge builds custom LLM applications and fine-tunes open-source models like LLaMA, Mistral, and Falcon for specific business use cases. If you need a model that understands your industry terminology, your product data, or your customer patterns, fine-tuning is often the right approach and we handle the entire process.',
  },
  {
    question: 'What is the difference between AI development and traditional software development?',
    answer:
      'Traditional software follows exact rules you program in advance. AI software learns from data and makes predictions, decisions, or generates content in ways you cannot fully script. AI development requires expertise in model training, data pipelines, vector databases, prompt engineering, and inference optimization — skills that go beyond standard software engineering.',
  },
  {
    question: 'Can you add AI to software I have already built?',
    answer:
      'Yes. This is one of the most common engagements. We audit your existing codebase, identify where AI adds the most value (document processing, customer support automation, recommendation engines, predictive analytics), and integrate the AI layer cleanly without breaking what already works.',
  },
  {
    question: 'What industries do you build AI solutions for?',
    answer:
      'We build AI for technology companies, financial services, healthcare, legal tech, logistics, e-commerce, real estate, and professional services. Common applications include document intelligence, customer service automation, fraud detection, content generation, data analysis, and predictive modeling.',
  },
  {
    question: 'Who owns the AI model and code TrivianEdge builds?',
    answer:
      'You own 100% of the code, models, and intellectual property. TrivianEdge never retains any rights to what we build for your business. This is written into every engagement agreement.',
  },
  {
    question: 'How do you handle data privacy when building AI?',
    answer:
      'We follow a security-first development approach from day one. Your data never flows to third-party training pipelines without your explicit consent. We design AI systems that comply with GDPR, PIPEDA, HIPAA (where applicable), and other relevant regulations. All data handling is documented and auditable.',
  },
  {
    question: 'Can TrivianEdge maintain and improve the AI after launch?',
    answer:
      'Yes. AI systems need ongoing monitoring, retraining, and improvement as your data grows and your requirements change. We offer ongoing support and MLOps services to keep your AI performing well after the initial launch — including performance monitoring, model drift detection, and feature updates.',
  },
  {
    question: 'Do I need to provide training data for my AI project?',
    answer:
      'It depends on the type of AI. For fine-tuned models, some existing data is helpful but not always required — we can help you structure and label data as part of the engagement. For applications built on top of existing LLMs like GPT-4 or Claude, minimal custom data is needed. We assess your data situation during the initial scoping call and recommend the right approach.',
  },
];

const AI_SERVICES = [
  {
    icon: Sparkles,
    title: 'Generative AI Development',
    href: '/services/ai-development/generative-ai',
  },
  {
    icon: MessageSquare,
    title: 'LLM Integration & Fine-tuning',
    href: '/services/ai-development/llm-integration',
  },
  {
    icon: BarChart2,
    title: 'Machine Learning & Data Science',
    href: '/services/ai-development/machine-learning',
  },
  {
    icon: Zap,
    title: 'AI Automation Pipelines',
    href: '/services/ai-development/ai-automation',
  },
  {
    icon: Bot,
    title: 'AI Chatbot Development',
    href: '/services/ai-development/ai-chatbot-development',
  },
  {
    icon: Server,
    title: 'MLOps & AI Infrastructure',
    href: '/services/ai-development/mlops',
  },
];

const TECH_BADGES = [
  'OpenAI',
  'Anthropic',
  'HuggingFace',
  'LangChain',
  'TensorFlow',
  'PyTorch',
];

const COMPARISON_ROWS = [
  {
    factor: 'Time to hire',
    inHouse: '3–6 months',
    trivian: '30 days',
  },
  {
    factor: 'Annual cost',
    inHouse: '$180k+ per engineer',
    trivian: 'Up to 40% savings',
  },
  {
    factor: 'Availability',
    inHouse: 'Local talent pool',
    trivian: '6 global time zones',
  },
  {
    factor: 'Tech stack',
    inHouse: 'Limited by local market',
    trivian: 'Full-stack AI expertise',
  },
  {
    factor: 'Scalability',
    inHouse: 'Slow & costly',
    trivian: 'Rapid team scaling',
  },
];

const AIDevelopmentPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="AI Development Services Canada | Machine Learning & LLM | TrivianEdge"
        description="Build custom AI solutions with TrivianEdge's offshore AI team. Generative AI, LLM integration, ML models, AI automation, deployed in 30 days."
        schema={[
          serviceSchema(
            'AI Development Services',
            'Artificial Intelligence Development',
            'https://www.trivianedge.com/services/ai-development',
          ),
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: 'Home', url: 'https://www.trivianedge.com' },
            { name: 'Services', url: 'https://www.trivianedge.com/services' },
            {
              name: 'AI Development',
              url: 'https://www.trivianedge.com/services/ai-development',
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
              AI Development Services
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-text mb-6 leading-tight">
              AI Development Services:{' '}
              <span className="text-cyan-400">
                Canada's Offshore AI Engineering Partner
              </span>
            </h1>

            {/* Tech badge bar */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {TECH_BADGES.map(badge => (
                <span
                  key={badge}
                  className="px-4 py-2 glass rounded-full border-border text-sm font-mono font-medium text-muted"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </motion.section>

        {/* AI Services Grid */}
        <section className="py-20 px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-12 text-center">
              Our AI Development Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {AI_SERVICES.map(({ icon: Icon, title, href }) => (
                <Link
                  key={title}
                  to={href}
                  className="glass rounded-2xl p-6 border-border hover:border-cyan-500/40 transition-colors group"
                >
                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 w-fit mb-4">
                    <Icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="font-bold text-text group-hover:text-cyan-400 transition-colors">
                    {title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison table */}
        <section className="py-20 px-4 md:px-6 bg-surface/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-12 text-center">
              In-House AI Team vs. TrivianEdge Offshore
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-6 py-4 text-muted font-semibold uppercase tracking-widest text-xs">
                      Factor
                    </th>
                    <th className="text-left px-6 py-4 text-muted font-semibold uppercase tracking-widest text-xs">
                      In-House
                    </th>
                    <th className="text-left px-6 py-4 text-cyan-400 font-semibold uppercase tracking-widest text-xs bg-cyan-500/5">
                      TrivianEdge
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_ROWS.map((row, i) => (
                    <tr
                      key={row.factor}
                      className={
                        i < COMPARISON_ROWS.length - 1
                          ? 'border-b border-border'
                          : ''
                      }
                    >
                      <td className="px-6 py-4 font-medium text-text">
                        {row.factor}
                      </td>
                      <td className="px-6 py-4 text-muted">{row.inHouse}</td>
                      <td className="px-6 py-4 text-cyan-400 font-semibold bg-cyan-500/5">
                        {row.trivian}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

        {/* Talent callout */}
        <section className="py-10 px-4 md:px-6 bg-surface/30">
          <div className="max-w-2xl mx-auto glass rounded-2xl border-border p-8 text-center">
            <p className="text-muted mb-3 text-lg font-medium">
              Need AI talent, not AI services?
            </p>
            <Link
              to="/services/rpo"
              className="text-cyan-400 font-semibold hover:underline"
            >
              Explore RPO Services →
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
              Launch Your AI Project in 30 Days
            </h2>
            <p className="text-muted mb-8">
              Offshore AI engineering teams with up to 40% cost savings.
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

export default AIDevelopmentPage;
