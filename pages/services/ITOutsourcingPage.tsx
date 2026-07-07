import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
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
import Accordion from '../../components/Accordion';
import { serviceSchema, faqSchema, breadcrumbSchema } from '../../utils/seo';

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

const FAQS = [
  {
    question: 'What is IT outsourcing and how does it work?',
    answer:
      'IT outsourcing means partnering with an external company to manage or deliver technology functions on your behalf. Instead of building an in-house engineering team, you work with TrivianEdge to access skilled developers, cloud engineers, and IT specialists from global talent hubs. We handle sourcing, contracts, payroll, and day-to-day management, so your team can focus on core product work.',
  },
  {
    question: 'How quickly can TrivianEdge deploy an IT outsourcing team?',
    answer:
      'TrivianEdge deploys offshore IT teams in 30 days or less. After an initial discovery call, we search our network across the Philippines, Sri Lanka, Vietnam, Turkey, and Eastern Europe and present matched candidates within days. Once approved, your team is onboarded and embedded into your existing workflow within the 30-day window.',
  },
  {
    question: 'What IT outsourcing services does TrivianEdge provide?',
    answer:
      'TrivianEdge delivers custom software development, web and mobile application development, cybersecurity and compliance support, cloud infrastructure and DevOps, CI/CD and engineering operations, and systems integration. All delivered as dedicated offshore teams built to match your tech stack and time zone.',
  },
  {
    question: 'How much can I save with IT outsourcing through TrivianEdge?',
    answer:
      'Most clients save between 40% and 60% on engineering costs compared to local hiring. Our offshore talent hubs in the Philippines, Sri Lanka, and Eastern Europe provide senior-level developers and engineers at significantly lower rates than North American or Western European markets, with no compromise on quality or communication.',
  },
  {
    question: 'Is TrivianEdge a Canadian IT outsourcing company?',
    answer:
      'Yes. TrivianEdge is headquartered in Toronto, Ontario, Canada. We are a Canada-based IT outsourcing and offshore software development company serving clients across North America, the UK, Australia, and the Middle East. Our operations, contracts, and client management are run from Canada, giving you a local partner with global reach.',
  },
  {
    question: 'What is the difference between IT outsourcing and offshore software development?',
    answer:
      'IT outsourcing is the broader practice of delegating technology functions to an external provider. Offshore software development specifically means that the development team is located in another country. TrivianEdge offers both: managed IT outsourcing from Canada and dedicated offshore development teams across multiple time zones.',
  },
  {
    question: 'Can I outsource just one part of my IT function?',
    answer:
      'Absolutely. TrivianEdge scales to your needs. You can outsource a single function like DevOps, QA testing, or backend development, or engage us for a full offshore engineering team. We build the right model for your stage, whether you are a startup needing your first dedicated developer or an enterprise scaling a distributed team.',
  },
  {
    question: 'How does TrivianEdge ensure code quality and security for offshore teams?',
    answer:
      'All candidates go through a rigorous vetting process including technical assessments, communication evaluations, and background checks. Offshore teams follow your code review processes, use your tooling, and integrate with your project management and CI/CD pipelines. We also support compliance requirements including SOC 2 and ISO 27001 alignment.',
  },
];

const ITOutsourcingPage: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <SEOHead
        title="IT Outsourcing Canada | Offshore Software Development | TrivianEdge"
        description="Access global tech talent with TrivianEdge. IT outsourcing and offshore software development teams. 30-day deployment. Up to 40% cost savings."
        keywords="IT outsourcing Canada, offshore software development, IT outsourcing company, managed IT services, offshore development team, software development outsourcing, TrivianEdge IT outsourcing"
        schema={[
          serviceSchema(
            'IT Outsourcing Services',
            'Information Technology Outsourcing',
            'https://www.trivianedge.com/services/it-outsourcing',
          ),
          faqSchema(FAQS.map((f) => ({ question: f.question, answer: f.answer }))),
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
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-2">
          <ol className="flex items-center gap-2 text-xs text-muted">
            <li><Link to="/" className="hover:text-cyan-400 transition-colors">Home</Link></li>
            <li className="text-border">/</li>
            <li><Link to="/services" className="hover:text-cyan-400 transition-colors">Services</Link></li>
            <li className="text-border">/</li>
            <li className="text-text font-medium">IT Outsourcing</li>
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
              IT Outsourcing & Offshore Development
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-text mb-6 leading-tight">
              IT Outsourcing Canada:{' '}
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
              IT outsourcing is the practice of partnering with an external company to deliver technology functions — like software development, cloud infrastructure, or systems integration — instead of building and managing an in-house engineering team. TrivianEdge builds managed offshore software teams across custom development, cloud, security, and systems integration in about 30 days. Pair IT outsourcing with our{' '}
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

        {/* FAQ */}
        <section className="py-20 px-4 md:px-6 bg-surface/30">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-4 text-center">
              Frequently Asked Questions
            </h2>
            <p className="text-muted text-center mb-10">
              Everything you need to know about IT outsourcing and offshore software development with TrivianEdge.
            </p>
            <Accordion items={FAQS} />
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

export default ITOutsourcingPage;
