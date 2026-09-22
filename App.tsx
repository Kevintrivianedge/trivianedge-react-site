import React, { useEffect, useState, useMemo, lazy, Suspense } from 'react';
import { AnimatePresence, motion, useReducedMotion, useInView } from 'framer-motion';
import ScrollProgressBar from './components/ScrollProgressBar';
import TextReveal from './components/TextReveal';
import AnimatedCounter from './components/AnimatedCounter';
import InteractiveStatsGrid from './components/InteractiveStatsGrid';
import InteractiveServiceCard from './components/InteractiveServiceCard';
import {
  ArrowRight,
  ChevronRight,
  Mail,
  Linkedin,
  Twitter,
  CheckCircle2,
  Code2,
  Users2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Routes, Route, useLocation, useNavigate, Link } from 'react-router-dom';
import { TALENT_HUBS, STEPS, BOOKING_URL } from './constants';
import { CASE_STUDIES, TESTIMONIALS } from './constants/proof';
import { TalentHub } from './types';
import { LanguageProvider } from './contexts/LanguageContext';
import { GeoProvider } from './contexts/GeoContext';
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
  buildLocalBusinessSchema,
  breadcrumbSchema,
  buildWebPageSchema,
  buildServiceItemListSchema,
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
import TalentHubCard from './components/TalentHubCard';
import ScrollToTop from './components/ScrollToTop';
import { ErrorBoundary } from './components/ErrorBoundary';
import HeroNetworkVisual from './components/HeroNetworkVisual';
import HeroVideoSection from './components/HeroVideoSection';
import ServiceCard3D from './components/ServiceCard3D';
import PageTransition from './components/PageTransition';
import RealtimeDashboard from './components/RealtimeDashboard';
import BenefitsVisualization from './components/BenefitsVisualization';
import AIChatNotification from './components/AIChatNotification';
import AnimatedFormInput from './components/AnimatedFormInput';
import SectionReveal from './components/SectionReveal';
import AnimatedChart from './components/AnimatedChart';
import SkeletonLoader from './components/SkeletonLoader';
import VideoTestimonialCard from './components/VideoTestimonialCard';
import MobileGestureWrapper from './components/MobileGestureWrapper';
import MultiLayerParallax from './components/MultiLayerParallax';
import EnhancedVideoHero from './components/EnhancedVideoHero';
import LiveMetricsStream from './components/LiveMetricsStream';

// Lazy-load route-level pages and heavy below-fold interactive modules.
// This splits each into its own chunk so the main bundle only contains
// the above-the-fold home page content.
const TalentHubModal          = lazy(() => import('./components/TalentHubModal').then(m => ({ default: m.TalentHubModal })));
const BlogView                = lazy(() => import('./components/BlogView'));
const BlogPostDetail          = lazy(() => import('./components/BlogPostDetail'));
const ContactPage             = lazy(() => import('./pages/ContactPage'));
const ProofPage               = lazy(() => import('./pages/ProofPage'));
const TrustPage                = lazy(() => import('./pages/TrustPage'));
const TalentHubPage            = lazy(() => import('./pages/TalentHubPage'));
const ComparisonPage           = lazy(() => import('./pages/ComparisonPage'));
const IndustryPage             = lazy(() => import('./pages/IndustryPage'));
const IndustriesIndexPage      = lazy(() => import('./pages/IndustriesIndexPage'));
const ServiceCountryPage       = lazy(() => import('./pages/ServiceCountryPage'));
const AboutPage               = lazy(() => import('./pages/AboutPage'));
const PrivacyPage             = lazy(() => import('./pages/PrivacyPage'));
const TermsPage               = lazy(() => import('./pages/TermsPage'));
const CookiePolicyPage        = lazy(() => import('./pages/CookiePolicyPage'));
const BPOPage                 = lazy(() => import('./pages/services/BPOPage'));
const RPOPage                 = lazy(() => import('./pages/services/RPOPage'));
const FullCycleRPOPage        = lazy(() => import('./pages/services/rpo/FullCycleRPOPage'));
const ProjectBasedRPOPage     = lazy(() => import('./pages/services/rpo/ProjectBasedRPOPage'));
const AIPoweredRecruitmentPage = lazy(() => import('./pages/services/rpo/AIPoweredRecruitmentPage'));
const AIDevelopmentPage       = lazy(() => import('./pages/services/AIDevelopmentPage'));
const GenerativeAIPage        = lazy(() => import('./pages/services/ai-development/GenerativeAIPage'));
const LLMIntegrationPage      = lazy(() => import('./pages/services/ai-development/LLMIntegrationPage'));
const MachineLearningPage     = lazy(() => import('./pages/services/ai-development/MachineLearningPage'));
const AIAutomationPage        = lazy(() => import('./pages/services/ai-development/AIAutomationPage'));
const AIChatbotDevelopmentPage = lazy(() => import('./pages/services/ai-development/AIChatbotDevelopmentPage'));
const MLOpsPage               = lazy(() => import('./pages/services/ai-development/MLOpsPage'));
const ITOutsourcingPage       = lazy(() => import('./pages/services/ITOutsourcingPage'));
const VentureStudioPage       = lazy(() => import('./pages/VentureStudioPage'));
const AriaOSPage               = lazy(() => import('./pages/AriaOSPage'));
const AetherLogisticsPage       = lazy(() => import('./pages/AetherLogisticsPage'));
const ServicesPage            = lazy(() => import('./pages/ServicesPage'));
const SavingsCalculatorPage   = lazy(() => import('./pages/SavingsCalculatorPage'));
const NotFoundPage            = lazy(() => import('./pages/NotFoundPage'));
const ChatSidebar             = lazy(() => import('./components/ChatSidebar'));
const WorldMapLazy            = lazy(() => import('./components/WorldMapLazy'));
const CityLandingPage         = lazy(() => import('./components/CityLandingPage'));


