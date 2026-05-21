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
  ExternalLink,
  Layers,
  X,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Server,
  Users2,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import { Routes, Route, useLocation, useNavigate, Link, Navigate } from 'react-router-dom';
import { WHY_US, BLOG_POSTS, TALENT_HUBS, SERVICES, ROLES } from './constants';
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
  SEO_CONFIG,
  ALL_KEYWORDS,
  KEYWORD_CLUSTERS,
} from './utils/seo';
import { getSEOTrendSignal, getTrendKeywords } from './utils/seoTrends';

// Extracted components
import Logo from './components/Logo';
import Navbar from './components/Navbar';
import GreetingBanner from './components/GreetingBanner';
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

const SectionBridge: React.FC<{ label: string }> = ({ label }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: shouldReduceMotion ? 0.01 : 0.45 }}
      className="px-4 md:px-6"
      aria-hidden="true"
    >
      <div className="max-w-7xl mx-auto py-2 md:py-4">
        <div className="choreo-bridge">
          <span className="choreo-label">{label}</span>
          <div className="choreo-line-track">
            <motion.div
              initial={{ scaleX: 0, opacity: 0.65 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: shouldReduceMotion ? 0.01 : 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="choreo-line-fill"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Rotating hero phrases
const HERO_PHRASES = [
  "From red tape\nto release.",
  "You build the vision.\nWe run the system.",
  "Global expansion.\nMinus the drag.",
];

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
    title: 'Hiring Concierge Desk',
    description: 'Like a private hiring desk for your business. We define roles, find people, vet them, and hand you ready-to-work talent.',
    icon: Users2,
    accent: 'text-cyan-400',
    border: 'border-cyan-500/20 hover:border-cyan-500/40',
  },
  {
    title: '24/7 Delivery Control Room',
    description: 'Think air traffic control for your operations. We manage handoffs so work keeps moving when one team logs off.',
    icon: TrendingUp,
    accent: 'text-violet-400',
    border: 'border-violet-500/20 hover:border-violet-500/40',
  },
  {
    title: 'Payroll and Compliance Shield',
    description: 'We handle contracts, payroll, and local rules in each country so you scale without legal headaches.',
    icon: ShieldCheck,
    accent: 'text-emerald-400',
    border: 'border-emerald-500/20 hover:border-emerald-500/40',
  },
  {
    title: 'Tech and Non-Tech Team Builder',
    description: 'We hire developers, and we also hire ops, finance, support, HR, and managers. One partner for your full team.',
    icon: Layers,
    accent: 'text-orange-400',
    border: 'border-orange-500/20 hover:border-orange-500/40',
  },
];

