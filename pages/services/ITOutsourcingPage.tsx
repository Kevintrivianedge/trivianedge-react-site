import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Code2,
  Globe,
  Shield,
  Cloud,
  GitBranch,
  Layers,
  Clock,
  TrendingDown,
  Globe2,
  CheckCircle2,
} from 'lucide-react';
import SEOHead from '../../components/SEOHead';
import { serviceSchema, breadcrumbSchema } from '../../utils/seo';

const IT_SERVICES = [
  { icon: Code2, label: 'Custom Software Development' },
  { icon: Globe, label: 'Web & Mobile Applications' },
  { icon: Shield, label: 'Cybersecurity & Compliance' },
  { icon: Cloud, label: 'Cloud Infrastructure & DevOps' },
  { icon: GitBranch, label: 'CI/CD & Engineering Ops' },
  { icon: Layers, label: 'Systems Integration' },
];

const STATS = [
  { value: '30 Days', label: 'Deployment' },
  { value: '40%', label: 'Cost Savings' },
  { value: '6', label: 'Time Zones' },
  { value: '100%', label: 'Embedded' },
];

const ITOutsourcingPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="IT Outsourcing Canada | Offshore Software Development | TrivianEdge"
        description="Access global tech talent with TrivianEdge. IT outsourcing and offshore software development teams. 30-day deployment. Up to 40% cost savings."
        schema={[
          serviceSchema(
            'IT Outsourcing Services',
            'Information Technology Outsourcing',
            'https://www.trivianedge.com/services/it-outsourcing',
          ),
          breadcrumbSchema([
            { name: 'Home', url: 'https://www.trivianedge.com' },
            { name: 'Services', url: 'https://www.trivianedge.com/services' },
            {
              name: 'IT Outsourcing',
              url: 'https://www.trivianedge.com/services/it-outsourcing',
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
              IT Outsourcing & Offshore Development
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-text mb-6 leading-tight">
              IT Outsourcing Canada —{' '}
              <span className="text-cyan-400">
                Offshore Software Development Teams
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

        {/* What is IT Outsourcing */}
        <section className="py-20 px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-6">
              What is IT Outsourcing?
            </h2>
            <p className="text-muted text-lg leading-relaxed">
              IT outsourcing Canada companies use to access world-class
              engineering talent without the cost and timeline of local hiring.
              TrivianEdge delivers fully managed offshore software development
              teams across custom software, cloud infrastructure, cybersecurity,
              and systems integration — deployed within 30 days. Whether you
              need a full engineering squad or specialist support, our offshore
              teams integrate seamlessly with your existing workflow. Pair IT
              outsourcing with our{' '}
              <Link
                to="/services/ai-development"
                className="text-cyan-400 hover:underline"
              >
                AI development services
              </Link>{' '}
              or{' '}
              <Link
                to="/services/rpo"
                className="text-cyan-400 hover:underline"
              >
                RPO services
              </Link>{' '}
              to build a complete offshore operating model.
            </p>
          </div>
        </section>

        {/* Services We Deliver */}
        <section className="py-20 px-4 md:px-6 bg-surface/30">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-12 text-center">
              Services We Deliver
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {IT_SERVICES.map(({ icon: Icon, label }) => (
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

        {/* Why Offshore */}
        <section className="py-20 px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-12 text-center">
              Why Offshore with TrivianEdge?
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

        {/* CTA */}
        <section className="py-24 px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
              Build Your Offshore Team in 30 Days
            </h2>
            <p className="text-muted mb-8">
              Cut costs, scale faster, and stay focused on your core product.
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

export default ITOutsourcingPage;
