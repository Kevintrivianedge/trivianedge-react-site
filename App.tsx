import React, { useEffect, useState, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
  Phone,
  MapPin,
} from 'lucide-react';
import { Routes, Route, useLocation, useNavigate, Link, Navigate } from 'react-router-dom';
import { NAV_LINKS, WHY_US, STEPS, BLOG_POSTS, TALENT_HUBS, SERVICES } from './constants';
import { TalentHub } from './types';
import { LanguageProvider } from './contexts/LanguageContext';
import { GeoProvider } from './contexts/GeoContext';
import Preloader from './components/Preloader';
import { ThemeProvider } from './contexts/ThemeContext';
import { TalentHubModal } from './components/TalentHubModal';
import SEOHead from './components/SEOHead';
import AlgorithmMonitor from './components/AlgorithmMonitor';
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
import ProcessTimeline from './components/ProcessTimeline';
import TalentHubCard from './components/TalentHubCard';
import AriaSection from './components/AriaSection';
import ScrollToTop from './components/ScrollToTop';
import BlogView from './components/BlogView';
import BlogPostDetail from './components/BlogPostDetail';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import MarqueeTicker from './components/MarqueeTicker';
import WorldMapSVG from './components/WorldMapSVG';
import CountUpStat from './components/CountUpStat';

// Lazy-load heavy below-fold components for better LCP
const ChatSidebar = lazy(() => import('./components/ChatSidebar'));