// Trust strip — real named clients only, kept separate from the hero's numeric stats
// so the strip isn't mixing unlike content types (numbers, names, flags) in one place.
// width/height are each logo's intrinsic pixel size (not display size) so the
// browser can reserve the right aspect ratio before the image loads and avoid CLS.
const TRUST_CLIENTS = [
  { name: 'Capricorn College', logo: '/logos/capricorn-college.webp', href: 'https://www.capricorncollegeholbrook.lk/', width: 86, height: 64 },
  { name: 'Cargo Login',       logo: '/logos/cargo-login.webp',       href: 'https://www.cargo-login.com/',            width: 62, height: 64 },
  { name: 'Keynotive',         logo: '/logos/keynotive.webp',         href: 'https://www.keynotive.io/',               width: 201, height: 160 },
  { name: 'Hub-Flx',           logo: '/logos/hub-flx.webp',           href: 'https://www.hub-flx.com/',                width: 250, height: 64  },
  { name: 'Keynesia International School', logo: '/logos/keynesia-international-school.webp', href: 'https://keynesiasrilanka.com', width: 69, height: 64 },
  { name: 'MellieBugs',        logo: '/logos/melliebugs.webp',        href: 'https://melliebugs.com',                  width: 64, height: 64 },
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
    metric: '~30 days to hire',
    link: '/services/rpo',
  },
  {
    title: 'We Handle the Paperwork',
    description: 'Contracts, payroll, taxes, and local employment laws in every country, all taken care of. Developers, support, finance, HR, or ops: one partner covers your full team, not just the technical side.',
    icon: ShieldCheck,
    accent: 'text-cyan-500',
    iconBg: 'from-cyan-400/20 to-cyan-400/5',
    iconBorder: 'border-cyan-400/25',
    glow: 'bg-cyan-400/8',
    metric: '6 countries covered',
    link: '/services/bpo',
  },
  {
    title: 'We Build Bespoke Software',
    description: 'Custom applications, internal tools, and platforms, built by dedicated offshore engineers who work in your stack and your time zone. You own the code. Work never sits idle overnight.',
    icon: Code2,
    accent: 'text-cyan-500',
    iconBg: 'from-cyan-400/20 to-cyan-400/5',
    iconBorder: 'border-cyan-400/25',
    glow: 'bg-cyan-400/8',
    metric: '24/7 coverage',
    link: '/services/it-outsourcing',
  },
];