const SERVICE_ANALOGIES = [
  {
    title: 'Like Air Traffic Control For Hiring',
    copy: 'You focus on growth. We direct the right people into the right roles so nothing collides.',
    icon: MapPin,
  },
  {
    title: 'Like A Pit Crew For Your Company',
    copy: 'While you run the race, we handle hiring changes, setup, and process fixes so you stay fast.',
    icon: Zap,
  },
  {
    title: 'Like One Operating System For Your Team',
    copy: 'Instead of juggling five vendors, you get one clean system for hiring, onboarding, payroll, and delivery.',
    icon: ExternalLink,
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

// Home page component 9-act narrative arc
const HomePage: React.FC<{ setSelectedHub: (hub: TalentHub | null) => void }> = ({ setSelectedHub }) => {
  const navigate = useNavigate();
  const [phraseIndex, setPhraseIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  // Rotate hero phrases every 3.5 s
  useEffect(() => {
    const id = setInterval(() => setPhraseIndex(i => (i + 1) % HERO_PHRASES.length), 3500);
    return () => clearInterval(id);
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const [line1, line2] = HERO_PHRASES[phraseIndex].split('\n');

  return (
    <>
      {/* ===== ACT 1: HERO ===== */}
      <section
        aria-label="Hero"
        className="relative min-h-[95vh] flex items-center pt-20 sm:pt-24 px-4 sm:px-6 overflow-hidden"
      >
        {/* Background atmosphere, static radial gradients replace the GPU-expensive
            blur-[120px] filter. Visual result is identical but zero compositing cost. */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(0,196,154,0.10) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)' }} />
        <div className="bg-grid absolute inset-0 opacity-20 pointer-events-none" />
        {/* Subtle human photography overlay */}
        <img
          src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&q=55&auto=format&fit=crop"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.04] mix-blend-luminosity pointer-events-none"
          loading="eager"
          decoding="async"
        />

        <motion.div
          className="max-w-7xl mx-auto w-full relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Personalised greeting, geo-aware and language-aware */}
          <GreetingBanner />

          <div className="max-w-4xl">
            {/* Trusted badge */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-border bg-surface backdrop-blur-md text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-8 text-text"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Canada's RPO + Tech Infrastructure Partner
            </motion.div>

            {/* Kinetic h1 */}
            <h1 className="display-hero text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight mb-6 leading-[1.05] text-text min-h-[3.5em] sm:min-h-[2.3em] md:min-h-[1.8em]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={phraseIndex}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
                  transition={{ duration: shouldReduceMotion ? 0.01 : 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="block"
                >
                  {line1}
                  <br className="hidden md:block" />
                  <span className="text-holo">{line2}</span>
                </motion.span>
              </AnimatePresence>
            </h1>

            {/* Phrase indicator dots */}
            <div className="flex gap-2 mb-8">
              {HERO_PHRASES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPhraseIndex(i)}
                  aria-label={`Go to hero phrase ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === phraseIndex ? 'w-8 bg-cyan-400' : 'w-3 bg-border hover:bg-muted'
                  }`}
                />
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="text-muted text-lg md:text-xl max-w-2xl mb-8 md:mb-12 leading-relaxed"
            >
              Build offshore teams, streamline global operations, and move faster. TrivianEdge is Canada's leading BPO and RPO partner, deploying talent across 6 countries in 30 days. Trusted by scale-ups and enterprises across North America and Europe.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-start gap-4 mb-12 md:mb-20"
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
                className="w-full sm:w-auto px-10 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 btn-magnetic premium-button-secondary micro-press-button"
              >
                How it works
                <ChevronRight className="w-5 h-5" />
              </a>
            </motion.div>

            {/* Animated stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="pt-8 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
            >
              <CountUpStat end={6}  suffix="" label="Countries We Source From" />
              <CountUpStat end={40} suffix="%" label="Average Cost Savings" />
              <CountUpStat end={30} suffix=" days" label="Average Time to Start" />
              {/* 24/7 is a ratio, not a count, display as static */}
              <div className="flex flex-col gap-1">
                <span className="text-2xl md:text-3xl font-bold text-text tabular-nums">24/7</span>
                <span className="text-[10px] tracking-widest text-muted uppercase font-bold leading-tight">
                  Operations Coverage
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ===== ACT 2: TRUST MARQUEE ===== */}
      <section aria-label="Trust signals" className="py-5 md:py-7 border-y border-border/70 bg-[#f8fafc] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-14 md:w-28 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-14 md:w-28 bg-gradient-to-l from-background to-transparent z-10" />
            <div
              className="flex w-[300%] items-center gap-4 md:gap-6"
              style={{ animation: 'marquee-scroll 22s linear infinite' }}
            >
              {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
                <div
                  key={`${item.label}-${idx}`}
                  className="inline-flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 rounded-full border border-border bg-background/70 whitespace-nowrap"
                >
                  <span className="text-sm md:text-base font-bold text-text">{item.value}</span>
                  <span className="text-[10px] md:text-xs uppercase tracking-widest text-muted font-bold">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SectionBridge label="Signal to strategy" />

      {/* ===== ACT 2B: PREMIUM OPERATING LAYER ===== */}
      <section aria-label="Premium operating layer" className="section-shell px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-6 float-badge">
              <ShieldCheck className="w-3 h-3" />
              Premium Growth Layer
            </div>
            <h2 className="display-section text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-text">
              Offshore outsourcing, reinvented<br />
              <span className="text-holo">for modern global operations.</span>
            </h2>
            <p className="text-muted text-lg max-w-3xl mx-auto">
              We bring senior-calibre offshore talent to your team in 30 days: fully compliant, directly managed, and built to scale. No body-shopping, no hidden markups, no time-zone friction.
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
                  className={`glass micro-lift-card luxury-panel rounded-[2rem] p-7 md:p-9 border relative overflow-hidden group ${feature.border}`}
                >
                  <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-b from-white/10 to-transparent blur-3xl pointer-events-none" />
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl border border-border bg-surface flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <Icon className={`w-6 h-6 ${feature.accent}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-text mb-2">{feature.title}</h3>
                      <p className="text-muted text-sm md:text-base leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <SectionBridge label="Strategy to execution" />

      {/* ===== ACT 3: GLOBAL BUSINESS OS ANALOGY ===== */}
      <section
        id="problem"
        aria-label="The Global Business OS"
        className="section-shell px-4 md:px-6"
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          {/* Left: analogy text */}
          <div className="lg:w-1/2 reveal">
            <div className="text-cyan-700 font-bold tracking-widest text-xs uppercase mb-4">
              Primary wedge
            </div>
            <h2 className="display-section text-4xl md:text-5xl font-bold mb-8 leading-tight text-text">
              We help companies grow and hire faster<br />
              <span className="text-holo">without the usual red tape.</span>
            </h2>

            <p className="text-muted text-base md:text-lg leading-relaxed mb-8 max-w-xl">
              In simple terms, we bring global talent to your doorstep. Tech roles, non-tech roles, payroll, compliance, and operations are all handled in one place.
            </p>

            <div className="space-y-4">
              {[
                { icon: '✗', text: 'Every market requires its own legal and payroll setup', bad: true },
                { icon: '✗', text: 'Hiring great talent takes months and costs a fortune', bad: true },
                { icon: '✗', text: 'Compliance failures slow expansion to a crawl', bad: true },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20 flex-shrink-0">
                    <X className="w-3 h-3 text-rose-500" />
                  </div>
                  <span className="text-muted font-medium text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: visual */}
          <div className="lg:w-1/2 reveal">
            <div className="relative rounded-[3rem] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=70&auto=format&fit=crop"
                alt="Diverse global team collaborating across time zones"
                className="w-full h-[420px] object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 glass p-5 rounded-2xl border-cyan-500/20">
                <p className="text-cyan-400 text-[10px] font-mono uppercase tracking-widest mb-3">
                  One partner. Every country. Full compliance.
                </p>
                <div className="flex items-center justify-between">
                  {['🇵🇭 Manila', '🇻🇳 Hanoi', '🇨🇦 Toronto'].map(city => (
                    <span key={city} className="text-xs font-bold text-text">{city}</span>
                  ))}
                </div>
                <div className="h-1.5 bg-surface rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 w-full animate-pulse" />
                </div>
              </div>
            </div>

            <div className="grid gap-3 mt-8">
              {SERVICE_ANALOGIES.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: shouldReduceMotion ? 0.01 : 0.45, delay: shouldReduceMotion ? 0 : idx * 0.08 }}
                    className="glass micro-lift-card luxury-panel rounded-2xl border border-border p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-surface border border-border flex items-center justify-center mt-0.5">
                        <Icon className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-text mb-1">{item.title}</p>
                        <p className="text-xs md:text-sm text-muted leading-relaxed">{item.copy}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <SectionBridge label="Execution to structure" />

      {/* ===== BPO VS RPO + TECH EDUCATION ===== */}
      <section
        id="bpo-vs-rpo"
        aria-label="Why BPO Breaks"
        className="section-shell px-4 md:px-6 bg-[#f8fafc]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rose-500/20 bg-rose-500/5 text-rose-400 text-[10px] font-bold uppercase tracking-widest mb-6">
              <X className="w-3 h-3" />
              Why traditional BPO breaks
            </div>
            <h2 className="display-section text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-text">
              Old-school outsourcing just passes work around.<br />
              <span className="text-holo">We build the engine that runs it.</span>
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              If you want real growth, you need one partner that handles hiring, payroll, compliance, and delivery together.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 reveal">
            {/* Left: Traditional BPO */}
            <div className="glass micro-lift-card luxury-panel p-8 md:p-10 rounded-[2.5rem] border-rose-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-rose-500/5 blur-3xl pointer-events-none" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                  <X className="w-5 h-5 text-rose-400" />
                </div>
                <h3 className="text-xl font-bold text-text">Traditional BPO</h3>
              </div>
              <ul className="space-y-4">
                {[
                  'Pays for output, not business results',
                  'Uses generic hiring funnels with weak fit screening',
                  'Stops at delivery instead of owning the outcome',
                  'Gives you limited visibility into the work',
                  'Was not built for product teams that move fast',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <X className="w-3 h-3 text-rose-400" />
                    </div>
                    <span className="text-muted text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: TrivianEdge RPO + Tech */}
            <div className="glass micro-lift-card luxury-panel p-8 md:p-10 rounded-[2.5rem] border-cyan-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 blur-3xl pointer-events-none" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-text">TrivianEdge RPO + Tech</h3>
              </div>
              <ul className="space-y-4">
                {[
                  'We own the result, not just the checklist',
                  'We screen for skill, fit, and communication',
                  'You can see hiring, onboarding, and delivery clearly',
                  'Legal, payroll, and compliance are built in',
                  'The work stays tied to your product goals',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="text-muted text-sm leading-relaxed">{item}</span>
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

      <SectionBridge label="Structure to proof" />

      {/* ===== DUAL-ENGINE SERVICE DEFINITION ===== */}
      <section
        id="dual-engine"
        aria-label="Our Dual Engine"
        className="section-shell px-4 md:px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-400 text-[10px] font-bold uppercase tracking-widest mb-6">
              <Layers className="w-3 h-3" />
              How We're Built
            </div>
            <h2 className="display-section text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-text">
              Two engines.<br />One system.
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Your people and your product move together in one plan, not split across random vendors.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 reveal">
            {/* Engine 1: Talent */}
            <div className="glass micro-lift-card luxury-panel p-10 rounded-[2.5rem] border-border hover:border-cyan-500/30 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 blur-3xl group-hover:bg-cyan-500/10 transition-colors duration-700 pointer-events-none" />
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-surface border border-border flex items-center justify-center group-hover:border-cyan-400/30 group-hover:bg-cyan-500/10 transition-all duration-500">
                  <Users2 className="w-7 h-7 text-cyan-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">Engine 1</p>
                  <h3 className="text-xl font-bold text-text">Talent Infrastructure</h3>
                </div>
              </div>
              <p className="text-muted text-sm leading-relaxed mb-6">
                We find great people across six countries, then handle onboarding, payroll, and daily operations so your team can focus on growth.
              </p>
              <ul className="space-y-3">
                {[
                  'Niche tech and non-tech role sourcing',
                  'Deep vetting for skill, communication, and team compatibility',
                  'Full onboarding, contracts, and payroll management',
                  'International compliance handled in every jurisdiction',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Engine 2: Software */}
            <div className="glass micro-lift-card luxury-panel p-10 rounded-[2.5rem] border-border hover:border-violet-500/30 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-violet-500/5 blur-3xl group-hover:bg-violet-500/10 transition-colors duration-700 pointer-events-none" />
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-surface border border-border flex items-center justify-center group-hover:border-violet-400/30 group-hover:bg-violet-500/10 transition-all duration-500">
                  <Cpu className="w-7 h-7 text-violet-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-violet-400">Engine 2</p>
                  <h3 className="text-xl font-bold text-text">Software Development</h3>
                </div>
              </div>
              <p className="text-muted text-sm leading-relaxed mb-6">
                In-house engineering teams that build your product with security-first practices, clear delivery milestones, and full IP protection.
              </p>
              <ul className="space-y-3">
                {[
                  'In-house engineering teams, not contractors',
                  'Security-first build practices from day one',
                  'Product-aligned delivery with clear milestones',
                  'Full IP ownership remains with you, always',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted">
                    <CheckCircle2 className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
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

      <SectionBridge label="Proof to scale" />

      {/* ===== HEADACHE VALUE PROPOSITION ===== */}
      <section
        id="headache-removed"
        aria-label="We Remove the Bureaucracy"
        className="section-shell px-4 md:px-6 bg-[#f8fafc]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-8">
              <ShieldCheck className="w-3 h-3" />
              The Headache We Take Away
            </div>
            <h2 className="display-section text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-text">
              We remove the admin burden<br />
              <span className="text-holo">so you stay focused on growth.</span>
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto mb-16 leading-relaxed">
              Everything below is work you do not need to touch. We own it for you.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 reveal">
            {[
              {
                icon: <Globe2 className="w-6 h-6 text-cyan-400" />,
                title: 'International Hiring Rules',
                desc: 'Every country has different employment laws, visa requirements, and work permit rules. We know them all.',
                color: 'border-cyan-500/20 hover:border-cyan-500/40',
                glow: 'bg-cyan-500/5',
              },
              {
                icon: <Server className="w-6 h-6 text-violet-400" />,
                title: 'Local Payroll & Legal',
                desc: 'Payroll taxes, statutory deductions, and local legal requirements handled with zero errors across 6 jurisdictions.',
                color: 'border-violet-500/20 hover:border-violet-500/40',
                glow: 'bg-violet-500/5',
              },
              {
                icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
                title: 'Cross-Border Compliance',
                desc: 'Trade regulations, data protection laws, and bilateral agreement requirements navigated for every engagement.',
                color: 'border-emerald-500/20 hover:border-emerald-500/40',
                glow: 'bg-emerald-500/5',
              },
              {
                icon: <TrendingUp className="w-6 h-6 text-orange-400" />,
                title: 'Delivery Oversight',
                desc: 'Progress tracking, handoffs, and issue management. We run it so your leaders are not buried in admin.',
                color: 'border-orange-500/20 hover:border-orange-500/40',
                glow: 'bg-orange-500/5',
              },
            ].map(item => (
              <div
                key={item.title}
                className={`glass micro-lift-card luxury-panel p-8 rounded-[2rem] border transition-all duration-300 relative overflow-hidden group`}
                style={{ borderColor: 'var(--border)' }}
              >
                <div className={`absolute top-0 right-0 w-28 h-28 ${item.glow} blur-3xl pointer-events-none`} />
                <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h4 className="font-bold text-text mb-2">{item.title}</h4>
                <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
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
        className="section-shell px-4 md:px-6 bg-[#f8fafc]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-400 text-[10px] font-bold uppercase tracking-widest mb-6">
              <Zap className="w-3 h-3" />
              Simple 4-Step Process
            </div>
            <h2 className="display-section text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-text">How We Get You Set Up</h2>
            <p className="text-muted text-lg max-w-xl mx-auto">
              From first conversation to your new team member's first day, the whole process takes about 30 days.
            </p>
          </div>
          <ProcessTimeline />
        </div>
      </section>

      {/* ===== ACT 5: PROOF ===== */}
      <section
        id="why-us"
        aria-label="Client Results"
        className="section-shell px-4 md:px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-6">
              <CheckCircle2 className="w-3 h-3" />
              Proof, not promises.
            </div>
            <h2 className="display-section text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-text">
              Real work. Real outcomes.
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto mb-6">
              Case studies and client feedback, presented without the usual marketing noise.
            </p>
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-sm font-semibold text-cyan-600">
              <TrendingUp className="w-4 h-4" />
              $2.1M in client savings across 14 engagements in the last 12 months
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {CASE_STUDIES.slice(0, 2).map((study) => (
              <article key={study.client} className="reveal glass micro-lift-card p-8 rounded-[2rem] border-border">
                <p className="text-xs font-bold uppercase tracking-widest text-cyan-600 mb-3">{study.sector}</p>
                <h3 className="text-2xl font-bold mb-4 text-text">{study.client}</h3>
                <p className="text-muted text-sm md:text-base leading-relaxed mb-4"><strong className="text-text">Challenge:</strong> {study.challenge}</p>
                <p className="text-muted text-sm md:text-base leading-relaxed mb-4"><strong className="text-text">Approach:</strong> {study.approach}</p>
                <p className="text-muted text-sm md:text-base leading-relaxed"><strong className="text-text">Outcome:</strong> {study.outcome}</p>
              </article>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((item) => (
              <blockquote key={item.author + item.role} className="reveal glass micro-lift-card p-8 rounded-[2rem] border-border">
                <p className="text-lg leading-relaxed text-text mb-6">“{item.quote}”</p>
                <footer className="text-sm text-muted">
                  <span className="font-semibold text-text">{item.author}</span>, {item.role}
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
        className="section-shell px-4 md:px-6 bg-[#f8fafc]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-6">
              <Users2 className="w-3 h-3" />
              Non-Tech Success Stories
            </div>
            <h2 className="display-section text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-text">
              We do not only place developers.
              <br />
              <span className="text-holo">We scale operations teams too.</span>
            </h2>
            <p className="text-muted text-lg max-w-3xl mx-auto">
              These are business-side and delivery-side wins where non-technical roles created direct performance gains.
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
                className="reveal glass micro-lift-card luxury-panel p-8 rounded-[2rem] border-border"
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 mb-3">{study.function}</p>
                <h3 className="text-2xl font-bold text-text mb-4">{study.company}</h3>
                <p className="text-sm text-muted leading-relaxed mb-3"><span className="text-text font-semibold">Challenge:</span> {study.challenge}</p>
                <p className="text-sm text-muted leading-relaxed mb-3"><span className="text-text font-semibold">Approach:</span> {study.approach}</p>
                <p className="text-sm text-muted leading-relaxed"><span className="text-text font-semibold">Result:</span> {study.result}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ACT 6: SERVICES BENTO GRID ===== */}
      <section
        id="solutions"
        aria-label="Our Services"
        className="section-shell px-4 md:px-6 bg-[#f8fafc]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-400 text-[10px] font-bold uppercase tracking-widest mb-6">
              <Layers className="w-3 h-3" />
              What We Do
            </div>
            <h2 className="display-section text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-text">
              BPO, RPO, AI development,<br />and IT outsourcing, under one roof.
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Whether you need offshore software engineers, managed back-office operations, or a Canadian-overseen IT team, we handle talent sourcing, onboarding, and delivery end-to-end.
            </p>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {SERVICES.map((service, idx) => {
              const isWide = idx === 0 || idx === 3;
              const isFull = idx === 4;
              return (
                <div
                  key={idx}
                  className={[
                    'reveal glass p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border-border hover:border-cyan-500/30',
                    'transition-all duration-500 group relative overflow-hidden service-card-glow micro-lift-card flex flex-col',
                    isWide ? 'md:col-span-2' : '',
                    isFull ? 'md:col-span-3' : '',
                  ].join(' ')}
                  style={{ transitionDelay: `${idx * 80}ms` }}
                >
                  <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 blur-3xl group-hover:bg-cyan-500/10 transition-colors duration-700 pointer-events-none" />

                  <div className="mb-6 p-4 rounded-2xl bg-surface border border-border w-fit group-hover:bg-cyan-500/10 group-hover:border-cyan-400/30 group-hover:scale-105 transition-all duration-500 shadow-lg shadow-black/10">
                    {service.icon}
                  </div>

                  <h3 className={`font-bold mb-4 group-hover:text-cyan-400 transition-colors duration-300 text-text ${isWide || isFull ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`}>
                    {service.title}
                  </h3>

                  <p className="text-muted text-sm md:text-base leading-relaxed mb-6 flex-grow">
                    {service.description}
                  </p>

                  <div className={`grid gap-4 md:gap-6 pt-6 border-t border-border mt-auto ${isFull ? 'md:grid-cols-3' : isWide ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                    <div>
                      <h5 className="text-[10px] font-bold uppercase tracking-widest text-muted mb-3 flex items-center gap-1.5">
                        <Layers className="w-3 h-3" /> What is included
                      </h5>
                      <ul className="space-y-2">
                        {service.features.map((f, i) => (
                          <li key={i} className="text-xs text-muted flex items-start gap-2">
                            <span className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-[10px] font-bold uppercase tracking-widest text-muted mb-3 flex items-center gap-1.5">
                        <TrendingUp className="w-3 h-3" /> What you get
                      </h5>
                      <ul className="space-y-2">
                        {service.outcomes.map((o, i) => (
                          <li key={i} className="text-xs text-muted flex items-start gap-2">
                            <CheckCircle2 className="w-3 h-3 text-cyan-400 mt-0.5 flex-shrink-0" />
                            {o}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {isFull && (
                      <div>
                        <h5 className="text-[10px] font-bold uppercase tracking-widest text-muted mb-3">Service tags</h5>
                        <div className="flex flex-wrap gap-2">
                          {service.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 rounded-full bg-surface border border-border text-[10px] font-bold uppercase tracking-widest text-muted">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {!isFull && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {service.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 rounded-full bg-surface border border-border text-[10px] font-bold uppercase tracking-widest text-muted group-hover:border-cyan-500/20 group-hover:text-cyan-400/80 transition-colors">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== ACT 6B: AI VENTURE ECOSYSTEM ===== */}
      <section
        id="ai-ecosystem"
        aria-label="AI venture ecosystem"
        className="section-shell px-4 md:px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-400 text-[10px] font-bold uppercase tracking-widest mb-6">
              <Cpu className="w-3 h-3" />
              Building The Future With AI
            </div>
            <h2 className="display-section text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-text">
              Explore the ventures we are building
              <br />
              <span className="text-holo">across the Trivian ecosystem.</span>
            </h2>
            <p className="text-muted text-lg max-w-3xl mx-auto">
              These platforms represent where we are heading: practical AI systems, execution-first products, and real business impact.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {AI_VENTURES.map((venture, idx) => (
              <motion.a
                key={venture.name}
                href={venture.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: shouldReduceMotion ? 0.01 : 0.45, delay: shouldReduceMotion ? 0 : idx * 0.08 }}
                className="reveal glass micro-lift-card rounded-[2rem] p-8 border-border block group"
              >
                <div className="flex items-center justify-between gap-4 mb-3">
                  <h3 className="text-2xl font-bold text-text group-hover:text-cyan-400 transition-colors duration-300">{venture.name}</h3>
                  <ExternalLink className="w-5 h-5 text-cyan-400" />
                </div>
                <p className="text-sm text-muted leading-relaxed">{venture.summary}</p>
              </motion.a>
            ))}
          </div>

            <div className="glass border border-cyan-500/20 rounded-[2rem] p-8 md:p-10 text-center reveal micro-lift-card luxury-panel">
            <p className="text-sm uppercase tracking-widest font-bold text-cyan-400 mb-3">MVP Venture Offer</p>
            <h3 className="text-3xl md:text-4xl font-bold text-text mb-4">Do you have an idea? Tell us what it is.</h3>
            <p className="text-muted text-base md:text-lg max-w-3xl mx-auto mb-6">
              We are opening a founder lane for selected ideas: if your concept fits, we will help you build an MVP free of charge.
            </p>
            <a
              href="/venture-studio"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl premium-button micro-press-button font-bold"
            >
              Start Venture Studio Qualification
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      <SectionBridge label="Scale to launch" />

      {/* ===== ACT 7: TALENT HUBS + WORLD MAP ===== */}
      <section
        id="talent-hubs"
        aria-label="Global Talent Hubs"
        className="section-shell px-4 md:px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-6">
              <Globe2 className="w-3 h-3" />
              Where Your Team Comes From
            </div>
            <h2 className="display-section text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-text">Great people. Everywhere.</h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              We source from 6 countries selected for their talent quality, English proficiency, and timezone fit with your business. Hover any pin to explore.
            </p>
          </div>

          {/* Interactive world map */}
          <div className="reveal rounded-[3rem] border border-border bg-[rgba(10,10,20,0.7)] backdrop-blur-sm p-4 md:p-8 mb-12 overflow-hidden shadow-2xl shadow-black/30">
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

      {/* ===== ROLES WE PLACE ===== */}
      <section
        id="roles"
        aria-label="Roles We Place"
        className="section-shell px-4 md:px-6 bg-[#f8fafc]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-6">
              <Globe2 className="w-3 h-3" />
              What We Source
            </div>
            <h2 className="display-section text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-text">
              Tech roles and non-tech roles.<br />
              <span className="text-holo">One quality bar.</span>
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              We are not just a tech company. We build full teams across engineering, operations, finance, support, and leadership.
            </p>
          </div>

          <div className="reveal mb-8 grid md:grid-cols-3 gap-4">
            {[
              { label: 'Technical Roles', value: 'Engineering, Product, Data, Security' },
              { label: 'Business Roles', value: 'Finance, HR, Admin, Customer Support' },
              { label: 'Leadership Roles', value: 'Ops Leads, Delivery Managers, Project Owners' },
            ].map((item) => (
              <div key={item.label} className="glass micro-lift-card rounded-2xl border border-border p-5">
                <p className="text-[10px] uppercase tracking-widest font-bold text-cyan-400 mb-2">{item.label}</p>
                <p className="text-sm text-text font-semibold">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {ROLES.map((category) => (
              <div
                key={category.title}
                className={`reveal glass micro-lift-card p-10 rounded-[2.5rem] border-border bg-gradient-to-br ${category.gradient} relative overflow-hidden`}
              >
                <h3 className="text-xl font-bold text-text mb-6">{category.title}</h3>
                <ul className="space-y-3">
                  {category.roles.map((role) => (
                    <li key={role} className="flex items-center gap-3 text-sm text-muted">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      {role}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ACT 9: CTA + CONTACT ===== */}
      <section id="contact" aria-label="Contact Us" className="section-shell px-4 md:px-6">
        <div className="max-w-7xl mx-auto reveal">
          <div className="glass p-6 sm:p-10 md:p-24 rounded-[2rem] sm:rounded-[3rem] md:rounded-[4rem] border-border text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(0,196,154,0.10) 0%, transparent 70%)' }} />
            <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)' }} />
            <div className="relative z-10">
              <h2 className="display-section text-3xl sm:text-5xl md:text-7xl font-bold mb-8 text-text">
                Tell us what you need,
                <br className="hidden sm:block" />we will map the next move.
              </h2>
              <p className="text-muted text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
                Tech hiring, non-tech hiring, delivery support, market expansion. We will build a clear plan in plain English.
              </p>

              <div className="mb-10 max-w-3xl mx-auto glass border border-violet-500/20 rounded-2xl p-6 md:p-8 micro-lift-card luxury-panel">
                <p className="text-[10px] uppercase tracking-widest font-bold text-violet-400 mb-2">Founder Option</p>
                <p className="text-xl md:text-2xl font-bold text-text mb-2">Have an idea? We can build your MVP free of charge.</p>
                <p className="text-sm md:text-base text-muted">Send your idea in simple terms. If it is a fit, we will scope and build your MVP with you at no charge.</p>
                <div className="mt-4">
                  <Link to="/venture-studio" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl premium-button micro-press-button font-bold text-sm">
                    Go To Venture Studio
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="max-w-4xl mx-auto text-left mb-10">
                <InquiryForm />
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <a href="mailto:kevin.v@trivianedge.com" className="px-6 sm:px-12 py-4 sm:py-6 bg-btn-bg text-btn-text rounded-2xl font-bold text-base sm:text-xl hover:opacity-90 transition-all shadow-2xl shadow-cyan-500/10 flex items-center justify-center gap-2 micro-press-button">
                  <Mail className="w-5 h-5" />
                  Email the team
                </a>
                <a href="tel:+18882028513" className="px-6 sm:px-12 py-4 sm:py-6 glass text-text rounded-2xl font-bold text-base sm:text-xl hover:bg-surface transition-all flex items-center justify-center gap-2 micro-press-button">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  Call now
                </a>
              </div>
            </div>
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

          <footer className="pt-16 md:pt-32 pb-16 px-4 md:px-6 border-t border-border">
            <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16 mb-20 reveal">
              <div className="md:col-span-2">
                <div className="mb-8"><Logo onClick={() => { navigate('/'); window.scrollTo({top: 0, behavior: 'smooth'}); }} /></div>
                <p className="text-muted text-lg max-w-sm mb-10 leading-relaxed">Canada's BPO and offshore outsourcing partner. We hire great people around the world and deploy managed remote teams across 6 time zones. 30-day deployment. Up to 40% cost savings.</p>
                <div className="flex gap-6">
                  <a 
                    href="https://www.linkedin.com/company/trivianedge/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="TrivianEdge on LinkedIn"
                    className="p-3 glass rounded-xl hover:text-cyan-400 transition-all duration-300 border-border hover:scale-110 hover:shadow-[0_0_20px_-5px_rgba(0,196,154,0.6)] hover:border-cyan-400/30 text-text"
                  >
                    <Linkedin />
                  </a>
                  <a 
                    href="https://x.com/trivianedge"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TrivianEdge on X (Twitter)"
                    className="p-3 glass rounded-xl hover:text-cyan-400 transition-all duration-300 border-border hover:scale-110 hover:shadow-[0_0_20px_-5px_rgba(0,196,154,0.6)] hover:border-cyan-400/30 text-text"
                  >
                    <Twitter />
                  </a>
                  <a 
                    href="mailto:kevin.v@trivianedge.com" 
                    aria-label="Email TrivianEdge"
                    className="p-3 glass rounded-xl hover:text-cyan-400 transition-all duration-300 border-border hover:scale-110 hover:shadow-[0_0_20px_-5px_rgba(0,196,154,0.6)] hover:border-cyan-400/30 text-text"
                  >
                    <Mail />
                  </a>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-text mb-8 tracking-widest uppercase text-xs">Platform</h4>
                <ul className="space-y-6 text-muted font-medium">
                  <li><a href="/#solutions" onClick={(e) => { e.preventDefault(); scrollToSection('solutions'); }} className="hover:text-text transition-colors">Our Services</a></li>
                  <li><Link to="/proof" className="hover:text-text transition-colors">Proof</Link></li>
                  <li><Link to="/trust" className="hover:text-text transition-colors">Trust</Link></li>
                  <li><Link to="/venture-studio" className="hover:text-text transition-colors">Venture Studio</Link></li>
                  <li><Link to="/blog" className="hover:text-text transition-colors">Blog</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-text mb-8 tracking-widest uppercase text-xs">Resources</h4>
                <ul className="space-y-6 text-muted font-medium">
                  <li><Link to="/contact" className="hover:text-text transition-colors">Contact</Link></li>
                  <li><Link to="/proof" className="hover:text-text transition-colors">Case Studies</Link></li>
                  <li><Link to="/venture-studio" className="hover:text-text transition-colors">MVP Qualification</Link></li>
                  <li><Link to="/privacy" className="hover:text-text transition-colors">Privacy Policy</Link></li>
                  <li><Link to="/trust" className="hover:text-text transition-colors">Security & Compliance</Link></li>
                </ul>
              </div>
            </div>
            <div className="max-w-7xl mx-auto pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-mono tracking-widest uppercase text-muted reveal">
              <p>© {new Date().getFullYear()} TRIVIANEDGE GLOBAL. ALL RIGHTS RESERVED.</p>
              <div className="flex gap-12">
                <Link to="/privacy" className="hover:text-text transition-colors">Privacy Protocol</Link>
                <Link to="/terms" className="hover:text-text transition-colors">Terms of Engagement</Link>
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
