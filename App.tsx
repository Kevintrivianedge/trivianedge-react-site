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
} from 'lucide-react';
import { Routes, Route, useLocation, useNavigate, Link } from 'react-router-dom';
import { TALENT_HUBS, STEPS, BOOKING_URL } from './constants';
import { CASE_STUDIES, TESTIMONIALS } from './constants/proof';
import { MICROSOFT_PARTNER, partnerBadgeLabel } from './constants/microsoftPartner';
import { TalentHub } from './types';
import { LanguageProvider } from './contexts/LanguageContext';
import { GeoProvider } from './contexts/GeoContext';
import { ThemeProvider } from './contexts/ThemeContext';
import SEOHead from './components/SEOHead';
import AlgorithmMonitor from './components/AlgorithmMonitor';
import InquiryForm from './components/InquiryForm';
import { HOME_FAQS, HOME_TITLE, HOME_DESCRIPTION } from './constants/home';
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
import AIChatNotification from './components/AIChatNotification';
import AnimatedFormInput from './components/AnimatedFormInput';
import SectionReveal from './components/SectionReveal';
import SkeletonLoader from './components/SkeletonLoader';
import VideoTestimonialCard from './components/VideoTestimonialCard';
import MobileGestureWrapper from './components/MobileGestureWrapper';
import MultiLayerParallax from './components/MultiLayerParallax';
import EnhancedVideoHero from './components/EnhancedVideoHero';
import HomePage from './pages/HomePage';

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
const CityLandingPage         = lazy(() => import('./components/CityLandingPage'));


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
    // Fixed title/description: rotating them daily made the snippet unstable.
    const baseUrl = `${SEO_CONFIG.siteUrl}/`;
    return {
      title: HOME_TITLE,
      description: HOME_DESCRIPTION,
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