// Rotating hero phrases
const HERO_PHRASES = [
  "Your dream team.\nReady in 30 days.",
  "Global talent.\nLocal results.",
  "Your business.\nAlways on.",
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

// Home page component 9-act narrative arc
const HomePage: React.FC<{ setSelectedHub: (hub: TalentHub | null) => void }> = ({ setSelectedHub }) => {
  const navigate = useNavigate();
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [quizOption, setQuizOption] = useState<number | null>(null);

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
        className="relative min-h-[95vh] flex items-center pt-24 px-4 sm:px-6 overflow-hidden"
      >
        {/* Background atmosphere */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />
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

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="max-w-4xl">
            {/* Trusted badge */}
            <div className="reveal inline-flex items-center gap-3 px-4 py-2 rounded-full border border-border bg-surface backdrop-blur-md text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-8 text-text">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Canada's #1 BPO and Offshore Outsourcing Partner
            </div>

            {/* Kinetic h1 */}
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight mb-6 leading-[1.05] text-text min-h-[2.3em] md:min-h-[1.8em]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={phraseIndex}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
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

            <p className="reveal text-muted text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
              We hire great people around the world so you can focus on running your business. With talent across 6 countries, your team is up and running in 30 days, typically saving up to 40% compared to local hiring.
            </p>

            <div className="reveal flex flex-col sm:flex-row items-start gap-4 mb-20">
              <a
                href="#contact"
                onClick={e => { e.preventDefault(); scrollTo('contact'); }}
                className="w-full sm:w-auto px-10 py-5 bg-btn-bg text-btn-text rounded-2xl font-bold text-lg hover:bg-cyan-400 hover:text-white transition-all flex items-center justify-center gap-3 shadow-2xl shadow-surface group btn-magnetic"
              >
                Build Your Team
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </a>
              <a
                href="#how-it-works"
                onClick={e => { e.preventDefault(); scrollTo('how-it-works'); }}
                className="w-full sm:w-auto px-10 py-5 glass text-text rounded-2xl font-bold text-lg hover:bg-surface transition-all flex items-center justify-center gap-2 btn-magnetic"
              >
                See How It Works
                <ChevronRight className="w-5 h-5" />
              </a>
            </div>

            {/* Animated stats row */}
            <div className="reveal pt-8 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              <CountUpStat end={6}  suffix="" label="Countries We Source From" />
              <CountUpStat end={40} suffix="%" label="Average Cost Savings" />
              <CountUpStat end={30} suffix=" days" label="Average Time to Start" />
              <CountUpStat end={24} suffix="/7" label="Operations Coverage" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== ACT 2: TRUST MARQUEE ===== */}
      <MarqueeTicker items={TICKER_ITEMS} speed={40} />

      {/* ===== ACT 3: PAIN / ANALOGY ===== */}
      <section
        id="problem"
        aria-label="The Challenge"
        className="py-20 md:py-32 px-4 md:px-6"
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          {/* Left: analogy text */}
          <div className="lg:w-1/2 reveal">
            <div className="text-cyan-400 font-bold tracking-widest text-xs uppercase mb-4">
              Sound familiar?
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight text-text">
              Your business stops<br />
              <span className="text-rose-400">when your team does.</span>
            </h2>

            <div className="glass p-8 rounded-3xl border-border mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 blur-3xl pointer-events-none" />
              <p className="text-muted text-base md:text-lg leading-relaxed relative z-10">
                Imagine you own a restaurant. Your kitchen only opens at 9am and closes at 5pm. Customers want to eat at 2am.
                <br /><br />
                That is what your business looks like when you only have people in one time zone.
                <br /><br />
                <strong className="text-text">TrivianEdge builds the team that keeps your restaurant open.</strong>
              </p>
            </div>

            <div className="space-y-4">
              {[
                'Work stops when your local team logs off',
                'Hiring great people takes months and costs a fortune',
                'Growing into new markets feels impossible to manage',
              ].map(item => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20 flex-shrink-0">
                    <X className="w-3 h-3 text-rose-500" />
                  </div>
                  <span className="text-muted font-medium text-sm">{item}</span>
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
                  Your team. Always online. Always delivering.
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
          </div>
        </div>
      </section>

      {/* ===== ACT 4: HOW IT WORKS ===== */}
      <section
        id="how-it-works"
        aria-label="How It Works"
        className="py-20 md:py-32 px-4 md:px-6 bg-surface"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-400 text-[10px] font-bold uppercase tracking-widest mb-6">
              <Zap className="w-3 h-3" />
              Simple 4-Step Process
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-4 text-text">How We Get You Set Up</h2>
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
        className="py-20 md:py-32 px-4 md:px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-6">
              <CheckCircle2 className="w-3 h-3" />
              Real Companies. Real Results.
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-4 text-text">
              We don't measure success by headcount.
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              We measure it by revenue generated, problems solved, and markets entered. Here is the proof.
            </p>
          </div>

          {/* Client cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_US.filter(item => item.url).map((item, idx) => (
              <div
                key={idx}
                className="reveal glass p-8 rounded-[2rem] border-border hover:border-cyan-500/30 transition-all duration-300 group hover:-translate-y-2 relative overflow-hidden flex flex-col"
                style={{ transitionDelay: `${idx * 80}ms` }}
              >
                <div className="absolute top-0 right-0 w-28 h-28 bg-cyan-500/5 blur-3xl group-hover:bg-cyan-500/10 transition-colors pointer-events-none" />
                <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center mb-5 group-hover:scale-110 group-hover:border-cyan-500/30 transition-all duration-300">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold mb-3 group-hover:text-cyan-400 transition-colors text-text">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed flex-grow">{item.description}</p>
                {item.result && (
                  <p className="mt-4 text-xs font-bold text-cyan-400 uppercase tracking-widest">
                    ↗ {item.result}
                  </p>
                )}
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-muted hover:text-cyan-400 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {item.url.replace(/^https?:\/\/(?:www\.)?/, '')}
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Operator callout cards */}
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            {WHY_US.filter(item => !item.url).map((item, idx) => (
              <div
                key={idx}
                className="reveal glass p-8 rounded-[2rem] border-border flex items-start gap-6 group hover:border-cyan-500/20 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-text group-hover:text-cyan-400 transition-colors">{item.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ACT 6: SERVICES BENTO GRID ===== */}
      <section
        id="solutions"
        aria-label="Our Services"
        className="py-20 md:py-32 px-4 md:px-6 bg-surface"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-400 text-[10px] font-bold uppercase tracking-widest mb-6">
              <Layers className="w-3 h-3" />
              What We Do
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-4 text-text">
              Everything you need to grow,<br />without the growing pains.
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Whether you need people, technology, or a way into a new market, we have done it before and we can do it for you.
            </p>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SERVICES.map((service, idx) => {
              const isWide = idx === 0 || idx === 3;
              const isFull = idx === 4;
              return (
                <div
                  key={idx}
                  className={[
                    'reveal glass p-10 rounded-[2.5rem] border-border hover:border-cyan-500/30',
                    'transition-all duration-500 group relative overflow-hidden service-card-glow flex flex-col',
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

                  <div className={`grid gap-6 pt-6 border-t border-border mt-auto ${isFull ? 'md:grid-cols-3' : isWide ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
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

      {/* ===== ACT 7: TALENT HUBS + WORLD MAP ===== */}
      <section
        id="talent-hubs"
        aria-label="Global Talent Hubs"
        className="py-20 md:py-32 px-4 md:px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-6">
              <Globe2 className="w-3 h-3" />
              Where Your Team Comes From
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-4 text-text">Great people. Everywhere.</h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              We source from 6 countries selected for their talent quality, English proficiency, and timezone fit with your business. Hover any pin to explore.
            </p>
          </div>

          {/* Interactive world map */}
          <div className="reveal glass rounded-[3rem] border-border p-4 md:p-8 mb-16 overflow-hidden">
            <WorldMapSVG hubs={TALENT_HUBS} onHubClick={setSelectedHub} />
          </div>

          {/* Hub detail cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TALENT_HUBS.map((hub, idx) => (
              <TalentHubCard key={hub.id} hub={hub} index={idx} onClick={setSelectedHub} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== ACT 8: ARIA ===== */}
      <AriaSection />

      {/* ===== "WHAT DO YOU NEED?" QUIZ ===== */}
      <section aria-label="What Do You Need" className="py-20 md:py-24 px-4 md:px-6 bg-surface">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-text">
              What do you need right now?
            </h2>
            <p className="text-muted text-lg">
              Tell us what you are working on and we will show you exactly how we help.
            </p>
          </div>

          <div className="reveal">
            {/* Option selector */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              {[
                { label: 'Grow my team', icon: '👥' },
                { label: 'Enter a new market', icon: '🌏' },
                { label: 'Fix my tech or back office', icon: '⚙️' },
              ].map(({ label, icon }, i) => (
                <button
                  key={i}
                  onClick={() => setQuizOption(quizOption === i ? null : i)}
                  className={[
                    'flex items-center gap-3 px-6 py-4 rounded-2xl border font-bold text-sm transition-all duration-300',
                    quizOption === i
                      ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400'
                      : 'border-border glass text-muted hover:border-cyan-500/20 hover:text-text',
                  ].join(' ')}
                >
                  <span className="text-xl">{icon}</span>
                  {label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {quizOption !== null && (
                <motion.div
                  key={quizOption}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="glass p-8 md:p-10 rounded-[2rem] border-cyan-500/20"
                >
                  {quizOption === 0 && (
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-text mb-3">We will find you the perfect person.</h3>
                        <p className="text-muted leading-relaxed mb-4">
                          Tell us the role, the skills you need, and the time zone that works best for you. We search our global network across 6 countries and have you interviewing top candidates within a week.
                        </p>
                        <ul className="space-y-2 mb-6">
                          {[
                            'Engineers, designers, ops leads, sales reps, and more',
                            'Vetted and shortlisted within 5 business days',
                            'Onboarded and working within 30 days',
                          ].map(item => (
                            <li key={item} className="flex items-center gap-2 text-sm text-muted">
                              <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                        <a
                          href="#contact"
                          onClick={e => { e.preventDefault(); scrollTo('contact'); }}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-btn-bg text-btn-text rounded-xl font-bold text-sm hover:bg-cyan-400 hover:text-white transition-all"
                        >
                          Start the conversation <ArrowRight className="w-4 h-4" />
                        </a>
                      </div>
                      <div className="grid grid-cols-2 gap-3 flex-shrink-0">
                        {TALENT_HUBS.slice(0, 4).map(hub => (
                          <div key={hub.id} className="glass p-3 rounded-xl border-border text-center min-w-[100px]">
                            <div className="text-2xl mb-1">{hub.flag}</div>
                            <div className="text-xs font-bold text-text">{hub.country}</div>
                            <div className="text-[10px] text-muted mt-0.5 leading-tight">{hub.specialty.split(' ').slice(0, 2).join(' ')}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {quizOption === 1 && (
                    <div>
                      <h3 className="text-2xl font-bold text-text mb-3">We have done market entry before.</h3>
                      <p className="text-muted leading-relaxed mb-4">
                        We helped CyouMedia launch in Sri Lanka and Hub-Flx expand into the UAE and GCC. We do not just give advice. We build the strategy and execute it alongside you.
                      </p>
                      <ul className="space-y-2 mb-6">
                        {[
                          'Full sales strategy design and execution',
                          'Local partner and customer sourcing',
                          'Market research and product fit consulting',
                        ].map(item => (
                          <li key={item} className="flex items-center gap-2 text-sm text-muted">
                            <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <a
                        href="#contact"
                        onClick={e => { e.preventDefault(); scrollTo('contact'); }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-btn-bg text-btn-text rounded-xl font-bold text-sm hover:bg-cyan-400 hover:text-white transition-all"
                      >
                        Explore your market <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                  {quizOption === 2 && (
                    <div>
                      <h3 className="text-2xl font-bold text-text mb-3">We keep your business running smoothly behind the scenes.</h3>
                      <p className="text-muted leading-relaxed mb-4">
                        From managed cloud infrastructure and cybersecurity to payroll, accounting, and back-office admin, we handle the operations that keep your business running so you can focus on growth.
                      </p>
                      <ul className="space-y-2 mb-6">
                        {[
                          '24/7 IT monitoring and cloud management',
                          'Payroll, accounting, and virtual CFO services',
                          'Compliance support and back-office outsourcing',
                        ].map(item => (
                          <li key={item} className="flex items-center gap-2 text-sm text-muted">
                            <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <a
                        href="#contact"
                        onClick={e => { e.preventDefault(); scrollTo('contact'); }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-btn-bg text-btn-text rounded-xl font-bold text-sm hover:bg-cyan-400 hover:text-white transition-all"
                      >
                        Talk to our team <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ===== BPO FAQ SEO targeted featured snippets ===== */}
      <section id="faq" aria-label="BPO and Outsourcing FAQ" className="py-20 md:py-24 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 reveal">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-6">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Common Questions
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-text mb-4">
              Everything you need to know about <span className="text-holo">BPO and Offshore Outsourcing</span>
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Plain answers to the questions we hear most often.
            </p>
          </div>
          <div className="space-y-4 reveal">
            {[
              {
                q: 'What is BPO (Business Process Outsourcing)?',
                a: 'Business Process Outsourcing means hiring a company to handle specific parts of your business on your behalf. Instead of building an in-house team for accounting, IT support, customer service, or software development, you partner with a specialist like TrivianEdge who manages those functions for you, usually at a much lower cost and faster pace.',
              },
              {
                q: 'Why choose TrivianEdge for offshore software development?',
                a: 'TrivianEdge is a Canada-based BPO and offshore development company with a proven 30-day deployment model. We source skilled software developers, DevOps engineers, and AI specialists from our global talent hubs, delivering up to 40% cost savings compared to local hiring, with no compromise on quality.',
              },
              {
                q: 'How much can I save with offshore outsourcing?',
                a: 'Most companies save between 40 and 60% on talent costs by partnering with TrivianEdge. Our global talent hubs across the Philippines, Sri Lanka, Vietnam, Turkey, and Eastern Europe provide highly skilled professionals at a fraction of North American rates.',
              },
              {
                q: 'What software development services does TrivianEdge provide?',
                a: 'We provide offshore software development for full-stack development, AI and ML engineering, cloud and DevOps, mobile app development, UI/UX design, cybersecurity, and data engineering. All delivered as dedicated offshore teams built to match your tech stack.',
              },
              {
                q: 'How fast can TrivianEdge deploy an offshore team?',
                a: 'Our standard process takes 30 days from your first conversation to an active, integrated team. This includes discovery, sourcing, vetting, onboarding, and integration into your workflows, which is significantly faster than traditional hiring.',
              },
              {
                q: 'Is TrivianEdge a Canadian BPO company?',
                a: 'Yes. TrivianEdge is headquartered in Toronto, Canada and operates as a Canada-based global BPO and outsourcing company. We manage offshore talent deployment, IT outsourcing, and managed services for clients across North America, the UK, Australia, and the Middle East.',
              },
            ].map((item, i) => (
              <details key={i} className="glass border-border rounded-2xl group overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer text-text font-bold text-base md:text-lg list-none select-none hover:text-cyan-400 transition-colors">
                  <span>{item.q}</span>
                  <span className="ml-4 text-cyan-400 text-2xl font-light group-open:rotate-45 transition-transform duration-300 flex-shrink-0">+</span>
                </summary>
                <div className="px-6 pb-6 text-muted leading-relaxed border-t border-border pt-4 text-sm md:text-base">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ACT 9: CTA + CONTACT ===== */}
      <section id="contact" aria-label="Contact Us" className="py-20 md:py-32 px-4 md:px-6">
        <div className="max-w-7xl mx-auto reveal">
          <div className="glass p-12 md:p-24 rounded-[4rem] border-border text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-8 text-text">
                Your next team member<br />starts in 30 days.
              </h2>
              <p className="text-muted text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
                Tell us what you need. We find the right person, handle the onboarding, and keep everything running from day one to long-term.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto text-left">
                <div className="p-8 rounded-3xl bg-surface border border-border hover:border-cyan-500/30 transition-colors group tilt-card">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <MapPin className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-muted mb-2">Global HQ</h4>
                  <p className="text-text font-medium leading-relaxed">37 Wiggens Ct,<br />Toronto ON M1B 1K3,<br />Canada</p>
                </div>

                <a href="tel:+18882028513" className="p-8 rounded-3xl bg-surface border border-border hover:border-cyan-500/30 transition-colors group block tilt-card">
                  <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <ChevronRight className="w-6 h-6 text-violet-400 sr-only" aria-hidden="true" />
                    <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-muted mb-2">Direct Line</h4>
                  <p className="text-text font-medium group-hover:text-cyan-400 transition-colors">+1 888 202 8513</p>
                </a>

                <a href="mailto:info@trivianedge.com" className="p-8 rounded-3xl bg-surface border border-border hover:border-cyan-500/30 transition-colors group block tilt-card">
                  <div className="w-12 h-12 rounded-full bg-magenta-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6 text-magenta-400" />
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-muted mb-2">Email Us</h4>
                  <p className="text-text font-medium group-hover:text-cyan-400 transition-colors">info@trivianedge.com</p>
                </a>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <a href="mailto:info@trivianedge.com" className="px-12 py-6 bg-btn-bg text-btn-text rounded-2xl font-bold text-xl hover:bg-cyan-400 hover:text-white transition-all shadow-2xl shadow-cyan-500/10 flex items-center justify-center gap-2">
                  <Mail className="w-5 h-5" />
                  Email Our Team
                </a>
                <a href="tel:+18882028513" className="px-12 py-6 glass text-text rounded-2xl font-bold text-xl hover:bg-surface transition-all flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  Call Now
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

    const timer = setTimeout(() => {
      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
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

  const seoProps = getSEOProps(location.pathname);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <GeoProvider>
        <SEOHead {...seoProps} />
        <AlgorithmMonitor signals={signals} recommendations={recommendations} />
        <div className="bg-background min-h-screen text-text overflow-x-hidden selection:bg-cyan-500/30 transition-colors duration-300">
          <Preloader />
          <Navbar />
          <ErrorBoundary fallback={null}>
            <Suspense fallback={null}>
              <ChatSidebar />
            </Suspense>
          </ErrorBoundary>
          
          <AnimatePresence>
            {selectedHub && (
              <TalentHubModal hub={selectedHub} onClose={() => setSelectedHub(null)} />
            )}
          </AnimatePresence>

          <main id="main-content">
            <Routes>
              <Route path="/" element={<HomePage setSelectedHub={setSelectedHub} />} />
              <Route path="/blog" element={<BlogView />} />
              <Route path="/blog/:slug" element={<BlogPostDetail />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
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
                    className="p-3 glass rounded-xl hover:text-cyan-400 transition-all duration-300 border-border hover:scale-110 hover:shadow-[0_0_20px_-5px_rgba(34,211,238,0.6)] hover:border-cyan-400/30 text-text"
                  >
                    <Linkedin />
                  </a>
                  <a 
                    href="https://x.com/trivianedge"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TrivianEdge on X (Twitter)"
                    className="p-3 glass rounded-xl hover:text-cyan-400 transition-all duration-300 border-border hover:scale-110 hover:shadow-[0_0_20px_-5px_rgba(34,211,238,0.6)] hover:border-cyan-400/30 text-text"
                  >
                    <Twitter />
                  </a>
                  <a 
                    href="mailto:info@trivianedge.com" 
                    aria-label="Email TrivianEdge"
                    className="p-3 glass rounded-xl hover:text-cyan-400 transition-all duration-300 border-border hover:scale-110 hover:shadow-[0_0_20px_-5px_rgba(34,211,238,0.6)] hover:border-cyan-400/30 text-text"
                  >
                    <Mail />
                  </a>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-text mb-8 tracking-widest uppercase text-xs">Platform</h4>
                <ul className="space-y-6 text-muted font-medium">
                  <li><a href="/#solutions" onClick={(e) => { e.preventDefault(); scrollToSection('solutions'); }} className="hover:text-text transition-colors">Our Services</a></li>
                  <li><a href="/#talent-hubs" onClick={(e) => { e.preventDefault(); scrollToSection('talent-hubs'); }} className="hover:text-text transition-colors">Talent Hubs</a></li>
                  <li><a href="/#how-it-works" onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }} className="hover:text-text transition-colors">How It Works</a></li>
                  <li><a href="/#aria" onClick={(e) => { e.preventDefault(); scrollToSection('aria'); }} className="hover:text-text transition-colors">Trivian Aria</a></li>
                  <li><Link to="/blog" className="hover:text-text transition-colors">Blog</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-text mb-8 tracking-widest uppercase text-xs">Resources</h4>
                <ul className="space-y-6 text-muted font-medium">
                  <li><a href="/#how-it-works" onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }} className="hover:text-text transition-colors">How It Works</a></li>
                  <li><a href="/#talent-hubs" onClick={(e) => { e.preventDefault(); scrollToSection('talent-hubs'); }} className="hover:text-text transition-colors">Global Hubs</a></li>
                  <li><Link to="/privacy" className="hover:text-text transition-colors">Privacy Policy</Link></li>
                  <li><a href="/#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }} className="hover:text-text transition-colors">Contact Us</a></li>
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
