import React, { useEffect, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  ArrowRight, 
  ChevronRight,
  Globe2,
  Cpu,
  Zap, 
  ShieldCheck,
  Mail,
  Linkedin,
  Twitter,
  ExternalLink,
  Activity,
  Layers,
  Search,
  X,
  Info,
  CheckCircle2,
  TrendingUp,
  Phone,
  MapPin,
  Users,
  BarChart4,
} from 'lucide-react';
import { Routes, Route, useLocation, useNavigate, Link, Navigate } from 'react-router-dom';
import { NAV_LINKS, WHY_US, ROLES, STEPS, BLOG_POSTS, TALENT_HUBS, SERVICES } from './constants';
import { TalentHub } from './types';
import { useState } from 'react';
import GreetingBanner from './components/GreetingBanner';
import { LanguageProvider } from './contexts/LanguageContext';
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
import TalentAdvisor from './components/TalentAdvisor';
import AriaSection from './components/AriaSection';
import ScrollToTop from './components/ScrollToTop';
import BlogView from './components/BlogView';
import BlogPostDetail from './components/BlogPostDetail';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';

// Lazy-load heavy below-fold components for better LCP
const ChatSidebar = lazy(() => import('./components/ChatSidebar'));

// Home page component — all the home sections
const HomePage: React.FC<{ setSelectedHub: (hub: TalentHub | null) => void }> = ({ setSelectedHub }) => {
  const navigate = useNavigate();

  return (
    <>
      <section aria-label="Hero" className="relative min-h-[90vh] flex items-center pt-24 px-4 sm:px-6 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 blur-[120px] rounded-full" />
        <div className="bg-grid absolute inset-0 opacity-20" />
        <div className="max-w-7xl mx-auto w-full relative z-10 text-center md:text-left">
          
          <GreetingBanner />

          <div className="reveal inline-flex items-center gap-3 px-4 py-2 rounded-full border border-border bg-surface backdrop-blur-md text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-6 text-text">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Canada's #1 BPO &amp; Offshore Outsourcing Partner
          </div>
          <div className="reveal flex flex-wrap gap-2 mb-6">
            {['BPO', 'Offshore Development', 'IT Outsourcing', 'Remote Teams', 'Software Dev'].map(tag => (
              <span key={tag} className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">{tag}</span>
            ))}
          </div>
          <h1 className="reveal text-4xl sm:text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-[1] text-text cursor-pointer">
            <span className="glitch-text inline-block hover:text-cyan-400 transition-colors" data-text="Global Execution.">Global Execution.</span> <br className="hidden md:block" />
            <span className="glitch-text inline-block bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600" data-text="At Scale.">At Scale.</span>
          </h1>
          <p className="reveal text-muted text-lg md:text-2xl max-w-3xl mb-12 leading-relaxed">
            Canada's leading <strong className="text-text">BPO and offshore outsourcing company</strong>. We deploy elite global talent, custom software development teams, and managed IT services across 6 time zones — with a proven 30-day deployment model and up to 40% cost savings.
          </p>
          <div className="reveal flex flex-col sm:flex-row items-center gap-6">
            <a href="#contact" onClick={(e) => { e.preventDefault(); const el = document.getElementById('contact'); el?.scrollIntoView({behavior: 'smooth'}); }} className="w-full sm:w-auto px-10 py-5 bg-btn-bg text-btn-text rounded-2xl font-bold text-lg hover:bg-cyan-400 hover:text-white transition-all flex items-center justify-center gap-3 shadow-2xl shadow-surface group">
              Build Your Team
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </a>
            <a href="#talent-hubs" onClick={(e) => { e.preventDefault(); const el = document.getElementById('talent-hubs'); el?.scrollIntoView({behavior: 'smooth'}); }} className="w-full sm:w-auto px-10 py-5 glass text-text rounded-2xl font-bold text-lg hover:bg-surface transition-all flex items-center justify-center">
              Explore Talent Hubs
            </a>
          </div>
          <div className="mt-20 pt-12 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 opacity-70 hover:opacity-100 transition-opacity">
            <div className="flex flex-col gap-1"><span className="text-2xl font-bold text-text">4+</span><span className="text-[10px] tracking-widest text-muted uppercase font-bold">Active Clients</span></div>
            <div className="flex flex-col gap-1"><span className="text-2xl font-bold text-text">6</span><span className="text-[10px] tracking-widest text-muted uppercase font-bold">Time Zones</span></div>
            <div className="flex flex-col gap-1"><span className="text-2xl font-bold text-text">40%</span><span className="text-[10px] tracking-widest text-muted uppercase font-bold">Cost Savings</span></div>
            <div className="flex flex-col gap-1"><span className="text-2xl font-bold text-text">24/7</span><span className="text-[10px] tracking-widest text-muted uppercase font-bold">BPO Coverage</span></div>
          </div>
        </div>
      </section>

      <section id="problem" aria-label="The Challenge" className="py-16 md:py-32 px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-center">
          <div className="lg:w-1/2 reveal">
            <div className="text-cyan-400 font-bold tracking-widest text-xs uppercase mb-4">The Challenge</div>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight text-text">Operations & HR speak <br /><span className="text-rose-500/80">different languages.</span></h2>
            <p className="text-muted text-lg md:text-xl leading-relaxed mb-8">HR hires for resumes; Operations delivers for targets. This gap is where scale dies. TrivianEdge fills this void by translating business execution needs into precision-sourced global talent.</p>
            <div className="space-y-4">
              {["Traditional recruiters lack operational context", "Execution failure due to misaligned expectations", "Global scaling often leads to 'Operational Chaos'"].map(item => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20"><X className="w-3 h-3 text-rose-500" /></div>
                  <span className="text-muted font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 reveal">
            <div className="glass p-10 rounded-[3rem] border-border relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl" />
              <div className="flex flex-col gap-12 relative z-10">
                <div className="flex justify-between items-center px-4">
                  <div className="text-center group">
                    <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mb-3 group-hover:border-cyan-400/50 transition-colors"><Globe2 className="w-8 h-8 text-muted group-hover:text-cyan-400" /></div>
                    <span className="text-xs font-bold text-muted uppercase">Talent</span>
                  </div>
                  <div className="flex-1 h-px border-t border-dashed border-border mx-4" />
                  <div className="text-center group">
                    <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mb-3 group-hover:border-violet-400/50 transition-colors"><Activity className="w-8 h-8 text-muted group-hover:text-violet-400" /></div>
                    <span className="text-xs font-bold text-muted uppercase">Execution</span>
                  </div>
                </div>
                <div className="bg-background/40 p-6 rounded-2xl border border-cyan-500/20 text-center">
                  <p className="text-cyan-400 font-mono text-sm">TrivianEdge Intelligence Bridge</p>
                  <div className="h-2 bg-surface rounded-full mt-4 overflow-hidden"><div className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 w-[75%] animate-pulse" /></div>
                  <p className="text-[10px] text-muted mt-2 uppercase tracking-widest">Optimizing Synchronous Workflows</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY US SECTION */}
      <section id="why-us" aria-label="Why TrivianEdge" className="py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-6">
               <CheckCircle2 className="w-3 h-3" />
               Client Success Stories
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-text">Proven Results. Real Clients.</h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              We don't measure success by headcount. We measure it by revenue generated, processes fixed, and markets entered. Here's proof.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {WHY_US.map((item, idx) => (
              <div 
                key={idx} 
                className="reveal glass p-8 rounded-[2rem] border-border hover:border-cyan-500/30 transition-all duration-300 group hover:-translate-y-2 relative overflow-hidden flex flex-col"
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                 <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl group-hover:bg-cyan-500/10 transition-colors" />
                <div className="w-14 h-14 rounded-2xl bg-surface border border-border flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-cyan-500/30 transition-all duration-300 shadow-lg shadow-black/20">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-cyan-400 transition-colors text-text">{item.title}</h3>
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
                    className="mt-4 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-muted hover:text-cyan-400 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {item.url.replace(/^https?:\/\/(?:www\.)?/, '')}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE OFFERINGS SECTION */}
      <section id="solutions" aria-label="Core Services" className="py-16 md:py-32 px-4 md:px-6 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-400 text-[10px] font-bold uppercase tracking-widest mb-6">
              <Zap className="w-3 h-3" />
              Execution Excellence
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-text">Core Offerings</h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">Our multi-disciplinary approach combines technical, operational, and financial strategies to accelerate global growth.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            {SERVICES.map((service, idx) => (
              <div 
                key={idx} 
                className={`reveal h-full ${idx === SERVICES.length - 1 ? 'md:col-span-2 md:w-2/3 md:mx-auto' : ''}`}
                style={{ transitionDelay: `${idx * 200}ms` }}
              >
                <div className="h-full w-full glass p-10 md:p-12 rounded-[3rem] border-border transition-all group relative service-card-glow flex flex-col">
                  <div className="mb-8 p-5 rounded-2xl bg-surface border border-border w-fit transition-all duration-500 ease-out group-hover:bg-cyan-500/10 group-hover:border-cyan-400/30 group-hover:scale-105 group-hover:shadow-[0_0_30px_-5px_rgba(34,211,238,0.3)]">
                     <div className="transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                      {service.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-6 group-hover:text-cyan-400 transition-colors duration-300 text-text">{service.title}</h3>
                  <p className="text-muted text-sm md:text-base leading-relaxed mb-8 flex-grow">{service.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-border mt-auto">
                      <div>
                          <h5 className="text-[10px] font-bold uppercase tracking-widest text-muted mb-4 flex items-center gap-2">
                              <Layers className="w-3 h-3" /> Key Capabilities
                          </h5>
                          <ul className="space-y-2">
                              {service.features.map((feature, i) => (
                                  <li key={i} className="text-xs text-muted flex items-start gap-2">
                                      <span className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                                      {feature}
                                  </li>
                              ))}
                          </ul>
                      </div>
                      <div>
                          <h5 className="text-[10px] font-bold uppercase tracking-widest text-muted mb-4 flex items-center gap-2">
                              <TrendingUp className="w-3 h-3" /> Business Outcomes
                          </h5>
                          <ul className="space-y-2">
                              {service.outcomes.map((outcome, i) => (
                                  <li key={i} className="text-xs text-muted flex items-start gap-2">
                                      <CheckCircle2 className="w-3 h-3 text-violet-400 mt-0.5 flex-shrink-0" />
                                      {outcome}
                                  </li>
                              ))}
                          </ul>
                      </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-8">
                      {service.tags.map(tag => (
                          <span key={tag} className="px-3 py-1 rounded-full bg-surface border border-border text-[10px] font-bold uppercase tracking-widest text-muted group-hover:border-cyan-500/20 group-hover:text-cyan-400/80 transition-colors">
                              {tag}
                          </span>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TALENT HUBS SECTION */}
      <section id="talent-hubs" aria-label="Global Talent Hubs" className="py-16 md:py-32 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-6">
              <Globe2 className="w-3 h-3" />
              Strategic Sourcing Ecosystem
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-text">Global Talent Hubs</h2>
            <p className="text-muted text-lg max-w-2xl mx-auto mb-10">
              We source the top 1% of tech and operational talent from high-performance regions. Each hub is selected for its specialized skills, robust infrastructure, and communication alignment.
            </p>
            
            <div className="glass p-6 rounded-2xl border-border inline-flex items-center gap-3 animate-pulse">
              <Search className="w-5 h-5 text-cyan-400" />
              <p className="text-xs font-mono text-muted uppercase tracking-widest">
                Protocol: Exploring daily for emerging talent hubs to maximize partner advantage.
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {TALENT_HUBS.map((hub, idx) => (
              <TalentHubCard key={hub.id} hub={hub} index={idx} onClick={setSelectedHub} />
            ))}
          </div>

          <div className="reveal glass p-12 rounded-[3rem] border-border text-center relative overflow-hidden bg-gradient-to-r from-cyan-500/5 to-violet-500/5">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4 text-text">Active Partnership Program</h3>
              <p className="text-muted max-w-2xl mx-auto mb-8">
                We are always looking for the next operational challenge. Our intelligence team continuously evaluates new markets, partners, and regions to ensure our clients stay ahead of the curve.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {["Infrastructure Audit", "Communication Benchmarking", "Cultural Alignment", "Political Stability Scan"].map(item => (
                  <div key={item} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted bg-surface px-4 py-2 rounded-full border border-border">
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="roles" aria-label="Elite Roles" className="py-16 md:py-32 px-4 md:px-6 relative overflow-hidden bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 reveal">
            <div className="max-w-xl">
              <div className="text-cyan-400 font-bold tracking-widest text-xs uppercase mb-4">Specializations</div>
              <h2 className="text-4xl md:text-6xl font-bold text-text">Elite Roles Sourced Globally</h2>
            </div>
            <div className="grid lg:grid-cols-2 gap-12">
              {ROLES.map((cat, idx) => (
                <div key={idx} className="reveal">
                  <div className={`h-full glass p-10 md:p-14 rounded-[3rem] border-border relative overflow-hidden group`}>
                    <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${cat.gradient.includes('cyan') ? 'from-cyan-400 to-blue-500' : 'from-violet-500 to-magenta-500'}`} />
                    <h3 className="text-3xl font-bold mb-10 text-text">{cat.title}</h3>
                    <div className="space-y-6">
                      {cat.roles.map(role => (
                        <div key={role} className="flex items-center justify-between group/role cursor-default">
                          <span className="text-lg text-muted group-hover/role:text-text transition-colors">{role}</span>
                          <ChevronRight className="w-5 h-5 text-muted group-hover/role:text-cyan-400 transition-all" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="process" aria-label="Deployment Protocol" className="py-16 md:py-32 px-4 md:px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 reveal">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">The Deployment Protocol</h2>
            <p className="text-gray-500">Four phases of precision-engineered growth.</p>
          </div>
          <ProcessTimeline />
        </div>
      </section>

      <section aria-label="Talent Advisor" className="py-16 md:py-32 px-4 md:px-6"><div className="max-w-5xl mx-auto"><TalentAdvisor /></div></section>

      <section id="future" aria-label="Future Vision" className="py-16 md:py-32 px-4 md:px-6 relative text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-violet-600/5 blur-[120px] rounded-full -z-10" />
        <div className="max-w-4xl mx-auto reveal">
          <Layers className="w-12 h-12 text-cyan-400 mx-auto mb-10 opacity-50" />
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-10 tracking-tight leading-[1.1] text-text">Stop Hiring Remote Workers. <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">Start Deploying</span> <br />Global Execution.</h2>
          <p className="text-muted text-xl leading-relaxed">The competitive advantage isn't remote work. It's operational continuity across time zones — teams that don't stop when you do. TrivianEdge builds the infrastructure that makes that possible.</p>
        </div>
      </section>

      <AriaSection />

      {/* BPO FAQ Section — targets featured snippets for BPO/outsourcing queries */}
      <section id="faq" aria-label="BPO & Outsourcing FAQ" className="py-16 md:py-24 px-4 md:px-6 bg-surface">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 reveal">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-6">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              BPO &amp; Outsourcing FAQ
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-text font-['Space_Grotesk'] mb-4">
              Everything You Need to Know About <span className="text-holo">BPO &amp; Offshore Outsourcing</span>
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Answers to the most common questions about BPO, offshore software development, and IT outsourcing with TrivianEdge.
            </p>
          </div>
          <div className="space-y-4 reveal">
            {[
              {
                q: "What is BPO (Business Process Outsourcing)?",
                a: "Business Process Outsourcing (BPO) is the practice of contracting specific business functions to a third-party provider. TrivianEdge offers comprehensive BPO services including offshore software development, IT outsourcing, customer support, finance & accounting, and back-office operations — all managed from Canada with teams across 6 global time zones."
              },
              {
                q: "Why choose TrivianEdge for offshore software development?",
                a: "TrivianEdge is a Canada-based BPO and offshore development company with a proven 30-day deployment model. We source elite software developers, DevOps engineers, and AI specialists from our global talent hubs — delivering up to 40% cost savings vs. local hiring, with zero compromise on quality."
              },
              {
                q: "How much can I save with offshore outsourcing?",
                a: "Companies typically save 40–60% on talent costs by partnering with TrivianEdge for offshore staffing and BPO services. Our global talent hubs — Philippines, Sri Lanka, Vietnam, Turkey, Eastern Europe — provide highly skilled professionals at a fraction of North American rates."
              },
              {
                q: "What software development services does TrivianEdge outsource?",
                a: "We provide offshore software development outsourcing for full-stack development, AI/ML engineering, cloud & DevOps, mobile app development, UI/UX design, cybersecurity, and data engineering — all as dedicated offshore teams tailored to your tech stack."
              },
              {
                q: "How fast can TrivianEdge deploy an offshore team?",
                a: "Our standard deployment timeline is 30 days from first conversation to an active, integrated team. This includes discovery, sourcing, vetting, onboarding, and operational integration — significantly faster than traditional hiring processes."
              },
              {
                q: "Is TrivianEdge a Canadian BPO company?",
                a: "Yes. TrivianEdge is headquartered in Toronto, Canada and operates as a Canada-based global BPO and outsourcing company. We manage offshore talent deployment, IT outsourcing, and managed services for clients across North America, the UK, Australia, and the Middle East."
              },
            ].map((item, i) => (
              <details key={i} className="glass border-border rounded-2xl group overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer text-text font-bold text-lg list-none select-none hover:text-cyan-400 transition-colors">
                  <span>{item.q}</span>
                  <span className="ml-4 text-cyan-400 text-2xl font-light group-open:rotate-45 transition-transform duration-300 flex-shrink-0">+</span>
                </summary>
                <div className="px-6 pb-6 text-muted leading-relaxed border-t border-border pt-4">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" aria-label="Contact Us" className="py-16 md:py-32 px-4 md:px-6">
        <div className="max-w-7xl mx-auto reveal">
          <div className="glass p-12 md:p-24 rounded-[4rem] border-border text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-600/10 blur-[120px] rounded-full" />
            <div className="relative z-10">
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-10 text-text">Your Next Team Deploys in 30 Days.</h2>
              <p className="text-muted text-lg md:text-2xl max-w-2xl mx-auto mb-12 leading-relaxed">
                We're not hiring for you. We're deploying with you. From discovery to first week on the job, every milestone is tracked, every deliverable is owned, and every time zone is synchronized.
              </p>

              {/* Contact Details Grid */}
              <div className="grid md:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto text-left">
                <div className="p-8 rounded-3xl bg-surface border border-border hover:border-cyan-500/30 transition-colors group">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <MapPin className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-muted mb-2">Global HQ</h4>
                  <p className="text-text font-medium leading-relaxed">37 Wiggens Ct,<br/>Toronto ON M1B 1K3,<br/>Canada</p>
                </div>

                <a href="tel:+18882028513" className="p-8 rounded-3xl bg-surface border border-border hover:border-cyan-500/30 transition-colors group block">
                  <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Phone className="w-6 h-6 text-violet-400" />
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-muted mb-2">Direct Line</h4>
                  <p className="text-text font-medium group-hover:text-cyan-400 transition-colors">+1 888 202 8513</p>
                </a>

                <a href="mailto:info@trivianedge.com" className="p-8 rounded-3xl bg-surface border border-border hover:border-cyan-500/30 transition-colors group block">
                  <div className="w-12 h-12 rounded-full bg-magenta-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6 text-magenta-400" />
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-muted mb-2">Inquiries</h4>
                  <p className="text-text font-medium group-hover:text-cyan-400 transition-colors">info@trivianedge.com</p>
                </a>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <a href="mailto:info@trivianedge.com" className="px-12 py-6 bg-btn-bg text-btn-text rounded-2xl font-bold text-xl hover:bg-cyan-400 hover:text-white transition-all shadow-2xl shadow-cyan-500/10 flex items-center justify-center gap-2">
                  <Mail className="w-5 h-5" />
                  Email Our Team
                </a>
                <a href="tel:+18882028513" className="px-12 py-6 glass text-text rounded-2xl font-bold text-xl hover:bg-surface transition-all flex items-center justify-center gap-2">
                  <Phone className="w-5 h-5" />
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

// SEO logic — trend-adaptive, uses rotating keyword emphasis for fresh signals
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
    return {
      title: 'Privacy Protocol — TrivianEdge BPO & Outsourcing Company',
      description: 'TrivianEdge Global privacy policy for BPO, outsourcing, and offshore services. PIPEDA and GDPR compliant.',
      canonical: `${SEO_CONFIG.siteUrl}/privacy`,
    };
  }
  if (pathname === '/terms') {
    return {
      title: 'Terms of Engagement — TrivianEdge BPO & Outsourcing Services',
      description: 'TrivianEdge terms of service for BPO, outsourcing, and offshore software development engagements.',
      canonical: `${SEO_CONFIG.siteUrl}/terms`,
    };
  }
  // Home — maximum schema richness for BPO/outsourcing dominance
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
      buildServiceSchema({
        name: 'BPO & Business Process Outsourcing',
        description: 'Canada-based BPO services including offshore software development, IT outsourcing, talent staffing, and managed remote operations across 6 time zones.',
        keywords: [...KEYWORD_CLUSTERS.bpo, ...KEYWORD_CLUSTERS.outsourcing],
      }),
      buildServiceSchema({
        name: 'Offshore Software Development',
        description: 'Dedicated offshore software development teams sourced from elite global talent hubs — Philippines, Sri Lanka, Vietnam, Turkey, and Eastern Europe.',
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
        <SEOHead {...seoProps} />
        <AlgorithmMonitor signals={signals} recommendations={recommendations} />
        <div className="bg-background min-h-screen text-text overflow-x-hidden selection:bg-cyan-500/30 transition-colors duration-300">
          <Preloader />
          <Navbar />
          <Suspense fallback={null}>
            <ChatSidebar />
          </Suspense>
          
          <AnimatePresence>
            {selectedHub && (
              <TalentHubModal hub={selectedHub} onClose={() => setSelectedHub(null)} />
            )}
          </AnimatePresence>

          <main>
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
                <p className="text-muted text-lg max-w-sm mb-10 leading-relaxed">Canada's BPO &amp; offshore outsourcing partner. We deploy elite software development teams and managed remote operations across 6 time zones. 30-day deployment. 40% cost savings.</p>
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
                  <li><a href="/#solutions" onClick={(e) => { e.preventDefault(); scrollToSection('solutions'); }} className="hover:text-text transition-colors">Core Offerings</a></li>
                  <li><a href="/#talent-hubs" onClick={(e) => { e.preventDefault(); scrollToSection('talent-hubs'); }} className="hover:text-text transition-colors">Talent Hubs</a></li>
                  <li><a href="/#roles" onClick={(e) => { e.preventDefault(); scrollToSection('roles'); }} className="hover:text-text transition-colors">Global Roles</a></li>
                  <li><a href="/#aria" onClick={(e) => { e.preventDefault(); scrollToSection('aria'); }} className="hover:text-text transition-colors">Trivian Aria</a></li>
                  <li><Link to="/blog" className="hover:text-text transition-colors">Intelligence Feed</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-text mb-8 tracking-widest uppercase text-xs">Resources</h4>
                <ul className="space-y-6 text-muted font-medium">
                  <li><a href="/#process" onClick={(e) => { e.preventDefault(); scrollToSection('process'); }} className="hover:text-text transition-colors">Operating Model</a></li>
                  <li><a href="/#talent-hubs" onClick={(e) => { e.preventDefault(); scrollToSection('talent-hubs'); }} className="hover:text-text transition-colors">Global Hubs</a></li>
                  <li><Link to="/privacy" className="hover:text-text transition-colors">Legal &amp; Compliance</Link></li>
                  <li><a href="/#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }} className="hover:text-text transition-colors">Contact Support</a></li>
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
      </LanguageProvider>
    </ThemeProvider>
  );
}
