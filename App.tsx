import React, { useEffect, useState, useMemo, lazy, Suspense } from 'react';
import { AnimatePresence, motion, useReducedMotion, useInView } from 'framer-motion';
import { 
  ArrowRight,
  ChevronRight,
  Globe2,
  Zap,
  Mail,
  Linkedin,
  Twitter,
  Layers,
  X,
  CheckCircle2,
  TrendingUp,
  Server,
  Users2,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import { Routes, Route, useLocation, useNavigate, Link, Navigate } from 'react-router-dom';
import { WHY_US, BLOG_POSTS, TALENT_HUBS, SERVICES, ROLES, STEPS } from './constants';
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
  buildBreadcrumbSchema,
  buildWebPageSchema,
  buildServiceItemListSchema,
  buildBPOHowToSchema,
  buildFAQSchema,
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
import CountUpStat from './components/CountUpStat';

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


// Marquee trust ticker items
const TICKER_ITEMS = [
  { value: '6', label: 'talent-rich countries' },
  { value: '40%', label: 'average cost savings' },
  { label: 'Cargo Login', value: '↗' },
  { value: '30', label: 'day deployment model' },
  { label: 'Keynotive', value: '↗' },
  { value: '24/7', label: 'operations coverage' },
  { label: 'CyouMedia', value: '↗' },
  { label: 'Philippines', value: '🇵🇭' },
  { label: 'Vietnam', value: '🇻🇳' },
  { label: 'Sri Lanka', value: '🇱🇰' },
  { label: 'Hub-Flx', value: '↗' },
  { label: 'Turkey', value: '🇹🇷' },
  { label: 'South Africa', value: '🇿🇦' },
  { label: 'Costa Rica', value: '🇨🇷' },
];

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
  },
  {
    title: 'We Handle the Paperwork',
    description: 'Contracts, payroll, taxes, and local employment laws in every country, all taken care of. You never deal with foreign government offices or compliance filings.',
    icon: ShieldCheck,
    accent: 'text-violet-500',
    iconBg: 'from-violet-400/20 to-violet-400/5',
    iconBorder: 'border-violet-400/25',
    glow: 'bg-violet-400/8',
    metric: '6 countries covered',
  },
  {
    title: 'We Keep the Work Moving',
    description: 'With teams across multiple time zones, your work never sits idle overnight. Handoffs are managed, progress is tracked, and issues get flagged before they become problems.',
    icon: TrendingUp,
    accent: 'text-emerald-500',
    iconBg: 'from-emerald-400/20 to-emerald-400/5',
    iconBorder: 'border-emerald-400/25',
    glow: 'bg-emerald-400/8',
    metric: '24/7 coverage',
  },
  {
    title: 'Tech and Non-Tech, Both',
    description: 'We hire developers, but also customer support, finance, HR, operations, and sales. One partner covers your full team, not just the technical side.',
    icon: Layers,
    accent: 'text-amber-500',
    iconBg: 'from-amber-400/20 to-amber-400/5',
    iconBorder: 'border-amber-400/25',
    glow: 'bg-amber-400/8',
    metric: '40% avg. savings',
  },
];

