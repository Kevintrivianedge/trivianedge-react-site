import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
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
    question: 'What is BPO and how does it work?',
    answer:
      'Business Process Outsourcing (BPO) means hiring an outside company to run specific parts of your business operations — like customer support, data entry, back-office admin, or finance processing. Instead of building and managing those teams yourself, TrivianEdge recruits, hires, onboards, and manages them for you. You get the output without the overhead.',
  },
  {
    question: 'How much does BPO cost in Canada?',
    answer:
      'Most TrivianEdge clients reduce operational costs by 40–60% compared to hiring locally in Canada, the US, or the UK. The exact savings depend on the role type, team size, and country. Our offshore talent hubs in the Philippines, Vietnam, Sri Lanka, and Eastern Europe offer senior-level staff at significantly lower rates than North American markets. Contact us for a custom quote.',
  },
  {
    question: 'How quickly can TrivianEdge deploy a BPO team?',
    answer:
      'We deploy fully operational offshore BPO teams within 30 days. After an initial discovery call, we identify the right talent, run screening, handle contracts and payroll setup, and integrate the team into your workflow — all within the 30-day window.',
  },
  {
    question: 'What types of work does TrivianEdge BPO cover?',
    answer:
      'We handle IT support, back-office operations, customer service, data entry and processing, finance and accounting tasks, HR administration, and more. Both technical and non-technical roles are in scope. If your business needs a repetitive or volume-heavy function handled reliably, BPO is the right solution.',
  },
  {
    question: 'What countries does TrivianEdge source BPO talent from?',
    answer:
      'We source from the Philippines, Vietnam, Sri Lanka, Turkey, South Africa, and Costa Rica. Each hub is selected for English proficiency, talent quality, and timezone alignment with North American, UK, and Australian clients.',
  },
  {
    question: 'How is TrivianEdge BPO different from a traditional call center?',
    answer:
      'A call center is a specific type of BPO focused on inbound and outbound phone support. TrivianEdge BPO covers a much broader range — back-office admin, finance, data, IT support, and operations. We also go beyond just placing staff: we manage compliance, payroll, performance, and daily operations so you never deal with the admin side.',
  },
  {
    question: 'Do I need to set up a foreign entity to use TrivianEdge BPO?',
    answer:
      'No. That is the entire point. TrivianEdge acts as your employer of record in each country. You never need to register a local company, open a foreign payroll account, or navigate local employment law. We handle all of that so you can hire globally without any entity setup.',
  },
  {
    question: 'Can I manage the BPO team directly?',
    answer:
      'Yes. Your offshore BPO team is fully embedded into your workflow. They use your tools, follow your processes, and report to your managers. TrivianEdge handles all the HR, compliance, and payroll administration in the background — you run the day-to-day work.',
  },
  {
    question: 'What industries benefit most from BPO services?',
    answer:
      'BPO works across virtually every industry: technology companies, e-commerce, financial services, healthcare administration, logistics, legal firms, and professional services. Any business with operational tasks that do not require physical presence in a specific city is a strong BPO candidate.',
  },
  {
    question: 'How do you ensure quality and accountability in offshore BPO teams?',
    answer:
      'Every candidate goes through multi-stage screening covering technical skill, English communication, and role-specific assessments. Once placed, performance is tracked against clear KPIs. TrivianEdge handles performance management and escalation so quality issues get addressed immediately, not weeks later.',
  },
  {
    question: 'What is the minimum team size for TrivianEdge BPO?',
    answer:
      'We can deploy a single offshore role or a team of 50+. Most clients start with 1–3 people and scale over time. There is no minimum headcount requirement.',
  },
  {
    question: 'Is TrivianEdge BPO available outside Canada?',
    answer:
      'Yes. TrivianEdge is headquartered in Toronto, Canada, but we serve clients across the US, UK, Australia, the Middle East, and Europe. Our operations model is built for global delivery.',
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
  const shouldReduceMotion = useReducedMotion();

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
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-2">
          <ol className="flex items-center gap-2 text-xs text-muted">
            <li><Link to="/" className="hover:text-cyan-400 transition-colors">Home</Link></li>
            <li className="text-border">/</li>
            <li><Link to="/services" className="hover:text-cyan-400 transition-colors">Services</Link></li>
            <li className="text-border">/</li>
            <li className="text-text font-medium">BPO</li>
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
              Business Process Outsourcing
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-text mb-6 leading-tight">
              BPO Services Canada:{' '}
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
              Business Process Outsourcing (BPO) is the practice of hiring an external partner to run specific business operations — like customer support, back-office admin, or finance processing — on your behalf. TrivianEdge builds offshore BPO teams that plug into your business in about 30 days, handling the work cleanly so your team can focus on what matters most. Whether you need back-office support or full-cycle{' '}
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

        {/* How it works */}
        <section className="py-20 px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-4">
              How TrivianEdge BPO Works
            </h2>
            <p className="text-muted text-lg mb-12 leading-relaxed">
              From your first call to your team's first day of work, the whole process takes about 30 days.
            </p>
            <div className="space-y-8">
              {[
                {
                  step: '01',
                  title: 'Discovery call',
                  desc: 'We learn what your business needs: which functions to outsource, what skills are required, and how your team works. This usually takes 30–60 minutes.',
                },
                {
                  step: '02',
                  title: 'We find and screen candidates',
                  desc: 'Our team searches across 6 talent hubs, runs technical assessments, and screens for communication skills and role fit. We only present candidates who are genuinely ready.',
                },
                {
                  step: '03',
                  title: 'You approve and we handle the rest',
                  desc: 'Once you select your team, TrivianEdge handles contracts, payroll setup, compliance filings, and equipment. You do none of the admin work.',
                },
                {
                  step: '04',
                  title: 'Your team starts work',
                  desc: 'Your offshore BPO team integrates into your workflow, using your tools and reporting to your managers. TrivianEdge handles all ongoing HR and payroll in the background.',
                },
              ].map(item => (
                <div key={item.step} className="flex gap-6">
                  <div className="text-4xl font-bold text-cyan-400/30 leading-none w-12 shrink-0">{item.step}</div>
                  <div>
                    <h3 className="font-bold text-text text-lg mb-2">{item.title}</h3>
                    <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why TrivianEdge */}
        <section className="py-20 px-4 md:px-6 bg-surface/30">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-6">
              What Makes TrivianEdge BPO Different
            </h2>
            <div className="space-y-4">
              {[
                { title: 'We act as your employer of record', desc: 'No foreign entity setup needed. We are the legal employer in each country, which means you hire globally without any of the legal complexity.' },
                { title: 'Payroll and compliance are our problem, not yours', desc: 'Taxes, statutory deductions, local employment law, data privacy compliance — all handled correctly in every jurisdiction, every month.' },
                { title: 'You control the work, we control the operations', desc: 'Your BPO team follows your processes and reports to your managers. TrivianEdge manages HR, performance, and admin in the background.' },
                { title: 'We scale with you', desc: 'Start with one person, grow to 50. There is no long-term contract forcing you to maintain a fixed headcount. Scale up or down as your business requires.' },
              ].map(item => (
                <div key={item.title} className="glass rounded-2xl border-border p-6">
                  <h3 className="font-bold text-text mb-2">{item.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-text mb-4 text-center">
              Frequently Asked Questions
            </h2>
            <p className="text-muted text-center mb-10">
              Everything you need to know about BPO services and working with TrivianEdge.
            </p>
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

export default BPOPage;
