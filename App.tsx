import React, { useEffect, useState, useMemo, lazy, Suspense } from 'react';
import { AnimatePresence, motion, useReducedMotion, useInView } from 'framer-motion';
import {
  ArrowRight,
  ChevronRight,
  Zap,
  Mail,
  Linkedin,
  Twitter,
  Layers,
  CheckCircle2,
  TrendingUp,
  Users2,
  ShieldCheck,
} from 'lucide-react';
import { Routes, Route, useLocation, useNavigate, Link } from 'react-router-dom';
import { TALENT_HUBS, STEPS } from './constants';
import { CASE_STUDIES, TESTIMONIALS } from './constants/proof';
import { TalentHub } from './types';
import { LanguageProvider } from './contexts/LanguageContext';
import { GeoProvider } from './contexts/GeoContext';
import Preloader from './components/Preloader';
import { ThemeProvider } from './contexts/ThemeContext';
import SEOHead from './components/SEOHead';
import AlgorithmMonitor from './components/AlgorithmMonitor';
import InquiryForm from './components/InquiryForm';
import { useAlgorithmIntelligence } from './hooks/useAlgorithmIntelligence';
import {
  buildOrganizationSchema,
  buildWebSiteSchema,
  buildServiceSchema,
  buildArticleSchema,
  buildSoftwareApplicationSchema,
  buildLocalBusinessSchema,
  buildBPOFAQSchema,
  breadcrumbSchema,
  buildWebPageSchema,
  buildServiceItemListSchema,
  buildBPOHowToSchema,
  faqSchema,
  SEO_CONFIG,
  ALL_KEYWORDS,
  KEYWORD_CLUSTERS,
} from './utils/seo';
import { getSEOTrendSignal, getTrendKeywords } from './utils/seoTrends';

// Extracted components
import Logo from './components/Logo';
import Navbar from './components/Navbar';
import Accordion from './components/Accordion';
import ProcessTimeline from './components/ProcessTimeline';
import TalentHubCard from './components/TalentHubCard';
import ScrollToTop from './components/ScrollToTop';
import { ErrorBoundary } from './components/ErrorBoundary';
import WorldMapSVG from './components/WorldMapSVG';

// Lazy-load route-level pages and heavy below-fold interactive modules.
// This splits each into its own chunk so the main bundle only contains
// the above-the-fold home page content.
const TalentHubModal          = lazy(() => import('./components/TalentHubModal').then(m => ({ default: m.TalentHubModal })));
const BlogView                = lazy(() => import('./components/BlogView'));
const BlogPostDetail          = lazy(() => import('./components/BlogPostDetail'));
const ContactPage             = lazy(() => import('./pages/ContactPage'));
const ProofPage               = lazy(() => import('./pages/ProofPage'));
const TrustPage               = lazy(() => import('./pages/TrustPage'));
const PrivacyPage             = lazy(() => import('./pages/PrivacyPage'));
const TermsPage               = lazy(() => import('./pages/TermsPage'));
const BPOPage                 = lazy(() => import('./pages/services/BPOPage'));
const RPOPage                 = lazy(() => import('./pages/services/RPOPage'));
const AIDevelopmentPage       = lazy(() => import('./pages/services/AIDevelopmentPage'));
const ITOutsourcingPage       = lazy(() => import('./pages/services/ITOutsourcingPage'));
const VentureStudioPage       = lazy(() => import('./pages/VentureStudioPage'));
const ServicesPage            = lazy(() => import('./pages/ServicesPage'));
const NotFoundPage            = lazy(() => import('./pages/NotFoundPage'));
const ChatSidebar             = lazy(() => import('./components/ChatSidebar'));


// Trust strip — real named clients only, kept separate from the hero's numeric stats
// so the strip isn't mixing unlike content types (numbers, names, flags) in one place.
const TRUST_CLIENTS = ['Cargo Login', 'Keynotive', 'Hub-Flx'];