const NON_TECH_CASE_STUDIES = [
  {
    company: 'Cargo Login',
    function: 'Logistics Operations + Documentation',
    challenge: 'Overnight documentation work stalled when the core US team went offline.',
    approach: 'We designed a follow-the-sun operations desk using Philippines and Canada resources with structured handoffs.',
    result: 'Backlog dropped, turnaround improved, and revenue continuity increased across shifts.',
  },
  {
    company: 'Keynotive',
    function: 'Business Development + Revenue Operations',
    challenge: 'Needed parallel outbound execution across time zones without heavy overhead.',
    approach: 'We launched coordinated non-tech teams for cold outreach, pipeline support, and partner onboarding.',
    result: 'Higher meeting volume, faster response cycles, and measurable new revenue.',
  },
  {
    company: 'Hub-Flx',
    function: 'Market Expansion + Strategic Partnerships',
    challenge: 'Expansion into UAE and GCC required local execution support and operator-level coordination.',
    approach: 'We ran market-entry operations, stakeholder alignment, and execution support for rollout.',
    result: 'Regional partnership framework activated with a clear path to scale.',
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

        {/* Mobile-only 2×2 stat grid — shown below buttons on small screens */}
        <motion.div
          className="lg:hidden w-full px-0 pb-6 relative z-10"
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

        {/* Bottom stats strip — desktop */}
        <motion.div
          className="hidden lg:block w-full px-0 pb-10 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="max-w-7xl mx-auto border-t border-white/15 pt-8 grid grid-cols-4 gap-16">
            <CountUpStat end={6}  suffix="" label="Countries We Source From" textClass="text-white" labelClass="text-white/55" />
            <CountUpStat end={40} suffix="%" label="Average Cost Savings" textClass="text-white" labelClass="text-white/55" />
            <CountUpStat end={30} suffix=" days" label="Average Time to Start" textClass="text-white" labelClass="text-white/55" />
            <div className="flex flex-col gap-1">
              <span className="text-3xl md:text-4xl font-bold text-white tabular-nums">24/7</span>
              <span className="text-xs tracking-widest text-white/55 uppercase font-semibold leading-tight mt-1">Operations Coverage</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ===== ACT 2: TRUST MARQUEE ===== */}
      <section aria-label="Trust signals" className="py-6 md:py-10 border-y border-border overflow-hidden bg-[#fafafa]">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.25em] text-text/35 mb-5">Trusted by operators and scale-ups across North America</p>
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#fafafa] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#fafafa] to-transparent z-10" />
          <div
            className="flex w-[300%] items-center gap-5 md:gap-8"
            style={{ animation: 'marquee-scroll 28s linear infinite' }}
          >
            {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
              <div
                key={`${item.label}-${idx}`}
                className="inline-flex items-center gap-3 md:gap-4 px-5 md:px-6 py-3 rounded-2xl border border-border bg-white whitespace-nowrap shadow-sm"
              >
                <span className="text-base md:text-lg font-black text-text tabular-nums">{item.value}</span>
                <span className="text-[10px] md:text-xs uppercase tracking-widest text-muted font-bold">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ===== ACT 2B: PREMIUM OPERATING LAYER ===== */}
      <section aria-label="Premium operating layer" className="section-tint section-shell px-4 md:px-6">
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
              Most companies spend months setting up payroll, compliance, and contracts before they can hire a single person overseas. We take all of that off your plate and hand you a ready-to-work team member in 30 days.
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
                  className="bg-white rounded-[1.75rem] p-7 md:p-9 border border-border relative overflow-hidden group"
                  style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}
                >
                  <div className={`absolute -top-8 -right-8 w-32 h-32 ${feature.glow} blur-3xl pointer-events-none rounded-full`} />
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.iconBg} border ${feature.iconBorder} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-6 h-6 ${feature.accent}`} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h3 className="text-xl font-bold text-text">{feature.title}</h3>
                        <span className={`hidden md:inline text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border ${feature.iconBorder} ${feature.accent} opacity-70 whitespace-nowrap`}>{feature.metric}</span>
                      </div>
                      <p className="text-text/60 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>


      {/* ===== ACT 3: GLOBAL BUSINESS OS ANALOGY ===== */}
      <section
        id="problem"
        aria-label="The Global Business OS"
        className="section-shell px-4 md:px-6"
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          {/* Left: problem statement */}
          <div className="lg:w-1/2 reveal">
            <p className="text-cyan-500 font-bold tracking-widest text-xs uppercase mb-4">The problem we solve</p>
            <h2 className="display-section text-4xl md:text-5xl font-bold mb-8 leading-tight text-text">
              Hiring globally is hard.<br />
              <span className="text-holo">We make it simple.</span>
            </h2>

            <p className="text-muted text-base md:text-lg leading-relaxed mb-10 max-w-xl">
              Want to hire someone in the Philippines, Vietnam, or Eastern Europe? Normally you'd need to register a local company, open a payroll account, navigate foreign employment law, and wait months. We handle every single one of those steps for you.
            </p>

            <div className="space-y-4">
              {[
                'Setting up legal entities in foreign countries takes 3–6 months',
                'Local payroll, taxes, and contracts differ in every jurisdiction',
                'Finding and vetting quality talent takes time most teams don\'t have',
              ].map(item => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20 flex-shrink-0 mt-0.5">
                    <X className="w-3 h-3 text-rose-500" />
                  </div>
                  <span className="text-muted font-medium text-sm leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: clean country + outcome cards — no photos */}
          <div className="lg:w-1/2 reveal">
            <div className="grid grid-cols-2 gap-4 mb-4">
              {[
                { code: 'ph', country: 'Philippines', note: 'Top English-speaking tech + ops talent' },
                { code: 'vn', country: 'Vietnam', note: 'Strong engineering and software teams' },
                { code: 'lk', country: 'Sri Lanka', note: 'Finance, accounting, and back-office' },
                { code: 'tr', country: 'Turkey', note: 'Design, development, and IT support' },
                { code: 'za', country: 'South Africa', note: 'Customer success and business ops' },
                { code: 'cr', country: 'Costa Rica', note: 'Tech teams, US timezone alignment' },
              ].map(item => (
                <div key={item.country} className="glass rounded-2xl border border-border p-4 flex items-start gap-3">
                  <img
                    src={`https://flagcdn.com/w40/${item.code}.png`}
                    width={24}
                    height={18}
                    alt={item.country}
                    className="mt-0.5 rounded-sm flex-shrink-0 object-cover"
                    loading="lazy"
                  />
                  <div>
                    <p className="font-bold text-text text-sm">{item.country}</p>
                    <p className="text-muted text-xs leading-relaxed mt-0.5">{item.note}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="glass rounded-2xl border border-border/60 p-5 text-center">
              <p className="text-text font-bold text-base">Your team. Up and running in 30 days.</p>
              <p className="text-muted text-xs mt-1">Fully compliant, payroll sorted, contracts signed.</p>
            </div>
          </div>
        </div>
      </section>


      {/* ===== BPO VS RPO + TECH EDUCATION ===== */}
      <section
        id="bpo-vs-rpo"
        aria-label="Why BPO Breaks"
        className="section-tint section-shell px-4 md:px-6 border-t border-border"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface text-text/70 text-[10px] font-bold uppercase tracking-widest mb-6">
              <X className="w-3 h-3" />
              Why traditional BPO breaks
            </div>
            <h2 className="display-section text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-text">
              Most outsourcing firms just pass<br />
              <span className="text-holo">the work to someone cheaper.</span>
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              We do something different. We build the team around your business, handle all the admin, and stay responsible for the outcome, not just the hours billed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 reveal">
            {/* Left: Traditional BPO — cold/negative treatment */}
            <div className="micro-lift-card p-8 md:p-10 rounded-[2.5rem] border border-rose-200/60 bg-rose-50/40 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-rose-300/15 blur-3xl pointer-events-none" />
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center">
                  <X className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-rose-400/70 mb-0.5">The old way</p>
                  <h3 className="text-xl font-bold text-gray-500">Traditional BPO</h3>
                </div>
              </div>
              <p className="text-rose-400/70 text-xs font-semibold uppercase tracking-widest mb-6 pl-[52px]">What you're probably used to</p>
              <ul className="space-y-3">
                {[
                  'They bill for hours, not results — you take on all the risk',
                  'They send whoever is available, not who is right',
                  'Once work is delivered, they disappear with no accountability',
                  'No visibility into who is working or what is happening',
                  'Slow to adapt when your needs change mid-project',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <X className="w-3 h-3 text-rose-400" />
                    </div>
                    <span className="text-gray-400 text-sm leading-relaxed line-through decoration-rose-200">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: TrivianEdge — warm/positive treatment */}
            <div className="micro-lift-card p-8 md:p-10 rounded-[2.5rem] border border-cyan-400/25 bg-[#f2fbf8] relative overflow-hidden" style={{ boxShadow: '0 4px 32px rgba(0,196,154,0.1)' }}>
              <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-cyan-400/12 blur-3xl pointer-events-none" />
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-cyan-400/15 border border-cyan-400/25 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-cyan-500" />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-cyan-500/70 mb-0.5">The TrivianEdge way</p>
                  <h3 className="text-xl font-bold text-text">TrivianEdge RPO + Tech</h3>
                </div>
              </div>
              <p className="text-cyan-600 text-xs font-semibold uppercase tracking-widest mb-6 pl-[52px]">Outcome-driven, always</p>
              <ul className="space-y-3">
                {[
                  'We own the outcome, not just the task list',
                  'We hand-pick people for your specific role and culture',
                  'Full visibility into hiring, onboarding, and every milestone',
                  'Payroll, contracts, and compliance included from day one',
                  'We adjust quickly when your priorities shift',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-cyan-400/15 border border-cyan-400/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-cyan-500" />
                    </div>
                    <span className="text-text/80 text-sm leading-relaxed font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom statement */}
          <div className="mt-8 reveal">
            <div className="glass p-8 rounded-[2rem] border-border text-center">
              <p className="text-xl md:text-2xl font-bold text-text">
                Outsourcing the task is easy. Building the system takes experience.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* ===== DUAL-ENGINE SERVICE DEFINITION ===== */}
      <section
        id="dual-engine"
        aria-label="Our Dual Engine"
        className="section-shell px-4 md:px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface text-text/70 text-[10px] font-bold uppercase tracking-widest mb-6">
              <Layers className="w-3 h-3" />
              How We're Built
            </div>
            <h2 className="display-section text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-text">
              Need people?<br />Need software built?<br />
              <span className="text-holo">We do both.</span>
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Most companies use three or four different vendors for hiring, payroll, and software. We bring it all under one roof so nothing falls through the cracks.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 reveal">
            {/* Engine 1: Talent */}
            <div className="micro-lift-card p-10 rounded-[2.5rem] border border-border bg-white transition-all duration-500 group relative overflow-hidden" style={{ boxShadow: '0 4px 32px rgba(0,196,154,0.08), 0 1px 3px rgba(0,0,0,0.06)' }}>
              <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-cyan-400/8 blur-3xl pointer-events-none" />
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400/15 to-cyan-400/5 border border-cyan-400/20 flex items-center justify-center">
                  <Users2 className="w-7 h-7 text-cyan-500" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-text/70">Engine 1</p>
                  <h3 className="text-xl font-bold text-text">Talent Infrastructure</h3>
                </div>
              </div>
              <p className="text-muted text-sm leading-relaxed mb-6">
                Think of us as your hiring department, HR team, and payroll office all in one. You tell us what you need and we find the right person, get them set up legally, and put them to work.
              </p>
              <ul className="space-y-3">
                {[
                  'Tech roles (developers, engineers, QA, DevOps)',
                  'Non-tech roles (operations, finance, support, sales)',
                  'Contracts, payroll, and compliance in every country',
                  'Ongoing management so you stay focused on your business',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted">
                    <CheckCircle2 className="w-4 h-4 text-text/70 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Engine 2: Software */}
            <div className="micro-lift-card p-10 rounded-[2.5rem] border border-border bg-white transition-all duration-500 group relative overflow-hidden" style={{ boxShadow: '0 4px 32px rgba(99,102,241,0.08), 0 1px 3px rgba(0,0,0,0.06)' }}>
              <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-violet-400/8 blur-3xl pointer-events-none" />
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-400/15 to-violet-400/5 border border-violet-400/20 flex items-center justify-center">
                  <Cpu className="w-7 h-7 text-violet-500" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-text/70">Engine 2</p>
                  <h3 className="text-xl font-bold text-text">Software Development</h3>
                </div>
              </div>
              <p className="text-muted text-sm leading-relaxed mb-6">
                Need an app, a platform, or a custom tool built? We have a dedicated engineering team that builds software the right way: clear milestones, clean code, and everything owned by you.
              </p>
              <ul className="space-y-3">
                {[
                  'Custom software, web apps, and internal tools',
                  'AI and automation built into your existing workflows',
                  'You own 100% of the code and IP, always',
                  'No surprise costs: scoped, planned, and delivered',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted">
                    <CheckCircle2 className="w-4 h-4 text-text/70 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bridge line */}
          <div className="mt-8 reveal">
            <div className="glass p-8 rounded-[2rem] border-border text-center">
              <p className="text-xl md:text-2xl font-bold text-text">
                One partner. One system. Less noise. Faster growth.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* ===== HEADACHE VALUE PROPOSITION ===== */}
      <section
        id="headache-removed"
        aria-label="We Remove the Bureaucracy"
        className="section-tint section-shell px-4 md:px-6 border-t border-border"
      >
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface text-text/70 text-[10px] font-bold uppercase tracking-widest mb-8">
              <ShieldCheck className="w-3 h-3" />
              The Headache We Take Away
            </div>
            <h2 className="display-section text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-text">
              Here's what you<br />
              <span className="text-holo">never have to deal with.</span>
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto mb-16 leading-relaxed">
              Every item below is something businesses normally spend weeks handling themselves. We take it all off your desk, permanently.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 reveal">
            {[
              { icon: <Globe2 className="w-6 h-6 text-cyan-500" />,   iconBg: 'from-cyan-400/20 to-cyan-400/5',   border: 'border-cyan-400/20',   glow: 'bg-cyan-400/10',   title: 'Foreign Employment Law',      desc: 'Every country has its own rules about contracts, termination, and benefits. We know them all and apply them correctly so you never get a surprise fine or lawsuit.' },
              { icon: <Server className="w-6 h-6 text-violet-500" />,  iconBg: 'from-violet-400/20 to-violet-400/5', border: 'border-violet-400/20', glow: 'bg-violet-400/10', title: 'Payroll in Multiple Countries', desc: 'Running payroll in Canada is complicated enough. In six countries at once it\'s a full-time job. We handle it with zero errors, every month.' },
              { icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />, iconBg: 'from-emerald-400/20 to-emerald-400/5', border: 'border-emerald-400/20', glow: 'bg-emerald-400/10', title: 'Compliance and Data Rules', desc: 'Data protection, privacy laws, and export rules differ in every market. We keep your business clean and compliant without 200-page legal guides.' },
              { icon: <TrendingUp className="w-6 h-6 text-amber-500" />, iconBg: 'from-amber-400/20 to-amber-400/5', border: 'border-amber-400/20', glow: 'bg-amber-400/10', title: 'Day-to-Day Ops Management', desc: 'Progress updates, handoffs, issue tracking, and performance oversight — all managed by us so your leadership stays focused on the actual business.' },
            ].map(item => (
              <div
                key={item.title}
                className={`micro-lift-card bg-white p-8 rounded-[2rem] border ${item.border} transition-all duration-300 relative overflow-hidden group`}
                style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}
              >
                <div className={`absolute -top-8 -right-8 w-28 h-28 ${item.glow} blur-3xl pointer-events-none rounded-full`} />
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.iconBg} border ${item.border} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
                <h4 className="font-bold text-text mb-2">{item.title}</h4>
                <p className="text-text/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center reveal">
            <p className="text-xl md:text-2xl font-bold text-text">
              Less admin noise. More execution clarity.
            </p>
          </div>
        </div>
      </section>

      {/* ===== ACT 4: HOW IT WORKS ===== */}
      <section
        id="how-it-works"
        aria-label="How It Works"
        className="section-shell px-4 md:px-6 border-t border-border"
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
        className="section-tint section-shell px-4 md:px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface text-text/70 text-[10px] font-bold uppercase tracking-widest mb-6">
              <CheckCircle2 className="w-3 h-3" />
              Proof, not promises.
            </div>
            <h2 className="display-section text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-text">
              Real work. Real outcomes.
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto mb-4">
              Case studies and client feedback, stripped down to the essentials.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {CASE_STUDIES.slice(0, 2).map((study) => (
              <article key={study.client} className="reveal micro-lift-card rounded-[2rem] border border-border bg-white overflow-hidden" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,196,154,0.08)' }}>
                <div className="h-1 w-full bg-gradient-to-r from-cyan-400 to-cyan-600/50" />
                <div className="p-8 md:p-10">
                  <span className="metric-pill">{study.sector}</span>
                  <h3 className="text-2xl md:text-3xl font-bold mb-1 text-text">{study.client}</h3>
                  <p className="text-muted text-sm mb-6 leading-relaxed">{study.challenge}</p>
                  <div className="rounded-2xl bg-[#f2fbf8] border border-cyan-400/15 p-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-cyan-600 mb-2">Outcome</p>
                    <p className="text-text/85 text-sm md:text-base leading-relaxed font-medium">{study.outcome}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {TESTIMONIALS.slice(0, 2).map((item) => (
              <blockquote key={item.author + item.role} className="reveal quote-card micro-lift-card">
                <p className="relative z-10 text-lg leading-relaxed text-text/90 mb-8 pt-8">{item.quote}</p>
                <footer className="flex items-center gap-3 border-t border-border/50 pt-5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
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

      {/* ===== ACT 5B: NON-TECH CASE STUDIES ===== */}
      <section
        id="non-tech-proof"
        aria-label="Non-technical success stories"
        className="section-shell px-4 md:px-6 border-t border-border"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface text-text/70 text-[10px] font-bold uppercase tracking-widest mb-6">
              <Users2 className="w-3 h-3" />
              Non-Tech Success Stories
            </div>
            <h2 className="display-section text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-text">
              We do not only place developers.
              <br />
              <span className="text-holo">We scale operations teams too.</span>
            </h2>
            <p className="text-muted text-lg max-w-3xl mx-auto">
              Non-technical roles become a growth lever when the system is structured correctly.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {NON_TECH_CASE_STUDIES.map((study, idx) => (
              <motion.article
                key={study.company}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: shouldReduceMotion ? 0.01 : 0.45, delay: shouldReduceMotion ? 0 : idx * 0.08 }}
                className="reveal micro-lift-card rounded-[2rem] border border-border bg-white overflow-hidden"
                style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,196,154,0.08)' }}
              >
                <div className="h-1 w-full bg-gradient-to-r from-cyan-400 to-cyan-600/50" />
                <div className="p-8">
                  <span className="metric-pill">{study.function}</span>
                  <h3 className="text-2xl font-bold text-text mb-3">{study.company}</h3>
                  <p className="text-sm text-muted leading-relaxed mb-4">{study.challenge}</p>
                  <div className="rounded-xl bg-[#f2fbf8] border border-cyan-400/15 p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-cyan-600 mb-1">Result</p>
                    <p className="text-text/85 text-sm leading-relaxed font-medium">{study.result}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ACT 6: SERVICES BENTO GRID ===== */}
      <section
        id="solutions"
        aria-label="Our Services"
        className="section-tint section-shell px-4 md:px-6 border-t border-border"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-text/55 mb-4">What we do</p>
            <h2 className="display-section text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-text">
              BPO, RPO, AI development,<br />and IT outsourcing, under one roof.
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Offshore teams, managed operations, and delivery support in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 reveal">
            {SERVICES.slice(0, 3).map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: shouldReduceMotion ? 0 : idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="service-dark micro-lift-card rounded-[2rem] border p-8 md:p-10 flex flex-col gap-5 group relative overflow-hidden"
              >
                {/* Glow orb per card */}
                <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-20 blur-3xl pointer-events-none"
                  style={{ background: idx === 0 ? 'radial-gradient(#00C49A, transparent)' : idx === 1 ? 'radial-gradient(#6366f1, transparent)' : 'radial-gradient(#c026d3, transparent)' }}
                />
                <div className="w-14 h-14 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {service.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/10 text-white/50">{tag}</span>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 leading-snug">{service.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{service.description.split('.')[0]}.</p>
                </div>
                <ul className="mt-auto space-y-2 pt-4 border-t border-white/8">
                  {service.outcomes.map(o => (
                    <li key={o} className="flex items-start gap-2 text-xs text-white/55">
                      <span className="text-cyan-400 mt-0.5 flex-shrink-0">✓</span>
                      {o}
                    </li>
                  ))}
                </ul>
              </motion.div>
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

            <div className="max-w-4xl mx-auto text-left mb-10 rounded-3xl bg-white p-6 md:p-10 shadow-[0_0_60px_rgba(0,196,154,0.15)]">
              <InquiryForm />
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="mailto:kevin.v@trivianedge.com" className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border border-white/10 text-white font-bold text-base hover:border-cyan-400/40 hover:bg-white/5 transition-all">
                <Mail className="w-5 h-5" />
                Email
              </a>
              <a href="tel:+18882028513" className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border border-white/10 text-white font-bold text-base hover:border-cyan-400/40 hover:bg-white/5 transition-all">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                Call
              </a>
            </div>
          </div>
      </section>
    </>
  );
};

// SEO logic trend-adaptive, uses rotating keyword emphasis for fresh signals
const LEGAL_PAGES_DATE = '2025-01-01';

function getSEOProps(pathname: string) {
  const trendKeywords = getTrendKeywords();

  // Blog post detail
  if (pathname.startsWith('/blog/')) {
    const slug = pathname.replace('/blog/', '').replace(/\/$/, '');
    const post = BLOG_POSTS.find(p => p.slug === slug || p.id === slug);
    const signal = getSEOTrendSignal('blog-post');
    if (post) {
      const postUrl = `${SEO_CONFIG.siteUrl}/blog/${post.slug ?? post.id}`;
      return {
        title: post.title,
        description: post.metaDescription ?? post.excerpt,
        keywords: [post.metaKeywords?.join(', '), trendKeywords].filter(Boolean).join(', '),
        canonical: postUrl,
        ogType: 'article' as const,
        structuredData: [
          buildArticleSchema({
            title: post.title,
            description: post.metaDescription ?? post.excerpt,
            author: post.author,
            date: post.datePublished ?? post.date,
            dateModified: post.dateModified ?? post.datePublished ?? post.date,
            url: postUrl,
            imageUrl: post.imageUrl,
          }),
          buildBreadcrumbSchema([
            { name: 'Home', url: SEO_CONFIG.siteUrl },
            { name: 'Blog', url: `${SEO_CONFIG.siteUrl}/blog` },
            { name: post.title, url: postUrl },
          ]),
        ],
      };
    }
  }
  if (pathname === '/blog') {
    const signal = getSEOTrendSignal('blog');
    return {
      title: signal.titleVariant,
      description: signal.descriptionVariant,
      keywords: `BPO insights, outsourcing blog, offshore development news, ${trendKeywords}`,
      canonical: `${SEO_CONFIG.siteUrl}/blog`,
      structuredData: buildBreadcrumbSchema([
        { name: 'Home', url: SEO_CONFIG.siteUrl },
        { name: 'Intelligence Feed', url: `${SEO_CONFIG.siteUrl}/blog` },
      ]),
    };
  }
  if (pathname === '/contact') {
    const url = `${SEO_CONFIG.siteUrl}/contact`;
    return {
      title: 'Contact TrivianEdge: Start Your Global Hiring Conversation',
      description: 'Reach out to TrivianEdge to discuss offshore talent, BPO, RPO, or AI software delivery. 30-day deployment. Up to 40% cost savings.',
      keywords: `contact TrivianEdge, hire offshore team, BPO inquiry, RPO consultation, ${trendKeywords}`,
      canonical: url,
      structuredData: buildBreadcrumbSchema([
        { name: 'Home', url: SEO_CONFIG.siteUrl },
        { name: 'Contact', url },
      ]),
    };
  }
  if (pathname === '/proof') {
    const url = `${SEO_CONFIG.siteUrl}/proof`;
    return {
      title: 'Client Proof: TrivianEdge Case Studies & Results',
      description: 'Real results from TrivianEdge clients. Case studies covering offshore software delivery, cross-timezone operations, and talent deployment.',
      keywords: `TrivianEdge case studies, offshore outsourcing results, BPO proof, client success, ${trendKeywords}`,
      canonical: url,
      structuredData: buildBreadcrumbSchema([
        { name: 'Home', url: SEO_CONFIG.siteUrl },
        { name: 'Proof', url },
      ]),
    };
  }
  if (pathname === '/trust') {
    const url = `${SEO_CONFIG.siteUrl}/trust`;
    return {
      title: 'Security & Compliance: TrivianEdge Trust Centre',
      description: 'TrivianEdge security and compliance overview. PIPEDA, GDPR, data protection, and operational transparency for global outsourcing.',
      keywords: `TrivianEdge trust, outsourcing security, BPO compliance, GDPR outsourcing, ${trendKeywords}`,
      canonical: url,
      structuredData: buildBreadcrumbSchema([
        { name: 'Home', url: SEO_CONFIG.siteUrl },
        { name: 'Trust Centre', url },
      ]),
    };
  }
  if (pathname === '/venture-studio') {
    const url = `${SEO_CONFIG.siteUrl}/venture-studio`;
    return {
      title: 'Venture Studio: Build Your MVP with TrivianEdge',
      description: 'Submit your idea to TrivianEdge Venture Studio. Qualified founders get a free MVP build with a dedicated offshore engineering team.',
      keywords: `venture studio, free MVP build, offshore development, startup MVP, TrivianEdge, ${trendKeywords}`,
      canonical: url,
      structuredData: buildBreadcrumbSchema([
        { name: 'Home', url: SEO_CONFIG.siteUrl },
        { name: 'Venture Studio', url },
      ]),
    };
  }
  if (pathname === '/services/bpo') {
    const url = `${SEO_CONFIG.siteUrl}/services/bpo`;
    return {
      title: 'BPO Services: TrivianEdge Business Process Outsourcing',
      description: 'Managed BPO services from TrivianEdge. Offshore operations, back-office support, and process delivery across 6 global time zones.',
      keywords: `BPO services, business process outsourcing, offshore BPO, managed operations, ${trendKeywords}`,
      canonical: url,
      structuredData: buildBreadcrumbSchema([
        { name: 'Home', url: SEO_CONFIG.siteUrl },
        { name: 'Services', url: `${SEO_CONFIG.siteUrl}/services/bpo` },
        { name: 'BPO', url },
      ]),
    };
  }
  if (pathname === '/services/rpo') {
    const url = `${SEO_CONFIG.siteUrl}/services/rpo`;
    return {
      title: 'RPO Services: TrivianEdge Recruitment Process Outsourcing',
      description: 'End-to-end RPO from TrivianEdge. Global talent acquisition, candidate sourcing, and managed hiring pipelines. 30-day deployment.',
      keywords: `RPO services, recruitment process outsourcing, global hiring, talent acquisition, ${trendKeywords}`,
      canonical: url,
      structuredData: buildBreadcrumbSchema([
        { name: 'Home', url: SEO_CONFIG.siteUrl },
        { name: 'Services', url: `${SEO_CONFIG.siteUrl}/services/rpo` },
        { name: 'RPO', url },
      ]),
    };
  }
  if (pathname === '/services/ai-development') {
    const url = `${SEO_CONFIG.siteUrl}/services/ai-development`;
    return {
      title: 'AI Development Services: TrivianEdge Offshore AI Engineering',
      description: 'Offshore AI and ML development from TrivianEdge. Dedicated AI engineering teams for automation, LLM integration, and custom AI products.',
      keywords: `AI development, offshore AI engineers, machine learning outsourcing, LLM development, ${trendKeywords}`,
      canonical: url,
      structuredData: buildBreadcrumbSchema([
        { name: 'Home', url: SEO_CONFIG.siteUrl },
        { name: 'Services', url: `${SEO_CONFIG.siteUrl}/services/ai-development` },
        { name: 'AI Development', url },
      ]),
    };
  }
  if (pathname === '/services/it-outsourcing') {
    const url = `${SEO_CONFIG.siteUrl}/services/it-outsourcing`;
    return {
      title: 'IT Outsourcing Services: TrivianEdge Global Tech Delivery',
      description: 'Dedicated IT outsourcing from TrivianEdge. Offshore software engineers, QA, DevOps, and full-stack teams across 6 time zones.',
      keywords: `IT outsourcing, offshore software development, dedicated dev teams, tech outsourcing, ${trendKeywords}`,
      canonical: url,
      structuredData: buildBreadcrumbSchema([
        { name: 'Home', url: SEO_CONFIG.siteUrl },
        { name: 'Services', url: `${SEO_CONFIG.siteUrl}/services/it-outsourcing` },
        { name: 'IT Outsourcing', url },
      ]),
    };
  }
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
          datePublished: LEGAL_PAGES_DATE,
          dateModified: LEGAL_PAGES_DATE,
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
          datePublished: LEGAL_PAGES_DATE,
          dateModified: LEGAL_PAGES_DATE,
          breadcrumb: [
            { name: 'Home', url: SEO_CONFIG.siteUrl },
            { name: 'Terms of Engagement', url: termsUrl },
          ],
        }),
      ],
    };
  }
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
      buildFAQSchema(HOME_FAQS),
    ],
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
                <Routes>
                  <Route path="/" element={<HomePage setSelectedHub={setSelectedHub} />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/proof" element={<ProofPage />} />
                  <Route path="/trust" element={<TrustPage />} />
                  <Route path="/blog" element={<BlogView />} />
                  <Route path="/blog/:slug" element={<BlogPostDetail />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/services/bpo" element={<BPOPage />} />
                  <Route path="/services/rpo" element={<RPOPage />} />
                  <Route path="/services/ai-development" element={<AIDevelopmentPage />} />
                  <Route path="/services/it-outsourcing" element={<ITOutsourcingPage />} />
                  <Route path="/venture-studio" element={<VentureStudioPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </main>

          <footer className="bg-[#020306] text-white pt-16 md:pt-20 pb-10 px-4 md:px-6">
            <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10 mb-14">
              <div className="md:col-span-2">
                <div className="mb-6">
                  <Logo onClick={() => { navigate('/'); window.scrollTo({top: 0, behavior: 'smooth'}); }} />
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
                <h4 className="font-bold text-white/30 mb-6 tracking-widest uppercase text-[10px]">Platform</h4>
                <ul className="space-y-3">
                  <li><a href="/#solutions" onClick={(e) => { e.preventDefault(); scrollToSection('solutions'); }} className="text-white/55 hover:text-white text-sm transition-colors">Our Services</a></li>
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
        </div>
        </GeoProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
