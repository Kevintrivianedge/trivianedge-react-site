import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Server,
  Layers,
  Users,
  Database,
  DollarSign,
  UserCheck,
  Clock,
  TrendingDown,
  Globe2,
  CheckCircle2,
} from 'lucide-react';
import SEOHead from '../../components/SEOHead';
import Accordion from '../../components/Accordion';
import { serviceSchema, faqSchema, breadcrumbSchema } from '../../utils/seo';

const FAQS = [
  {
    question: 'What is BPO?',
    answer:
      'Business Process Outsourcing (BPO) is when a company delegates non-core operations to an expert provider like TrivianEdge, reducing costs and increasing efficiency.',
  },
  {
    question: 'How much does BPO cost in Canada?',
    answer:
      'TrivianEdge BPO services reduce operational costs by up to 40% versus in-house teams. Contact us for a custom quote.',
  },
  {
    question: 'How fast can TrivianEdge deploy a BPO team?',
    answer: 'We deploy fully operational offshore BPO teams within 30 days.',
  },
  {
    question: 'What does TrivianEdge BPO cover?',
    answer:
      'IT support, back-office operations, customer service, data entry, finance processing, and more.',
  },
  {
    question: 'Is TrivianEdge BPO available outside Canada?',
    answer:
      'Yes. We serve clients in the US, UK, Australia and globally across 6 time zones.',
  },
];

const SERVICES = [
  { icon: Server, label: 'IT Support' },
  { icon: Layers, label: 'Back-Office Operations' },
  { icon: Users, label: 'Customer Service' },
  { icon: Database, label: 'Data Management' },
  { icon: DollarSign, label: 'Finance Processing' },
  { icon: UserCheck, label: 'HR Administration' },
];

const STATS = [
  { value: '30 Days', label: 'Deployment' },
  { value: '40%', label: 'Cost Savings' },
  { value: '6', label: 'Time Zones' },
  { value: '100%', label: 'Embedded' },
];

const BPOPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="BPO Services Canada | Business Process Outsourcing | TrivianEdge"
        description="Reduce costs by 40% with TrivianEdge's BPO services. Expert offshore teams deployed in 30 days across 6 time zones. Free consultation."
        schema={[
          serviceSchema(
            'BPO Services',
            'Business Process Outsourcing',
            'https://www.trivianedge.com/services/bpo',
          ),
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: 'Home', url: 'https://www.trivianedge.com' },
            { name: 'Services', url: 'https://www.trivianedge.com/services' },
            {
              name: 'BPO Services',
              url: 'https://www.trivianedge.com/services/bpo',
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
              Business Process Outsourcing
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-text mb-6 leading-tight">
              BPO Services Canada —{' '}
              <span className="text-cyan-400">
                Business Process Outsourcing
              </span>
            </h1>

            {/* Trust bar */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {[
                { icon: Clock, label: '30-Day Deployment' },
                { icon: TrendingDown, label: '40% Cost Savings' },
                { icon: Globe2, label: '6 Time Zones' },
                { icon: CheckCircle2, label: 'Canada-Based' },
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

        {/* What is BPO */}
        <section className="py-20 px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-6">
              What is Business Process Outsourcing?
            </h2>
            <p className="text-muted text-lg leading-relaxed">
              BPO services Canada companies rely on allow businesses to delegate
              non-core functions — from IT support and customer service to
              finance processing and HR administration — to a specialist partner
              like TrivianEdge. By outsourcing these operations, you eliminate
              costly in-house overhead and gain access to a dedicated offshore
              team deployed in just 30 days. Whether you need back-office
              support or full-cycle{' '}
              <Link
                to="/services/rpo"
                className="text-cyan-400 hover:underline"
              >
                RPO services
              </Link>
              , TrivianEdge delivers measurable results across 6 time zones.
            </p>
          </div>
        </section>

        {/* What BPO Covers */}
        <section className="py-20 px-4 md:px-6 bg-surface/30">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-12 text-center">
              What TrivianEdge BPO Covers
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {SERVICES.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="glass rounded-2xl p-6 border-border flex flex-col items-center gap-3 text-center"
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

        {/* Why Choose */}
        <section className="py-20 px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-12 text-center">
              Why Choose TrivianEdge BPO?
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {STATS.map(({ value, label }) => (
                <div
                  key={label}
                  className="glass rounded-2xl p-6 border-border text-center"
                >
                  <p className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">
                    {value}
                  </p>
                  <p className="text-muted text-sm font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 px-4 md:px-6 bg-surface/30">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-10 text-center">
              Frequently Asked Questions
            </h2>
            <Accordion items={FAQS} />
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
              Deploy Your BPO Team in 30 Days
            </h2>
            <p className="text-muted mb-8">
              Reduce costs, scale faster, and focus on what you do best.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-background font-bold rounded-full transition-colors"
            >
              Get a Free Consultation
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default BPOPage;