const PREMIUM_FEATURES = [
  {
    title: 'We Find the People',
    description: 'Tell us the role and the skills you need. We search across six countries, screen every candidate, and only send you people who are ready to start.',
    icon: Users2,
    accent: 'text-cyan-500',
    iconBg: 'from-cyan-400/20 to-cyan-400/5',
    iconBorder: 'border-cyan-400/25',
    glow: 'bg-cyan-400/8',
    metric: '30 days to hire',
    link: '/services/rpo',
  },
  {
    title: 'We Handle the Paperwork',
    description: 'Contracts, payroll, taxes, and local employment laws in every country, all taken care of. You never deal with foreign government offices or compliance filings.',
    icon: ShieldCheck,
    accent: 'text-cyan-500',
    iconBg: 'from-cyan-400/20 to-cyan-400/5',
    iconBorder: 'border-cyan-400/25',
    glow: 'bg-cyan-400/8',
    metric: '6 countries covered',
    link: '/services/bpo',
  },
  {
    title: 'We Keep the Work Moving',
    description: 'With teams across multiple time zones, your work never sits idle overnight. Handoffs are managed, progress is tracked, and issues get flagged before they become problems.',
    icon: TrendingUp,
    accent: 'text-cyan-500',
    iconBg: 'from-cyan-400/20 to-cyan-400/5',
    iconBorder: 'border-cyan-400/25',
    glow: 'bg-cyan-400/8',
    metric: '24/7 coverage',
    link: '/services/it-outsourcing',
  },
  {
    title: 'Tech and Non-Tech, Both',
    description: 'We hire developers, but also customer support, finance, HR, operations, and sales. One partner covers your full team, not just the technical side.',
    icon: Layers,
    accent: 'text-cyan-500',
    iconBg: 'from-cyan-400/20 to-cyan-400/5',
    iconBorder: 'border-cyan-400/25',
    glow: 'bg-cyan-400/8',
    metric: '40% avg. savings',
    link: '/services',
  },
];

const AI_VENTURES = [
  {
    name: 'Trivian ARIA',
    url: 'https://trivian-aria.com/',
    summary: 'AI-first product layer focused on practical automation and decision support systems.',
  },
  {
    name: 'Ancura Trivian',
    url: 'https://www.ancura-trivian.com/',
    summary: 'Specialized venture focused on applied AI workflows and operational intelligence.',
  },
  {
    name: 'TrivanEdge Platform',
    url: 'https://www.trivanedge.com/',
    summary: 'Expansion-facing digital platform in our ecosystem as we build the future with AI.',
  },
];

const HOME_FAQS = [
  {
    question: 'What does TrivianEdge do?',
    answer: 'TrivianEdge helps businesses hire people in other countries and build software. We handle all the hard parts: finding candidates, running payroll, managing local employment law, and keeping your team running. You tell us what you need and we deliver it in about 30 days.',
  },
  {
    question: 'Where is TrivianEdge based?',
    answer: 'TrivianEdge is headquartered in Toronto, Ontario, Canada. We serve clients across North America, the UK, Australia, and the Middle East. Our talent operations span six countries: the Philippines, Vietnam, Sri Lanka, Turkey, South Africa, and Costa Rica.',
  },
  {
    question: 'How quickly can TrivianEdge deploy a team?',
    answer: 'Our standard deployment timeline is 30 days. That covers candidate sourcing, screening, legal setup, payroll, and onboarding. For urgent needs, we can move faster depending on the role type and location.',
  },
  {
    question: 'How much does it cost to work with TrivianEdge?',
    answer: 'Most clients save 40–60% compared to hiring locally in Canada, the US, or the UK. Exact pricing depends on the role, country, and team size. We offer a free consultation where we scope the engagement and give you a clear cost estimate.',
  },
  {
    question: 'What types of roles can TrivianEdge hire for?',
    answer: 'Both technical and non-technical roles. Technical: software engineers, AI developers, DevOps, QA, data scientists. Non-technical: operations, customer support, finance, HR, sales, and executive assistants. We hire the full team, not just developers.',
  },
  {
    question: 'Do I need to set up a company in another country to work with TrivianEdge?',
    answer: 'No. TrivianEdge acts as the employer of record in each country, which means you hire globally without setting up any foreign entities, payroll accounts, or legal structures. We take care of all of that.',
  },
  {
    question: 'What is the difference between BPO and RPO?',
    answer: 'BPO (Business Process Outsourcing) means we run an ongoing business function for you — like customer support, back-office admin, or data processing. RPO (Recruitment Process Outsourcing) means we run your hiring process as an embedded part of your HR team. Both can be combined, and TrivianEdge offers both under one roof.',
  },
  {
    question: 'Can TrivianEdge build software and AI for my business?',
    answer: 'Yes. Our software development team builds custom applications, platforms, and AI-powered tools. We integrate with OpenAI, Anthropic, and other AI APIs, and we build everything from scratch or on top of your existing systems. You own 100% of the code.',
  },
  {
    question: 'How do you handle payroll and legal compliance in other countries?',
    answer: 'We handle it completely. TrivianEdge manages payroll taxes, statutory deductions, employment contracts, and compliance filings in every country where we operate. You receive a single invoice from us. We deal with all the local complexity.',
  },
  {
    question: 'Is there a minimum team size or contract length?',
    answer: 'No minimum headcount — we can start with one person. Contract terms depend on the engagement model. Many clients start with a project-based arrangement and move to an ongoing model once they see results.',
  },
];

