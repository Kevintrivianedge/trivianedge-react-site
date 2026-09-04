import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Users2, ShieldCheck, Cpu, Server } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import RelatedLinks from '../components/RelatedLinks';
import { breadcrumbSchema } from '../utils/seo';
import { COMPARISONS } from '../constants/comparisons';
import { INDUSTRIES } from '../constants/industries';

const SERVICES_HUB = [
  {
    title: 'Business Process Outsourcing',
    shortName: 'BPO',
    href: '/services/bpo',
    icon: ShieldCheck,
    accent: 'text-cyan-400',
    iconBg: 'from-cyan-400/20 to-cyan-400/5',
    iconBorder: 'border-cyan-400/25',
    glow: 'bg-cyan-400/8',
    description: 'Offshore teams that handle your back-office, support, finance, and ops. Fully managed, 30-day deployment, no foreign entity needed.',
    tags: ['Back-Office', 'Customer Support', 'Finance & Accounting', 'HR Admin'],
  },
  {
    title: 'Recruitment Process Outsourcing',
    shortName: 'RPO',
    href: '/services/rpo',
    icon: Users2,
    accent: 'text-cyan-400',
    iconBg: 'from-cyan-400/20 to-cyan-400/5',
    iconBorder: 'border-cyan-400/25',
    glow: 'bg-cyan-400/8',
    description: 'We run your entire hiring process as an embedded part of your team — sourcing, screening, interviewing, and onboarding at scale.',
    tags: ['Full-Cycle Hiring', 'AI-Powered Screening', 'Executive Search', 'Volume Recruitment'],
  },
  {
    title: 'Bespoke Software Development',
    shortName: 'Bespoke',
    href: '/services/it-outsourcing',
    icon: Server,
    accent: 'text-cyan-400',
    iconBg: 'from-cyan-400/20 to-cyan-400/5',
    iconBorder: 'border-cyan-400/25',
    glow: 'bg-cyan-400/8',
    description: 'Custom software, built by dedicated offshore engineering teams you own end to end, plus the DevOps, QA, and IT outsourcing to keep it running.',
    tags: ['Custom Development', 'Full-Stack Engineering', 'DevOps & Cloud', 'QA & Testing'],
  },
  {
    title: 'AI Development',
    shortName: 'AI Dev',
    badge: 'A Bespoke Software Specialty',
    href: '/services/ai-development',
    icon: Cpu,
    accent: 'text-cyan-400',
    iconBg: 'from-cyan-400/20 to-cyan-400/5',
    iconBorder: 'border-cyan-400/25',
    glow: 'bg-cyan-400/8',
    description: 'Custom AI products, LLM integrations, and machine learning pipelines, our deepest specialty within bespoke software. You own 100% of the code.',
    tags: ['LLM Integration', 'Generative AI', 'ML Pipelines', 'AI Automation'],
  },
];

const ServicesPage: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <SEOHead
        title="Services | TrivianEdge — BPO, RPO & Bespoke Software Development"
        description="Explore TrivianEdge's full service offering: BPO, RPO, bespoke software, and AI development. Offshore teams deployed in 30 days across 6 countries."
        canonical="https://www.trivianedge.com/services"
        structuredData={[
          breadcrumbSchema([
            { name: 'Home', url: 'https://www.trivianedge.com' },
            { name: 'Services', url: 'https://www.trivianedge.com/services' },
          ]),
        ]}
      />

      <div className="bg-background min-h-screen text-text">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-2">
          <ol className="flex items-center gap-2 text-xs text-muted">
            <li><Link to="/" className="hover:text-cyan-400 transition-colors">Home</Link></li>
            <li className="text-border">/</li>
            <li className="text-text font-medium">Services</li>
          </ol>
        </nav>

        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 0.6 }}
          className="pt-10 pb-16 px-4 md:px-6 text-center"
        >
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-mono tracking-widest uppercase text-cyan-400 mb-4">
              What we do
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-text mb-6 leading-tight">
              Everything we do,{' '}
              <span className="text-cyan-400">in one place.</span>
            </h1>
            <p className="text-muted text-lg leading-relaxed max-w-2xl mx-auto mb-8">
              TrivianEdge is a BPO, RPO, and bespoke software development company, AI development included as part of that software practice. One partner, three core lines, 30-day deployment.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base premium-button btn-magnetic micro-press-button"
            >
              Start the conversation
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.section>

        {/* Service Cards */}
        <section className="py-16 px-4 md:px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
            {SERVICES_HUB.map((service, idx) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.shortName}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: shouldReduceMotion ? 0.01 : 0.5, delay: shouldReduceMotion ? 0 : idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={service.href}
                    className="block bg-background rounded-[1.75rem] p-8 md:p-10 border border-border relative overflow-hidden group hover:border-cyan-400/30 transition-all duration-300"
                    style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}
                  >
                    <div className={`absolute -top-8 -right-8 w-32 h-32 ${service.glow} blur-3xl pointer-events-none rounded-full`} />
                    <div className="flex items-start gap-4 mb-5">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${service.iconBg} border ${service.iconBorder} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`w-6 h-6 ${service.accent}`} />
                      </div>
                      <div className="min-w-0">
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border ${service.iconBorder} ${service.accent} opacity-70`}>
                          {service.shortName}
                        </span>
                        {'badge' in service && service.badge && (
                          <span className="ml-2 text-[9px] font-bold uppercase tracking-widest text-muted">
                            {service.badge}
                          </span>
                        )}
                        <h2 className="text-xl font-bold text-text mt-2">{service.title}</h2>
                      </div>
                    </div>
                    <p className="text-text/60 text-sm leading-relaxed mb-5">{service.description}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {service.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-surface border border-border text-muted">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className={`flex items-center gap-1.5 text-sm font-bold ${service.accent} group-hover:gap-3 transition-all duration-200`}>
                      Learn more <ArrowRight className="w-4 h-4" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        <RelatedLinks
          title="Compare your options"
          links={COMPARISONS.map(c => ({ label: c.title, desc: c.subtitle, to: `/compare/${c.slug}` }))}
        />

        <RelatedLinks
          title="Industries we serve"
          links={INDUSTRIES.map(i => ({ label: i.name, desc: i.tagline, to: `/industries/${i.slug}` }))}
        />

        {/* Bottom CTA */}
        <section className="py-20 px-4 md:px-6 text-center border-t border-border">
          <div className="max-w-xl mx-auto">
            <p className="text-muted text-base mb-2">Not sure which service fits?</p>
            <h2 className="text-2xl font-bold text-text mb-6">Tell us what you need. We'll figure it out.</h2>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base premium-button btn-magnetic"
            >
              Free consultation
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default ServicesPage;