const AI_VENTURES = [
  {
    name: 'Aria OS',
    url: '/ai-ventures/aria',
    summary: 'The autonomous workforce operating system: hiring, payroll, compliance, and performance run by one AI core. Free for 10 employees.',
  },
  {
    name: 'Aether Logistics OS',
    url: '/ai-ventures/aether-logistics',
    summary: 'AI-native freight operating system: compliance, routing, carrier booking, and customs clearance across 195 countries from one control tower.',
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
    answer: 'TrivianEdge helps businesses hire people in other countries and build software. We handle all the hard parts: finding candidates, running payroll, managing local employment law, and keeping your team running. You tell us what you need and we typically have your team live within 30 days.',
  },
  {
    question: 'Where is TrivianEdge based?',
    answer: 'TrivianEdge is headquartered in Toronto, Ontario, Canada. We serve clients across North America, the UK, Australia, and the Middle East. Our talent operations span six countries: the Philippines, Vietnam, Sri Lanka, Turkey, South Africa, and Costa Rica.',
  },
  {
    question: 'How quickly can TrivianEdge deploy a team?',
    answer: 'Our standard deployment timeline runs around 30 days. That covers candidate sourcing, screening, legal setup, payroll, and onboarding. Actual timing varies by role and location: some move faster, more specialized roles can take longer.',
  },
  {
    question: 'How much does it cost to work with TrivianEdge?',
    answer: 'Most clients save up to 40% compared to hiring locally in Canada, the US, or the UK. Exact pricing depends on the role, country, and team size. We offer a free consultation where we scope the engagement and give you a clear cost estimate.',
  },
  {
    question: 'What types of roles can TrivianEdge hire for?',
    answer: 'Both technical and non-technical roles. Technical: software engineers, AI developers, DevOps, QA, data scientists. Non-technical: operations, customer support, finance, HR, sales, and executive assistants. We hire the full team, not just developers.',
  },
  {
    question: 'Do I need to set up a company in another country to work with TrivianEdge?',
    answer: 'No. TrivianEdge coordinates employment through in-country employer-of-record and payroll partners, which means you hire globally without setting up any foreign entities, payroll accounts, or legal structures yourself. We manage that relationship end to end so it is a single point of contact for you.',
  },
  {
    question: 'What is the difference between BPO and RPO?',
    answer: 'BPO (Business Process Outsourcing) means we run an ongoing business function for you, like customer support, back-office admin, or data processing. RPO (Recruitment Process Outsourcing) means we run your hiring process as an embedded part of your HR team. Both can be combined, and TrivianEdge offers both under one roof.',
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
    answer: 'No minimum headcount, we can start with one person. Contract terms depend on the engagement model. Many clients start with a project-based arrangement and move to an ongoing model once they see results.',
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
      <HeroVideoSection
        videoSrc={undefined}
        fallbackImageSrc={undefined}
      >
        <div className="flex-1 min-w-0 max-w-[760px]">
          {/* EYEBROW — Operator positioning */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs font-bold tracking-[0.25em] uppercase text-cyan-400 mb-8"
          >
            Operator. Builder. Partner.
          </motion.p>

          {/* HEADLINE — Line-by-line reveal with stagger */}
          <h1 className="display-hero font-bold tracking-tight mb-8 leading-[1.02] text-white">
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              Built For
            </motion.span>
            <motion.span
              className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              What's Next
            </motion.span>
          </h1>

          {/* SUBHEADING */}
          <p className="text-white/70 text-xl md:text-2xl max-w-2xl mb-12 md:mb-16 leading-relaxed font-light">
            Offshore teams, global compliance, bespoke software. One partner, one contract, one point of accountability.
          </p>

          {/* CTAs — Premium hover states */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.95, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-start gap-4"
          >
            {/* Primary CTA */}
            <motion.a
              href="#contact"
              onClick={e => { e.preventDefault(); scrollTo('contact'); }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 group bg-cyan-400 text-black hover:text-black transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              style={{
                boxShadow: '0 0 0px rgba(0, 196, 154, 0)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 40px rgba(0, 196, 154, 0.4), 0 0 80px rgba(0, 255, 224, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 0px rgba(0, 196, 154, 0)';
              }}
            >
              Get Started
              <motion.div
                animate={{ x: 0 }}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </motion.a>

            {/* Secondary CTA */}
            <motion.a
              href="#how-it-works"
              onClick={e => { e.preventDefault(); scrollTo('how-it-works'); }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              How It Works
              <motion.div
                animate={{ x: 0 }}
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="w-5 h-5" />
              </motion.div>
            </motion.a>
          </motion.div>
        </div>
      </HeroVideoSection>

      {/* ===== STATS SHOWCASE ===== */}
      <section aria-label="Key metrics" className="relative px-4 sm:px-6 py-16 md:py-20 border-b border-border overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 reveal">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-3">
              How we deliver at scale
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Built for high-volume recruiting and operations across multiple geographies.
            </p>
          </div>

          <InteractiveStatsGrid
            stats={[
              {
                value: 30,
                label: 'Days to Deploy',
                description: 'From intake to full team setup',
                suffix: ' days',
                icon: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" /></svg>,
              },
              {
                value: 40,
                label: 'Cost Savings',
                description: 'vs. North American hires',
                suffix: '%',
                icon: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>,
              },
              {
                value: 6,
                label: 'Global Hubs',
                description: 'Across five continents',
                icon: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>,
              },
              {
                value: 24,
                label: 'Hour Coverage',
                description: 'Round-the-clock operations',
                suffix: '/7',
                icon: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M13 9h-2v2h2V9zm0 4h-2v2h2v-2zm4-4h-2v2h2V9zm0 4h-2v2h2v-2zM19 3h-1V1h-2v2h-4V1H9v2H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H8V8h11v11z" /></svg>,
              },
            ]}
            columns={4}
          />
        </div>
      </section>

      {/* ===== ANIMATED GLOBE SECTION ===== */}
      <section aria-label="Global operations visualization" className="relative px-4 sm:px-6 py-20 md:py-28 border-b border-border overflow-hidden section-tint">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-400/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-3">
              Talent across continents
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto mb-12">
              Six global hubs strategically positioned for 24/7 coverage and timezone optimization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-lg bg-white/5 border border-border">
              <h3 className="text-lg font-bold text-text mb-2">Philippines</h3>
              <p className="text-muted text-sm">Largest hub with 200+ developers, designers, and support specialists</p>
            </div>
            <div className="p-6 rounded-lg bg-white/5 border border-border">
              <h3 className="text-lg font-bold text-text mb-2">Vietnam & Sri Lanka</h3>
              <p className="text-muted text-sm">Emerging talent pools with strong engineering and operations expertise</p>
            </div>
            <div className="p-6 rounded-lg bg-white/5 border border-border">
              <h3 className="text-lg font-bold text-text mb-2">Turkey & South Africa</h3>
              <p className="text-muted text-sm">Hybrid timezone coverage bridging Asia and North America</p>
            </div>
            <div className="p-6 rounded-lg bg-white/5 border border-border">
              <h3 className="text-lg font-bold text-text mb-2">Costa Rica</h3>
              <p className="text-muted text-sm">Americas-based talent for projects requiring same-timezone collaboration</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== REAL-TIME DASHBOARD SECTION ===== */}
      <section aria-label="Real-time operations dashboard" className="relative px-4 sm:px-6 py-20 md:py-28 border-b border-border overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto">
          <RealtimeDashboard />
        </div>
      </section>

      {/* ===== BENEFITS VISUALIZATION SECTION ===== */}
      <section aria-label="Benefits and value visualization" className="relative px-4 sm:px-6 py-20 md:py-28 border-b border-border overflow-hidden section-tint">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-400/10 to-emerald-400/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto">
          <BenefitsVisualization />
        </div>
      </section>

      {/* ===== ACT 2: TRUST STRIP ===== */}
      <section aria-label="Trust signals" className="py-8 md:py-10 border-y border-border bg-[#fafafa] dark:bg-white/[0.03] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center gap-4 md:gap-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted whitespace-nowrap shrink-0">Trusted by operators worldwide</p>
          <div className="marquee-viewport w-full">
            <div className="marquee-track">
              {[0, 1, 2].map(rep => (
                <div key={rep} className="flex items-center gap-14 md:gap-16 pr-14 md:pr-16" aria-hidden={rep > 0}>
                  {TRUST_CLIENTS.map(client => (
                    <a
                      key={client.name}
                      href={client.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={client.name}
                      tabIndex={rep > 0 ? -1 : 0}
                      className="shrink-0 opacity-70 hover:opacity-100 transition-opacity duration-300"
                    >
                      <img
                        src={client.logo}
                        alt={client.name}
                        width={client.width}
                        height={client.height}
                        className="h-7 md:h-8 w-auto object-contain"
                        loading="lazy"
                      />
                    </a>
                  ))}
                </div>
              ))}
            </div>
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
              <span className="sr-only">What does TrivianEdge do? </span>
              Hire globally.<br />
              <span className="text-holo">Start with six proven talent hubs.</span>
            </h2>
            <p className="text-muted text-lg max-w-3xl mx-auto">
              TrivianEdge is a Toronto-based BPO, RPO, and bespoke software development company that typically deploys offshore teams within 30 days. We hire people for your back office, run your recruiting pipeline, and build the custom software your product needs, sourced from six global talent hubs (Philippines, Vietnam, Sri Lanka, Turkey, South Africa, and Costa Rica) and matched to your time zone. Most companies juggle three or four vendors for hiring, payroll, and software. We bring people and software delivery under one roof, so nothing falls through the cracks.
            </p>
          </div>

          {/* 3D Service Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6 reveal">
            {PREMIUM_FEATURES.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <ServiceCard3D
                  key={feature.title}
                  icon={<Icon className="w-6 h-6" />}
                  title={feature.title}
                  description={feature.description}
                  metric={feature.metric}
                  accent={feature.accent}
                  link={feature.link}
                  index={idx}
                />
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
            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl w-full text-left">
              <div className="glass rounded-2xl p-5 border-border">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2">The usual way</p>
                <p className="text-sm text-text/70 leading-relaxed">A BPO firm, a recruiter, and a dev shop. Three contracts, three handoffs, three invoices, and nobody owns the whole picture.</p>
              </div>
              <div className="glass border-gradient-animated relative rounded-2xl p-5 border-cyan-400/20" style={{ boxShadow: '0 0 0 1px rgba(0,196,154,0.08)' }}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-500 mb-2">With TrivianEdge</p>
                <p className="text-sm text-text/80 leading-relaxed font-medium">One partner for BPO, RPO, and bespoke software. One contract, one team, one point of accountability.</p>
              </div>
            </div>
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

      {/* ===== ACT 3: SAVINGS CALCULATOR PROMO ===== */}
      <section aria-label="Savings calculator promo" className="border-t border-border px-4 md:px-6 py-6">
        <Link
          to="/savings-calculator"
          className="reveal max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center group py-2"
        >
          <span className="text-sm md:text-base text-text/80">
            Curious what an offshore team would save <em className="not-italic font-bold text-text">you</em>?
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm md:text-base font-bold text-cyan-600 group-hover:gap-2.5 transition-all duration-200 whitespace-nowrap">
            Try the free savings calculator
            <ChevronRight className="w-4 h-4" />
          </span>
        </Link>
      </section>

      {/* ===== PHASE 6: LIVE METRICS STREAM ===== */}
      <section aria-label="Real-time metrics streaming" className="relative px-4 sm:px-6 py-20 md:py-28 border-b border-border overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto">
          <SectionReveal direction="up" className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-text mb-3">Live Operations Feed</h3>
            <p className="text-muted text-lg max-w-2xl mx-auto">Real-time insights into our global team activity and deployment metrics.</p>
          </SectionReveal>

          <LiveMetricsStream
            metrics={[
              { id: '1', label: 'Active Deployments', value: 47, delta: 12, trend: 'up', icon: <Zap className="w-6 h-6" />, color: 'cyan' },
              { id: '2', label: 'Team Members Online', value: 287, delta: 23, trend: 'up', icon: <Users2 className="w-6 h-6" />, color: 'emerald' },
              { id: '3', label: 'Tickets Resolved', value: 1042, delta: 8, trend: 'up', icon: <CheckCircle2 className="w-6 h-6" />, color: 'amber' },
              { id: '4', label: 'Avg Response Time', value: 2, delta: -15, trend: 'down', icon: <Code2 className="w-6 h-6" />, color: 'cyan' },
            ]}
            updateInterval={4000}
          />
        </div>
      </section>

      {/* ===== PHASE 6: ANIMATED METRICS CHARTS ===== */}
      <section aria-label="Performance metrics visualization" className="relative px-4 sm:px-6 py-20 md:py-28 border-b border-border overflow-hidden section-tint">
        <div className="max-w-7xl mx-auto">
          <SectionReveal direction="left" className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-text mb-3">Performance Over Time</h3>
            <p className="text-muted text-lg">Track key metrics with interactive visualizations.</p>
          </SectionReveal>

          <div className="grid lg:grid-cols-2 gap-8">
            <AnimatedChart
              type="bar"
              title="Deployment Speed by Region"
              data={[
                { label: 'Philippines', value: 18, color: 'rgb(0, 196, 154)' },
                { label: 'Vietnam', value: 22, color: 'rgb(34, 197, 94)' },
                { label: 'Turkey', value: 15, color: 'rgb(59, 130, 246)' },
                { label: 'Costa Rica', value: 12, color: 'rgb(168, 85, 247)' },
              ]}
            />
            <AnimatedChart
              type="line"
              title="Monthly Growth Trajectory"
              data={[
                { label: 'Jan', value: 120, color: 'rgb(0, 196, 154)' },
                { label: 'Feb', value: 150, color: 'rgb(0, 196, 154)' },
                { label: 'Mar', value: 190, color: 'rgb(0, 196, 154)' },
                { label: 'Apr', value: 240, color: 'rgb(0, 196, 154)' },
                { label: 'May', value: 310, color: 'rgb(0, 196, 154)' },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ===== PHASE 6: ENHANCED INQUIRY FORM SECTION ===== */}
      <section aria-label="Advanced inquiry form" className="relative px-4 sm:px-6 py-20 md:py-28 border-b border-border overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-400/10 to-emerald-400/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto">
          <SectionReveal direction="up" className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-text mb-3">Get Started Today</h3>
            <p className="text-muted text-lg">Our enhanced form makes it easy to tell us what you need.</p>
          </SectionReveal>

          <motion.div
            className="glass rounded-2xl p-8 md:p-12 border border-border"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <AnimatedFormInput
                  label="Full Name"
                  type="text"
                  value=""
                  onChange={() => {}}
                  placeholder="John Doe"
                  required={true}
                />
                <AnimatedFormInput
                  label="Company"
                  type="text"
                  value=""
                  onChange={() => {}}
                  placeholder="Your Company"
                  required={true}
                />
              </div>

              <AnimatedFormInput
                label="Email"
                type="email"
                value=""
                onChange={() => {}}
                placeholder="john@example.com"
                required={true}
                validation={(value) => ({
                  valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
                  error: 'Please enter a valid email',
                })}
              />

              <AnimatedFormInput
                label="Tell us about your project"
                value=""
                onChange={() => {}}
                placeholder="Describe what you're looking to build or improve..."
                maxLength={500}
                showCharCount={true}
              />

              <motion.button
                className="w-full py-3 rounded-lg font-bold text-lg bg-gradient-to-r from-cyan-400 to-emerald-400 text-black hover:shadow-lg hover:shadow-cyan-400/30 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Get Free Consultation
              </motion.button>
            </div>
          </motion.div>
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
            <h2 className="display-section text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-text">
              <span className="sr-only">How do I get started with TrivianEdge? </span>
              How We Get You Set Up
            </h2>
            <p className="text-muted text-lg max-w-xl mx-auto">
              From first conversation to your new team member's first day, the whole process takes about 30 days.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 reveal">
            {STEPS.map((step, idx) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 40, rotateY: -10 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                whileHover={shouldReduceMotion ? {} : { y: -4, scale: 1.02 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: shouldReduceMotion ? 0 : idx * 0.12,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="relative group"
              >
                {/* Connector line between steps */}
                {idx < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-9 left-full w-full h-px bg-gradient-to-r from-border to-transparent z-0 -translate-y-px" style={{ width: 'calc(100% - 2rem)', left: '2rem' }} />
                )}
                <span className="step-number">{step.number}</span>
                <motion.div
                  whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="w-12 h-12 rounded-2xl border border-border bg-surface flex items-center justify-center mb-5 group-hover:border-cyan-400/40 group-hover:bg-cyan-400/5 transition-colors duration-300"
                >
                  {step.icon}
                </motion.div>
                <h3 className="text-lg font-bold text-text mb-3 leading-snug">{step.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== KINETIC DIVIDER =====
          Scrolling text ticker as a section break, not a hero -- kept to a
          single compact line (not hero-scale type) so it reads as rhythm
          punctuation between "How We Get You Set Up" and "Proof" rather
          than competing with either section's own heading. Repeats real
          hero copy (the eyebrow + subheading above) rather than inventing
          new claims. aria-hidden: purely decorative restatement of content
          already announced in the hero. */}
      <section aria-hidden="true" className="section-dark py-8 md:py-10 border-y border-border overflow-hidden">
        <div className="marquee-viewport">
          <div className="marquee-track text-marquee-track">
            {[0, 1, 2].map(rep => (
              <div key={rep} className="flex items-center shrink-0">
                <span className="text-xl md:text-2xl font-bold uppercase tracking-tight whitespace-nowrap pr-3">
                  Operator. Builder. Partner.
                </span>
                <span className="text-xl md:text-2xl font-bold uppercase tracking-tight whitespace-nowrap text-holo px-10 md:px-14">
                  One partner, one contract, one point of accountability.
                </span>
              </div>
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
              <span className="sr-only">What results has TrivianEdge delivered for clients? </span>
              Real work. <span className="text-holo">Real outcomes.</span>
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Real engagements, tech and non-tech alike, stripped down to the essentials.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {CASE_STUDIES.map((study, idx) => (
              <motion.article
                key={study.client}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 32, rotateX: 10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                whileHover={shouldReduceMotion ? {} : {
                  y: -8,
                  scale: 1.02,
                  boxShadow: '0 0 24px rgba(0, 196, 154, 0.3), 0 20px 48px rgba(0, 0, 0, 0.15)'
                }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: shouldReduceMotion ? 0.01 : 0.65,
                  delay: shouldReduceMotion ? 0 : idx * 0.12,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="rounded-[2rem] border border-border bg-white dark:bg-white/5 overflow-hidden flex flex-col cursor-pointer hover:border-cyan-400/30 transition-colors duration-300"
                style={{ boxShadow: '0 8px 32px rgba(0, 196, 154, 0.06)' }}
              >
                <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600/50" />
                <div className="p-6 md:p-7 flex flex-col flex-1">
                  <span className="metric-pill">{study.sector}</span>
                  <h3 className="text-xl font-bold mb-2 text-text">{study.client}</h3>
                  <p className="text-muted text-xs mb-4 leading-relaxed">{study.challenge}</p>
                  <div className="rounded-xl bg-[#f2fbf8] dark:bg-cyan-400/10 border border-cyan-400/15 p-4 mt-auto">
                    <p className="text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400 mb-1">Outcome</p>
                    <p className="text-text/85 text-sm leading-relaxed font-medium">{study.outcome}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {TESTIMONIALS.slice(0, 2).map((item, idx) => (
              <motion.blockquote
                key={item.author + item.role}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 28, rotateY: -8 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                whileHover={shouldReduceMotion ? {} : {
                  y: -6,
                  scale: 1.02,
                  boxShadow: '0 12px 32px rgba(0, 196, 154, 0.15)'
                }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.6,
                  delay: shouldReduceMotion ? 0 : idx * 0.15,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="quote-card rounded-2xl border border-border bg-white/[0.02] p-7 md:p-9 cursor-pointer hover:border-cyan-400/30 transition-colors duration-300"
                style={{ boxShadow: '0 8px 24px rgba(0, 196, 154, 0.04)' }}
              >
                <p className="relative z-10 text-lg leading-relaxed text-text/90 mb-8 pt-2">{item.quote}</p>
                <footer className="flex items-center gap-3 border-t border-border/50 pt-5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {item.author[0]}
                  </div>
                  <div>
                    <p className="font-bold text-text text-sm">{item.author}</p>
                    <p className="text-muted text-xs">{item.role}</p>
                  </div>
                </footer>
              </motion.blockquote>
            ))}
          </div>

          <div className="text-center mt-10 reveal">
            <Link to="/proof#methodology" className="text-sm font-semibold text-cyan-600 hover:underline">
              See full case studies and how we calculate savings figures →
            </Link>
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
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-text/70 mb-4">Where your team comes from</p>
            <h2 className="display-section text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-text">
              <span className="sr-only">Where does TrivianEdge source talent from? </span>
              Great people. Everywhere.
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              We source from 6 countries selected for their talent quality, English proficiency, and timezone fit with your business. Hover any pin to explore.
            </p>
          </motion.div>

          {/* Interactive world map — neural-bg reinforces "network" both literally (talent graph) and visually (tech-forward texture) */}
          <motion.div
            className="neural-bg rounded-[3rem] border border-cyan-400/15 bg-[#f4fcf9] dark:bg-white/[0.03] p-4 md:p-8 mb-12 overflow-hidden relative"
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{ boxShadow: '0 0 60px rgba(0,196,154,0.08), inset 0 1px 0 rgba(255,255,255,0.8)' }}
          >
            <Suspense fallback={<div className="h-[400px] bg-gray-100 dark:bg-gray-900 rounded animate-pulse" />}>
              <WorldMapLazy hubs={TALENT_HUBS} onHubClick={setSelectedHub} />
            </Suspense>
          </motion.div>

          {/* Hub detail cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TALENT_HUBS.map((hub, idx) => (
              <motion.div
                key={hub.id}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 32, rotateX: 15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                whileHover={shouldReduceMotion ? {} : {
                  y: -8,
                  scale: 1.02,
                  boxShadow: '0 20px 40px rgba(0, 196, 154, 0.2)'
                }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: idx * 0.12,
                  ease: [0.16, 1, 0.3, 1]
                }}
              >
                <TalentHubCard hub={hub} index={idx} onClick={setSelectedHub} />
              </motion.div>
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
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="display-section text-3xl sm:text-5xl md:text-7xl font-bold mb-5 text-white">
                Tell us what you need.
              </h2>
              <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-6 leading-relaxed">
                Tech hiring, non-tech hiring, delivery support, market expansion.
              </p>
            </motion.div>

            <motion.a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm mb-10 premium-button-secondary !text-white border-white/20 hover:border-white/40 hover:bg-white/5 transition-colors"
            >
              Or book a 15-minute call
              <ArrowRight className="w-4 h-4" />
            </motion.a>

            <motion.div
              className="max-w-4xl mx-auto text-left mb-6 rounded-3xl bg-white dark:bg-white/5 p-6 md:p-10"
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 28, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.65, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{ boxShadow: '0 0 60px rgba(0,196,154,0.15)' }}
            >
              <InquiryForm />
            </motion.div>

            <motion.p
              className="text-white/60 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              Prefer to reach out directly?{' '}
              <a href="mailto:kevin.v@trivianedge.com" className="text-white/70 hover:text-cyan-400 underline underline-offset-4 transition-colors">Email us</a>
              {' '}or{' '}
              <a href="tel:+18883472489" className="text-white/70 hover:text-cyan-400 underline underline-offset-4 transition-colors">call +1 888-347-2489</a>.
            </motion.p>
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
  // /contact, /proof, /trust, /about, /venture-studio, /services, /services/* each render
  // their own complete page-level <SEOHead> (title, description, canonical, schema).
  // Building competing metadata for them here would duplicate structured data and
  // let the two titles drift out of sync, so they fall through to the generic
  // default below instead.
  if (pathname === '/privacy') {
    const privacyUrl = `${SEO_CONFIG.siteUrl}/privacy`;
    return {
      title: 'Privacy Protocol TrivianEdge BPO & Outsourcing Company',
      description: 'TrivianEdge Global privacy policy for BPO, outsourcing, and offshore services. Aligned with PIPEDA and GDPR principles where relevant.',
      canonical: privacyUrl,
      noIndex: false,
      structuredData: [
        buildWebPageSchema({
          name: 'Privacy Policy TrivianEdge Global',
          description: 'TrivianEdge Global privacy policy for BPO, outsourcing, and offshore services. Aligned with PIPEDA and GDPR principles where relevant.',
          url: privacyUrl,
          datePublished: LEGAL_PAGES_PUBLISHED,
          dateModified: LEGAL_PAGES_MODIFIED,
        }),
        breadcrumbSchema([
          { name: 'Home', url: SEO_CONFIG.siteUrl },
          { name: 'Privacy Policy', url: privacyUrl },
        ]),
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
        }),
        breadcrumbSchema([
          { name: 'Home', url: SEO_CONFIG.siteUrl },
          { name: 'Terms of Engagement', url: termsUrl },
        ]),
      ],
    };
  }
  if (pathname === '/cookie-policy') {
    const cookiePolicyUrl = `${SEO_CONFIG.siteUrl}/cookie-policy`;
    return {
      title: 'Cookie Policy TrivianEdge BPO & Outsourcing Services',
      description: 'The cookies, local storage, and third-party analytics tools TrivianEdge uses on trivianedge.com, and the choices you have over them.',
      canonical: cookiePolicyUrl,
      noIndex: false,
      structuredData: [
        buildWebPageSchema({
          name: 'Cookie Policy TrivianEdge Global',
          description: 'The cookies, local storage, and third-party analytics tools TrivianEdge uses on trivianedge.com, and the choices you have over them.',
          url: cookiePolicyUrl,
          datePublished: LEGAL_PAGES_PUBLISHED,
          dateModified: '2026-08-27',
        }),
        breadcrumbSchema([
          { name: 'Home', url: SEO_CONFIG.siteUrl },
          { name: 'Cookie Policy', url: cookiePolicyUrl },
        ]),
      ],
    };
  }
  if (pathname === '/') {
    // Home maximum schema richness for BPO/outsourcing dominance
    const signal = getSEOTrendSignal('home');
    const baseUrl = `${SEO_CONFIG.siteUrl}/`;
    return {
      title: signal.titleVariant,
      description: signal.descriptionVariant,
      keywords: `${ALL_KEYWORDS}, ${trendKeywords}`,
      canonical: baseUrl,
      hreflangs: {
        'en': baseUrl,
        'en-CA': baseUrl,
        'x-default': baseUrl,
      },
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
          description: 'Dedicated offshore software development teams sourced from elite global talent hubs Philippines, Sri Lanka, Vietnam, Turkey, South Africa, and Costa Rica.',
          keywords: [...KEYWORD_CLUSTERS.offshore, ...KEYWORD_CLUSTERS.softwareDev],
          serviceType: 'Software Development',
        }),
        buildServiceSchema({
          name: 'Bespoke Software Development & IT Outsourcing',
          description: 'Bespoke software development and managed IT outsourcing for startups and enterprises, built by dedicated offshore engineering teams. 30-day deployment, up to 40% cost savings.',
          keywords: [...KEYWORD_CLUSTERS.bespokeSoftware, ...KEYWORD_CLUSTERS.outsourcing],
          serviceType: 'IT Outsourcing',
        }),
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
          <ScrollProgressBar />
          <Navbar />
          <AIChatNotification />
          <AnimatePresence>
            {selectedHub && (
              <ErrorBoundary fallback={null}>
                <Suspense fallback={null}>
                  <TalentHubModal hub={selectedHub} onClose={() => setSelectedHub(null)} />
                </Suspense>
              </ErrorBoundary>
            )}
          </AnimatePresence>

          {/* min-h-dvh reserves viewport-height space for the duration of the route
              Suspense fallback (which renders nothing) so <footer> doesn't collapse
              into the gap and then violently reflow once the lazy chunk finishes
              evaluating — this was producing CLS above 1.0 on every lazy-loaded
              route under throttled mobile CPU, confirmed via a live Lighthouse run. */}
          <main id="main-content" className="min-h-dvh">
            <ErrorBoundary fallback={null}>
              <Suspense fallback={null}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Routes location={location}>
                      <Route path="/" element={<HomePage setSelectedHub={setSelectedHub} />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/proof" element={<ProofPage />} />
                      <Route path="/trust" element={<TrustPage />} />
                      <Route path="/talent/:slug" element={<TalentHubPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/blog" element={<BlogView />} />
                      <Route path="/blog/:slug" element={<BlogPostDetail />} />
                      <Route path="/privacy" element={<PrivacyPage />} />
                      <Route path="/terms" element={<TermsPage />} />
                      <Route path="/cookie-policy" element={<CookiePolicyPage />} />
                      <Route path="/services" element={<ServicesPage />} />
                      <Route path="/services/bpo" element={<BPOPage />} />
                      <Route path="/services/rpo" element={<RPOPage />} />
                      <Route path="/services/rpo/full-cycle-rpo" element={<FullCycleRPOPage />} />
                      <Route path="/services/rpo/project-based-rpo" element={<ProjectBasedRPOPage />} />
                      <Route path="/services/rpo/ai-powered-recruitment" element={<AIPoweredRecruitmentPage />} />
                      <Route path="/services/ai-development" element={<AIDevelopmentPage />} />
                      <Route path="/services/ai-development/generative-ai" element={<GenerativeAIPage />} />
                      <Route path="/services/ai-development/llm-integration" element={<LLMIntegrationPage />} />
                      <Route path="/services/ai-development/machine-learning" element={<MachineLearningPage />} />
                      <Route path="/services/ai-development/ai-automation" element={<AIAutomationPage />} />
                      <Route path="/services/ai-development/ai-chatbot-development" element={<AIChatbotDevelopmentPage />} />
                      <Route path="/services/ai-development/mlops" element={<MLOpsPage />} />
                      <Route path="/services/it-outsourcing" element={<ITOutsourcingPage />} />
                      <Route path="/compare/:slug" element={<ComparisonPage />} />
                      <Route path="/industries" element={<IndustriesIndexPage />} />
                      <Route path="/industries/:slug" element={<IndustryPage />} />
                      <Route path="/services/:service/:country" element={<ServiceCountryPage />} />
                      <Route path="/savings-calculator" element={<SavingsCalculatorPage />} />
                      <Route path="/venture-studio" element={<VentureStudioPage />} />
                      <Route path="/ai-ventures/aria" element={<AriaOSPage />} />
                      <Route path="/ai-ventures/aether-logistics" element={<AetherLogisticsPage />} />
                      <Route path="/locations/:slug" element={<CityLandingPage />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </motion.div>
                </AnimatePresence>
              </Suspense>
            </ErrorBoundary>
          </main>

          <footer className="relative bg-[#020306] text-white pt-16 md:pt-20 pb-10 px-4 md:px-6 overflow-hidden">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[420px] rounded-full bg-cyan-400/[0.06] blur-[120px]"
            />
            <div className="relative max-w-7xl mx-auto grid md:grid-cols-5 gap-8 mb-14">
              <div className="md:col-span-2">
                <div className="mb-6">
                  <Logo light onClick={() => { navigate('/'); window.scrollTo({top: 0, behavior: 'smooth'}); }} />
                </div>
                <p className="text-white/60 text-sm max-w-xs mb-8 leading-relaxed">Build offshore teams that run at full capacity. Hiring, payroll, compliance, and delivery, handled end to end.</p>
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
                <h3 className="font-bold text-white/55 mb-6 tracking-widest uppercase text-[10px]">Services</h3>
                <ul className="space-y-3">
                  <li><Link to="/services" className="inline-block text-white/55 hover:text-white hover:translate-x-1 text-sm transition-all duration-200">All Services</Link></li>
                  <li><Link to="/services/bpo" className="inline-block text-white/55 hover:text-white hover:translate-x-1 text-sm transition-all duration-200">BPO</Link></li>
                  <li><Link to="/services/rpo" className="inline-block text-white/55 hover:text-white hover:translate-x-1 text-sm transition-all duration-200">RPO</Link></li>
                  <li><Link to="/services/ai-development" className="inline-block text-white/55 hover:text-white hover:translate-x-1 text-sm transition-all duration-200">AI Development</Link></li>
                  <li><Link to="/services/it-outsourcing" className="inline-block text-white/55 hover:text-white hover:translate-x-1 text-sm transition-all duration-200">Bespoke Software Development</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-white/55 mb-6 tracking-widest uppercase text-[10px]">Platform</h3>
                <ul className="space-y-3">
                  <li><Link to="/about" className="inline-block text-white/55 hover:text-white hover:translate-x-1 text-sm transition-all duration-200">About</Link></li>
                  <li><Link to="/proof" className="inline-block text-white/55 hover:text-white hover:translate-x-1 text-sm transition-all duration-200">Proof</Link></li>
                  <li><Link to="/trust" className="inline-block text-white/55 hover:text-white hover:translate-x-1 text-sm transition-all duration-200">Trust</Link></li>
                  <li><Link to="/venture-studio" className="inline-block text-white/55 hover:text-white hover:translate-x-1 text-sm transition-all duration-200">Venture Studio</Link></li>
                  <li><Link to="/blog" className="inline-block text-white/55 hover:text-white hover:translate-x-1 text-sm transition-all duration-200">Blog</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-white/55 mb-6 tracking-widest uppercase text-[10px]">Resources</h3>
                <ul className="space-y-3">
                  <li><Link to="/contact" className="inline-block text-white/55 hover:text-white hover:translate-x-1 text-sm transition-all duration-200">Contact</Link></li>
                  <li><Link to="/savings-calculator" className="inline-block text-white/55 hover:text-white hover:translate-x-1 text-sm transition-all duration-200">Savings Calculator</Link></li>
                  <li><Link to="/proof" className="inline-block text-white/55 hover:text-white hover:translate-x-1 text-sm transition-all duration-200">Case Studies</Link></li>
                  <li><Link to="/venture-studio" className="inline-block text-white/55 hover:text-white hover:translate-x-1 text-sm transition-all duration-200">MVP Qualification</Link></li>
                  <li><Link to="/privacy" className="inline-block text-white/55 hover:text-white hover:translate-x-1 text-sm transition-all duration-200">Privacy Policy</Link></li>
                  <li><Link to="/trust" className="inline-block text-white/55 hover:text-white hover:translate-x-1 text-sm transition-all duration-200">Security & Compliance</Link></li>
                </ul>
              </div>
            </div>
            <div className="relative max-w-7xl mx-auto pt-8 pr-20 sm:pr-28 border-t border-white/8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono tracking-widest uppercase text-white/55">
              <p>© {new Date().getFullYear()} TrivianEdge Global, Canada's Offshore Operations Partner</p>
              <div className="flex gap-8">
                <Link to="/privacy" className="hover:text-white/80 transition-colors">Privacy</Link>
                <Link to="/terms" className="hover:text-white/80 transition-colors">Terms</Link>
                <Link to="/cookie-policy" className="hover:text-white/80 transition-colors">Cookies</Link>
                <button
                  type="button"
                  onClick={() => { import('./src/cookieConsent').then(({ reopenPreferences }) => reopenPreferences()); }}
                  className="hover:text-white/80 transition-colors"
                >
                  Cookie Preferences
                </button>
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
