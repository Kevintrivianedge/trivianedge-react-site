import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Layers,
  Search,
  MessageSquare,
  ShieldCheck,
  Palette,
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
    question: 'What is generative AI development?',
    answer:
      'Generative AI development means building products or features that create new content — text, images, code, summaries, or conversations — rather than just classifying or predicting from existing data. TrivianEdge builds these on top of models like GPT-4o, Claude, and open-source alternatives, wired into your product with the retrieval, guardrails, and UX needed to make the output reliable.',
  },
  {
    question: 'What kinds of generative AI products do you build?',
    answer:
      'AI copilots embedded in your product, retrieval-augmented generation (RAG) systems that answer questions grounded in your own data, content and document generation tools, summarization features, and multi-modal applications that combine text with image or audio generation. If the feature involves a model producing new output rather than picking from a fixed list, it falls under generative AI.',
  },
  {
    question: 'How is this different from just calling the OpenAI API?',
    answer:
      "Calling an API is the easy part. The work is in retrieval (grounding answers in your actual data so the model isn't guessing), prompt engineering and evaluation, output structure and streaming, cost and latency control at scale, and guardrails that catch hallucinated or off-brand output before a user sees it. That system design is what separates a demo from a product.",
  },
  {
    question: 'What is RAG and do I need it?',
    answer:
      "Retrieval-augmented generation (RAG) means the model looks up relevant information from your own documents, database, or knowledge base before answering, instead of relying only on what it learned during training. You need it any time accuracy matters and the answer depends on your specific data — support docs, internal policies, product catalogs, case history. We design the retrieval pipeline (chunking, embeddings, vector search) alongside the generation layer.",
  },
  {
    question: 'How do you keep the AI from hallucinating or going off-brand?',
    answer:
      'Grounding answers in retrieved source material rather than raw model knowledge, constraining output format, adding confidence thresholds that fall back to "I don\'t know" or a human handoff instead of guessing, and running structured evaluation sets before launch and after every prompt or model change. We treat this as a core deliverable, not an afterthought.',
  },
  {
    question: 'How much does generative AI development cost?',
    answer:
      'It depends on scope — a single RAG-powered feature is a smaller build than a full multi-modal product. TrivianEdge offshore teams typically save clients up to 40% versus hiring the equivalent AI engineering talent locally in Canada, the US, or the UK. Contact us for a scoped estimate based on your specific product.',
  },
  {
    question: 'Who owns the models, prompts, and code you build?',
    answer:
      "You do — 100% of the code, prompt templates, evaluation sets, and any fine-tuned assets. TrivianEdge never retains rights to what we build for your business, and this is written into every engagement agreement.",
  },
];

const INCLUDED = [
  { icon: Search, label: 'RAG Pipeline Design' },
  { icon: MessageSquare, label: 'Prompt Engineering & Evaluation' },
  { icon: Palette, label: 'Multi-Modal Generation' },
  { icon: ShieldCheck, label: 'Hallucination Guardrails' },
  { icon: Layers, label: 'Streaming & Copilot UX' },
];

const STATS = [
  { value: '30 Days', label: 'To Deployed Team' },
  { value: 'Up to 40%', label: 'Cost Reduction' },
  { value: '6', label: 'Sourcing Countries' },
  { value: '100%', label: 'IP Ownership' },
];

const GenerativeAIPage: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <SEOHead
        title="Generative AI Development Services | TrivianEdge"
        description="TrivianEdge builds generative AI products — RAG systems, AI copilots, and content generation tools — with an offshore team deployed in 30 days."
        schema={[
          serviceSchema(
            'Generative AI Development',
            'Artificial Intelligence Development',
            'https://www.trivianedge.com/services/ai-development/generative-ai',
          ),
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: 'Home', url: 'https://www.trivianedge.com' },
            { name: 'Services', url: 'https://www.trivianedge.com/services' },
            { name: 'AI Development', url: 'https://www.trivianedge.com/services/ai-development' },
            {
              name: 'Generative AI Development',
              url: 'https://www.trivianedge.com/services/ai-development/generative-ai',
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
            <li className="text-text font-medium">Generative AI</li>
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
              Generative AI Development
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-text mb-6 leading-tight">
              Generative AI:{' '}
              <span className="text-cyan-400">Products That Create, Not Just Predict</span>
            </h1>
            <p className="text-muted text-lg max-w-2xl mx-auto mb-8">
              RAG systems, AI copilots, and content generation tools built on GPT-4o, Claude, and
              open-source models — grounded in your data, deployed by an offshore team in 30 days.
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

        {/* What is generative AI development */}
        <section className="py-20 px-4 md:px-6">
          <div className="max-w-3xl mx-auto reveal">
            <h2 className="text-3xl font-bold text-text mb-6">
              What Generative AI Development Actually Involves
            </h2>
            <p className="text-muted text-lg leading-relaxed mb-4">
              Calling a model's API is the trivial part. The real work is retrieval — grounding
              answers in your own documents, database, or knowledge base so the model isn't
              guessing — plus prompt engineering, output structure, streaming UX, and guardrails
              that catch hallucinated or off-brand output before a user ever sees it.
            </p>
            <p className="text-muted text-lg leading-relaxed">
              If you need an existing model wired into your product without a custom retrieval
              layer,{' '}
              <Link to="/services/ai-development/llm-integration" className="text-cyan-400 hover:underline">
                LLM Integration
              </Link>{' '}
              is often the faster, lighter-weight path. Generative AI development is for when the
              product needs to create content grounded in your specific data or brand voice.
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
              Why Teams Build Generative AI With TrivianEdge
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
              Is Generative AI Development Right for You?
            </h2>
            <div className="space-y-4">
              {[
                { title: 'You want an AI copilot embedded in your product', desc: 'SaaS teams adding an in-app assistant that helps users get things done, not just answer questions in a sidebar.' },
                { title: 'You need answers grounded in your own data', desc: 'Support docs, internal policies, product catalogs, or case history — RAG makes the model accurate to your specific business, not just generally knowledgeable.' },
                { title: 'You produce content at volume', desc: 'Marketing, media, or e-commerce teams that need generation tools for copy, summaries, or product descriptions, tuned to a consistent brand voice.' },
                { title: 'Accuracy and trust matter', desc: 'If a wrong or hallucinated answer has real cost, you need the retrieval, evaluation, and guardrail work — not just a raw API call.' },
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
              Everything you need to know about generative AI development with TrivianEdge.
            </p>
            <Accordion items={FAQS} />
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center reveal">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
              Build Your Generative AI Product
            </h2>
            <p className="text-muted mb-8">
              Let's scope the retrieval, the guardrails, and the team to ship it in 30 days.
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

export default GenerativeAIPage;