// Home page component 9-act narrative arc
const HomePage: React.FC<{ setSelectedHub: (hub: TalentHub | null) => void }> = ({ setSelectedHub }) => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <>
      {/* ===== ACT 1: HERO ===== */}
      <section
        aria-label="Hero"
        className="hero-dark hero-fade-out relative min-h-screen flex flex-col px-4 sm:px-6 overflow-hidden"
      >

        {/* Hero content — flex-1 so it expands and pushes stats to the bottom */}
        <motion.div
          className="flex-1 flex items-center max-w-7xl mx-auto w-full relative z-10 pt-20 pb-8 gap-8 xl:gap-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex-1 min-w-0 max-w-[760px]">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs font-bold tracking-[0.25em] uppercase text-cyan-400 mb-8"
            >
              Canada's Global Operations Partner
            </motion.p>

            <h1 className="display-hero font-bold tracking-tight mb-8 leading-[1.02] text-white">
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                Build the team.
              </motion.span>
              <motion.span
                className="block text-holo"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
              >
                Run the system.
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-white/70 text-xl md:text-2xl max-w-2xl mb-12 md:mb-16 leading-relaxed font-light"
            >
              Offshore teams deployed in 30 days. Hiring, payroll, compliance, and delivery, handled entirely by us.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              <a
                href="#contact"
                onClick={e => { e.preventDefault(); scrollTo('contact'); }}
                className="w-full sm:w-auto px-10 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 group btn-magnetic premium-button micro-press-button"
              >
                Start the conversation
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </a>
              <a
                href="#how-it-works"
                onClick={e => { e.preventDefault(); scrollTo('how-it-works'); }}
                className="w-full sm:w-auto px-10 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 btn-magnetic premium-button-secondary micro-press-button text-white border-white/20 hover:border-white/40 hover:bg-white/5"
              >
                How it works
                <ChevronRight className="w-5 h-5" />
              </a>
            </motion.div>
          </div>

          {/* Right-side floating metric cards — desktop only */}
          <motion.div
            className="hidden lg:flex flex-col gap-4 flex-shrink-0"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.0, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {[
              { value: '30', unit: ' days', label: 'Average time to hire', live: true },
              { value: '40', unit: '%',     label: 'Average cost savings', live: false },
              { value: '6',  unit: '',      label: 'Countries we source from', live: false },
              { value: '24/7', unit: '',    label: 'Operations coverage', live: true },
            ].map((card, i) => (
              <motion.div
                key={card.label}
                className="hero-metric-card"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 1.0 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-center gap-2 mb-1">
                  {card.live && <span className="hero-metric-dot" />}
                  <span className="hero-metric-label">{card.label}</span>
                </div>
                <span className="hero-metric-value">{card.value}<span className="hero-metric-unit">{card.unit}</span></span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Mobile-only 2×2 stat grid — shown below buttons on small screens.
            This is the only stat rendering on mobile; desktop uses the floating
            cards above instead, so the numbers never repeat within a breakpoint. */}
        <motion.div
          className="lg:hidden w-full px-0 pb-10 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto grid grid-cols-2 gap-3">
            {[
              { value: '30 days', label: 'Avg. time to hire' },
              { value: '40%',     label: 'Cost savings' },
              { value: '6',       label: 'Countries sourced' },
              { value: '24/7',    label: 'Ops coverage' },
            ].map(s => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-xl font-bold text-white leading-none mb-1">{s.value}</p>
                <p className="text-[10px] uppercase tracking-widest text-white/45 font-semibold">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ===== ACT 2: TRUST STRIP ===== */}
      <section aria-label="Trust signals" className="py-8 md:py-10 border-y border-border bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-text/35 whitespace-nowrap">Trusted by operators across North America</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {TRUST_CLIENTS.map(name => (
              <span
                key={name}
                className="inline-flex items-center px-5 py-2.5 rounded-full border border-border bg-white text-sm font-bold text-text/70 whitespace-nowrap"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ACT 2B: WHAT WE DO ===== */}
      <section aria-label="What we do" className="section-tint section-shell px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface text-text/70 text-[10px] font-bold uppercase tracking-widest mb-6 float-badge">
              <ShieldCheck className="w-3 h-3" />
              What we do
            </div>
            <h2 className="display-section text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-text">
              We hire people for your business.<br />
              <span className="text-holo">In any country. In 30 days.</span>
            </h2>
            <p className="text-muted text-lg max-w-3xl mx-auto">
              Most companies juggle three or four vendors for hiring, payroll, and software. We bring people and software delivery under one roof, so nothing falls through the cracks.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 reveal">
            {PREMIUM_FEATURES.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.article
                  key={feature.title}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: shouldReduceMotion ? 0.01 : 0.55, delay: shouldReduceMotion ? 0 : idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="card-glow bg-white rounded-[1.75rem] p-7 md:p-9 border border-border relative overflow-hidden group cursor-pointer hover:border-cyan-400/30 transition-colors duration-300"
                  style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}
                  onClick={() => navigate(feature.link)}
                >
                  <div className={`absolute -top-8 -right-8 w-32 h-32 ${feature.glow} blur-3xl pointer-events-none rounded-full`} />
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.iconBg} border ${feature.iconBorder} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-6 h-6 ${feature.accent}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h3 className="text-xl font-bold text-text">{feature.title}</h3>
                        <span className={`hidden md:inline text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border ${feature.iconBorder} ${feature.accent} opacity-70 whitespace-nowrap`}>{feature.metric}</span>
                      </div>
                      <p className="text-text/60 text-sm leading-relaxed mb-3">{feature.description}</p>
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider ${feature.accent} group-hover:gap-2 transition-all duration-200`}>
                        Learn more <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>

          {/* Closing statement + link to the full services catalogue, replacing what
              used to be two separate sections (a "vs. traditional BPO" comparison and
              a services bento grid) that repeated this same content. */}
          <div className="mt-10 reveal flex flex-col items-center gap-6 text-center">
            <p className="text-xl md:text-2xl font-bold text-holo max-w-2xl">
              Outsourcing the task is easy. Building the system takes experience.
            </p>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-cyan-600 hover:text-cyan-700 transition-colors"
            >
              Explore all services
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== ACT 4: HOW IT WORKS ===== */}
      <section
        id="how-it-works"
        aria-label="How It Works"
        className="section-tint section-shell px-4 md:px-6 border-t border-border"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface text-text/70 text-[10px] font-bold uppercase tracking-widest mb-6">
              <Zap className="w-3 h-3" />
              Simple 4-Step Process
            </div>
            <h2 className="display-section text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-text">How We Get You Set Up</h2>
            <p className="text-muted text-lg max-w-xl mx-auto">
              From first conversation to your new team member's first day, the whole process takes about 30 days.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 reveal">
            {STEPS.map((step, idx) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: shouldReduceMotion ? 0 : idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative group"
              >
                {/* Connector line between steps */}
                {idx < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-9 left-full w-full h-px bg-gradient-to-r from-border to-transparent z-0 -translate-y-px" style={{ width: 'calc(100% - 2rem)', left: '2rem' }} />
                )}
                <span className="step-number">{step.number}</span>
                <div className="w-12 h-12 rounded-2xl border border-border bg-surface flex items-center justify-center mb-5 group-hover:border-cyan-400/40 group-hover:bg-cyan-400/5 transition-all duration-300">
                  {step.icon}
                </div>
                <h3 className="text-lg font-bold text-text mb-3 leading-snug">{step.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ACT 5: PROOF ===== */}
      <section
        id="why-us"
        aria-label="Client Results"
        className="section-shell px-4 md:px-6 border-t border-border"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface text-text/70 text-[10px] font-bold uppercase tracking-widest mb-6">
              <CheckCircle2 className="w-3 h-3" />
              Proof, not promises.
            </div>
            <h2 className="display-section text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-text">
              Real work. <span className="text-holo">Real outcomes.</span>
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Real engagements, tech and non-tech alike, stripped down to the essentials.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {CASE_STUDIES.map((study, idx) => (
              <motion.article
                key={study.client}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: shouldReduceMotion ? 0.01 : 0.45, delay: shouldReduceMotion ? 0 : idx * 0.08 }}
                className="reveal card-glow micro-lift-card rounded-[2rem] border border-border bg-white overflow-hidden"
                style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,196,154,0.08)' }}
              >
                <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-violet-400 to-cyan-600/50" />
                <div className="p-6 md:p-7">
                  <span className="metric-pill">{study.sector}</span>
                  <h3 className="text-xl font-bold mb-2 text-text">{study.client}</h3>
                  <p className="text-muted text-xs mb-4 leading-relaxed">{study.challenge}</p>
                  <div className="rounded-xl bg-[#f2fbf8] border border-cyan-400/15 p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-cyan-600 mb-1">Outcome</p>
                    <p className="text-text/85 text-sm leading-relaxed font-medium">{study.outcome}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {TESTIMONIALS.slice(0, 2).map((item) => (
              <blockquote key={item.author + item.role} className="reveal quote-card micro-lift-card">
                <p className="relative z-10 text-lg leading-relaxed text-text/90 mb-8 pt-8">{item.quote}</p>
                <footer className="flex items-center gap-3 border-t border-border/50 pt-5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {item.author[0]}
                  </div>
                  <div>
                    <p className="font-bold text-text text-sm">{item.author}</p>
                    <p className="text-muted text-xs">{item.role}</p>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ACT 7: TALENT HUBS + WORLD MAP ===== */}
      <section
        id="talent-hubs"
        aria-label="Global Talent Hubs"
        className="section-shell px-4 md:px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-text/55 mb-4">Where your team comes from</p>
            <h2 className="display-section text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-text">Great people. Everywhere.</h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              We source from 6 countries selected for their talent quality, English proficiency, and timezone fit with your business. Hover any pin to explore.
            </p>
          </div>

          {/* Interactive world map */}
          <div className="reveal rounded-[3rem] border border-cyan-400/15 bg-[#f4fcf9] p-4 md:p-8 mb-12 overflow-hidden relative" style={{ boxShadow: '0 0 60px rgba(0,196,154,0.08), inset 0 1px 0 rgba(255,255,255,0.8)' }}>
            <WorldMapSVG hubs={TALENT_HUBS} onHubClick={setSelectedHub} />
          </div>

          {/* Hub detail cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TALENT_HUBS.map((hub, idx) => (
              <TalentHubCard key={hub.id} hub={hub} index={idx} onClick={setSelectedHub} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section
        id="faq"
        aria-label="Frequently Asked Questions"
        className="section-tint section-shell px-4 md:px-6 border-t border-border"
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 reveal">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-text/55 mb-4">Common questions</p>
            <h2 className="display-section text-4xl sm:text-5xl font-bold mb-4 text-text">
              Everything you wanted to know.
            </h2>
            <p className="text-muted text-lg max-w-xl mx-auto">
              Plain answers to the questions people ask us most before they get in touch.
            </p>
          </div>
          <div className="reveal">
            <Accordion items={HOME_FAQS} />
          </div>
        </div>
      </section>

      {/* ===== ACT 8: CTA + CONTACT ===== */}
      <section id="contact" aria-label="Contact Us" className="section-dark section-shell px-4 md:px-6">
          <div className="max-w-7xl mx-auto reveal text-center relative z-10">
            <p className="text-xs font-bold tracking-[0.25em] uppercase text-cyan-400 mb-6">Get started</p>
            <h2 className="display-section text-3xl sm:text-5xl md:text-7xl font-bold mb-5 text-white">
              Tell us what you need.
            </h2>
            <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Tech hiring, non-tech hiring, delivery support, market expansion.
            </p>

            <div className="max-w-4xl mx-auto text-left mb-6 rounded-3xl bg-white p-6 md:p-10 shadow-[0_0_60px_rgba(0,196,154,0.15)]">
              <InquiryForm />
            </div>

            <p className="text-white/45 text-sm">
              Prefer to reach out directly?{' '}
              <a href="mailto:kevin.v@trivianedge.com" className="text-white/70 hover:text-cyan-400 underline underline-offset-4 transition-colors">Email us</a>
              {' '}or{' '}
              <a href="tel:+18882028513" className="text-white/70 hover:text-cyan-400 underline underline-offset-4 transition-colors">call +1 888-202-8513</a>.
            </p>
          </div>
      </section>
    </>
  );
};

// SEO logic trend-adaptive, uses rotating keyword emphasis for fresh signals
const LEGAL_PAGES_PUBLISHED = '2025-01-01';
const LEGAL_PAGES_MODIFIED = '2026-05-13';

function getSEOProps(pathname: string) {
  const trendKeywords = getTrendKeywords();

  // Blog post detail: BlogPostDetail renders its own complete <SEOHead> (title,
  // article schema, breadcrumb) so this only needs to fall through to the
  // generic default below — it must NOT also build a competing SEOHead here.
  if (pathname === '/blog') {
    const signal = getSEOTrendSignal('blog');
    return {
      title: signal.titleVariant,
      description: signal.descriptionVariant,
      keywords: `BPO insights, outsourcing blog, offshore development news, ${trendKeywords}`,
      canonical: `${SEO_CONFIG.siteUrl}/blog`,
      structuredData: breadcrumbSchema([
        { name: 'Home', url: SEO_CONFIG.siteUrl },
        { name: 'Intelligence Feed', url: `${SEO_CONFIG.siteUrl}/blog` },
      ]),
    };
  }
  // /contact, /proof, /trust, /venture-studio, /services, /services/* each render
  // their own complete page-level <SEOHead> (title, description, canonical, schema).
  // Building competing metadata for them here would duplicate structured data and
  // let the two titles drift out of sync, so they fall through to the generic
  // default below instead.
  if (pathname === '/privacy') {
    const privacyUrl = `${SEO_CONFIG.siteUrl}/privacy`;
    return {
      title: 'Privacy Protocol TrivianEdge BPO & Outsourcing Company',
      description: 'TrivianEdge Global privacy policy for BPO, outsourcing, and offshore services. PIPEDA and GDPR compliant.',
      canonical: privacyUrl,
      noIndex: false,
      structuredData: [
        buildWebPageSchema({
          name: 'Privacy Policy TrivianEdge Global',
          description: 'TrivianEdge Global privacy policy for BPO, outsourcing, and offshore services. PIPEDA and GDPR compliant.',
          url: privacyUrl,
          datePublished: LEGAL_PAGES_PUBLISHED,
          dateModified: LEGAL_PAGES_MODIFIED,
          breadcrumb: [
            { name: 'Home', url: SEO_CONFIG.siteUrl },
            { name: 'Privacy Policy', url: privacyUrl },
          ],
        }),
      ],
    };
  }
  if (pathname === '/terms') {
    const termsUrl = `${SEO_CONFIG.siteUrl}/terms`;
    return {
      title: 'Terms of Engagement TrivianEdge BPO & Outsourcing Services',
      description: 'TrivianEdge terms of service for BPO, outsourcing, and offshore software development engagements.',
      canonical: termsUrl,
      noIndex: false,
      structuredData: [
        buildWebPageSchema({
          name: 'Terms of Engagement TrivianEdge Global',
          description: 'TrivianEdge terms of service for BPO, outsourcing, and offshore software development engagements.',
          url: termsUrl,
          datePublished: LEGAL_PAGES_PUBLISHED,
          dateModified: LEGAL_PAGES_MODIFIED,
          breadcrumb: [
            { name: 'Home', url: SEO_CONFIG.siteUrl },
            { name: 'Terms of Engagement', url: termsUrl },
          ],
        }),
      ],
    };
  }
  if (pathname === '/') {
    // Home maximum schema richness for BPO/outsourcing dominance
    const signal = getSEOTrendSignal('home');
    return {
      title: signal.titleVariant,
      description: signal.descriptionVariant,
      keywords: `${ALL_KEYWORDS}, ${trendKeywords}`,
      canonical: SEO_CONFIG.siteUrl,
      structuredData: [
        buildOrganizationSchema(),
        buildLocalBusinessSchema(),
        buildWebSiteSchema(),
        buildServiceItemListSchema(),
        buildServiceSchema({
          name: 'BPO & Business Process Outsourcing',
          description: 'Canada-based BPO services including offshore software development, IT outsourcing, talent staffing, and managed remote operations across 6 time zones.',
          keywords: [...KEYWORD_CLUSTERS.bpo, ...KEYWORD_CLUSTERS.outsourcing],
        }),
        buildServiceSchema({
          name: 'Offshore Software Development',
          description: 'Dedicated offshore software development teams sourced from elite global talent hubs Philippines, Sri Lanka, Vietnam, Turkey, and Eastern Europe.',
          keywords: [...KEYWORD_CLUSTERS.offshore, ...KEYWORD_CLUSTERS.softwareDev],
        }),
        buildServiceSchema({
          name: 'Global Talent & IT Outsourcing',
          description: 'AI-powered global talent acquisition and IT outsourcing for startups and enterprises. 30-day deployment, up to 40% cost savings.',
          keywords: [...KEYWORD_CLUSTERS.talent, ...KEYWORD_CLUSTERS.outsourcing],
        }),
        buildSoftwareApplicationSchema(),
        buildBPOFAQSchema(),
        buildBPOHowToSchema(),
        faqSchema(HOME_FAQS),
      ],
    };
  }
  // Every other route (contact, proof, trust, venture-studio, services/*, blog
  // post detail, 404) owns a complete page-level <SEOHead> rendered inside the
  // route component itself, which overrides this fallback once it mounts.
  return {
    description: SEO_CONFIG.defaultDescription,
    canonical: `${SEO_CONFIG.siteUrl}${pathname}`,
  };
}

export default function App() {
  const [selectedHub, setSelectedHub] = useState<TalentHub | null>(null);
  const { signals, recommendations } = useAlgorithmIntelligence();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    // Query only elements that haven't animated yet, this prevents previously
    // animated elements from flashing back to their initial invisible state when
    // the observer is disconnected and re-created on route change.
    const timer = setTimeout(() => {
      document.querySelectorAll('.reveal:not(.active)').forEach(el => observer.observe(el));
    }, 100);

    return () => {
        observer.disconnect();
        clearTimeout(timer);
    };
  }, [location.pathname]);

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for React Router to render the home page before scrolling.
      // 150ms gives the router + IntersectionObserver a comfortable margin.
      setTimeout(() => document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' }), 150);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Memoised, getSEOProps builds multiple large JSON-LD schema objects on every
  // call so it must not run on every render.
  const seoProps = useMemo(() => getSEOProps(location.pathname), [location.pathname]);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <GeoProvider>
        <SEOHead {...seoProps} />
        <AlgorithmMonitor signals={signals} recommendations={recommendations} />
        <div className="bg-background min-h-screen text-text overflow-x-hidden selection:bg-cyan-500/30 transition-colors duration-300">
          <Preloader />
          <Navbar />
          <AnimatePresence>
            {selectedHub && (
              <ErrorBoundary fallback={null}>
                <Suspense fallback={null}>
                  <TalentHubModal hub={selectedHub} onClose={() => setSelectedHub(null)} />
                </Suspense>
              </ErrorBoundary>
            )}
          </AnimatePresence>

          <main id="main-content">
            <ErrorBoundary fallback={null}>
              <Suspense fallback={null}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                  >
                    <Routes location={location}>
                      <Route path="/" element={<HomePage setSelectedHub={setSelectedHub} />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/proof" element={<ProofPage />} />
                      <Route path="/trust" element={<TrustPage />} />
                      <Route path="/blog" element={<BlogView />} />
                      <Route path="/blog/:slug" element={<BlogPostDetail />} />
                      <Route path="/privacy" element={<PrivacyPage />} />
                      <Route path="/terms" element={<TermsPage />} />
                      <Route path="/services" element={<ServicesPage />} />
                      <Route path="/services/bpo" element={<BPOPage />} />
                      <Route path="/services/rpo" element={<RPOPage />} />
                      <Route path="/services/ai-development" element={<AIDevelopmentPage />} />
                      <Route path="/services/it-outsourcing" element={<ITOutsourcingPage />} />
                      <Route path="/venture-studio" element={<VentureStudioPage />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </motion.div>
                </AnimatePresence>
              </Suspense>
            </ErrorBoundary>
          </main>

          <footer className="bg-[#020306] text-white pt-16 md:pt-20 pb-10 px-4 md:px-6">
            <div className="max-w-7xl mx-auto grid md:grid-cols-5 gap-8 mb-14">
              <div className="md:col-span-2">
                <div className="mb-6">
                  <Logo light onClick={() => { navigate('/'); window.scrollTo({top: 0, behavior: 'smooth'}); }} />
                </div>
                <p className="text-white/45 text-sm max-w-xs mb-8 leading-relaxed">Build offshore teams that run at full capacity. Hiring, payroll, compliance, and delivery — handled end to end.</p>
                <div className="flex gap-3">
                  <a href="https://www.linkedin.com/company/trivianedge/" target="_blank" rel="noopener noreferrer" aria-label="TrivianEdge on LinkedIn"
                    className="w-9 h-9 rounded-xl bg-white/6 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200">
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a href="https://x.com/trivianedge" target="_blank" rel="noopener noreferrer" aria-label="TrivianEdge on X (Twitter)"
                    className="w-9 h-9 rounded-xl bg-white/6 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200">
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a href="mailto:kevin.v@trivianedge.com" aria-label="Email TrivianEdge"
                    className="w-9 h-9 rounded-xl bg-white/6 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200">
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-white/30 mb-6 tracking-widest uppercase text-[10px]">Services</h4>
                <ul className="space-y-3">
                  <li><Link to="/services" className="text-white/55 hover:text-white text-sm transition-colors">All Services</Link></li>
                  <li><Link to="/services/bpo" className="text-white/55 hover:text-white text-sm transition-colors">BPO</Link></li>
                  <li><Link to="/services/rpo" className="text-white/55 hover:text-white text-sm transition-colors">RPO</Link></li>
                  <li><Link to="/services/ai-development" className="text-white/55 hover:text-white text-sm transition-colors">AI Development</Link></li>
                  <li><Link to="/services/it-outsourcing" className="text-white/55 hover:text-white text-sm transition-colors">IT Outsourcing</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white/30 mb-6 tracking-widest uppercase text-[10px]">Platform</h4>
                <ul className="space-y-3">
                  <li><Link to="/proof" className="text-white/55 hover:text-white text-sm transition-colors">Proof</Link></li>
                  <li><Link to="/trust" className="text-white/55 hover:text-white text-sm transition-colors">Trust</Link></li>
                  <li><Link to="/venture-studio" className="text-white/55 hover:text-white text-sm transition-colors">Venture Studio</Link></li>
                  <li><Link to="/blog" className="text-white/55 hover:text-white text-sm transition-colors">Blog</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white/30 mb-6 tracking-widest uppercase text-[10px]">Resources</h4>
                <ul className="space-y-3">
                  <li><Link to="/contact" className="text-white/55 hover:text-white text-sm transition-colors">Contact</Link></li>
                  <li><Link to="/proof" className="text-white/55 hover:text-white text-sm transition-colors">Case Studies</Link></li>
                  <li><Link to="/venture-studio" className="text-white/55 hover:text-white text-sm transition-colors">MVP Qualification</Link></li>
                  <li><Link to="/privacy" className="text-white/55 hover:text-white text-sm transition-colors">Privacy Policy</Link></li>
                  <li><Link to="/trust" className="text-white/55 hover:text-white text-sm transition-colors">Security & Compliance</Link></li>
                </ul>
              </div>
            </div>
            <div className="max-w-7xl mx-auto pt-8 border-t border-white/8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono tracking-widest uppercase text-white/25">
              <p>© {new Date().getFullYear()} TrivianEdge Global — Canada's Offshore Operations Partner</p>
              <div className="flex gap-8">
                <Link to="/privacy" className="hover:text-white/60 transition-colors">Privacy</Link>
                <Link to="/terms" className="hover:text-white/60 transition-colors">Terms</Link>
              </div>
            </div>
          </footer>
          <ScrollToTop />
          <ErrorBoundary fallback={null}>
            <Suspense fallback={null}>
              <ChatSidebar />
            </Suspense>
          </ErrorBoundary>
        </div>
        </GeoProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
