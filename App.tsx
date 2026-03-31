
import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  ArrowRight, 
  Menu, 
  X, 
  ChevronRight,
  Globe2,
  Cpu,
  Zap, 
  ShieldCheck,
  Mail,
  Linkedin,
  Twitter,
  ExternalLink,
  Terminal,
  Activity,
  Layers,
  Search,
  BookOpen,
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Info,
  Network,
  MessageSquare,
  CheckCircle2,
  TrendingUp,
  ArrowUp,
  Phone,
  MapPin,
  Users,
  BarChart4,
  Bot
} from 'lucide-react';
import { NAV_LINKS, WHY_US, ROLES, STEPS, BLOG_POSTS, TALENT_HUBS, SERVICES } from './constants';
import { BlogPost, TalentHub } from './types';
import GreetingBanner from './components/GreetingBanner';
import { LanguageProvider } from './contexts/LanguageContext';
import LanguageSelector from './components/LanguageSelector';
import Preloader from './components/Preloader';
import { ThemeProvider } from './contexts/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import { TalentHubModal } from './components/TalentHubModal';
import { ChatSidebar } from './components/ChatSidebar';

const LogoIcon = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg viewBox="0 0 320 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 35L75 35L55 5L0 35Z" fill="#60B46D" />
    <path d="M60 5L150 5L150 95L60 5Z" fill="#4DBC9F" />
    <path d="M160 95L160 5L250 5L160 95Z" fill="#46C5B3" />
    <path d="M235 35L310 35L255 5L235 35Z" fill="#40C9C8" />
  </svg>
);

const Logo = ({ onClick, showTagline = true }: { onClick?: () => void; showTagline?: boolean }) => (
  <div className="flex items-center gap-3 group cursor-pointer" onClick={onClick}>
    <div className="relative w-12 h-8 flex items-center justify-center">
      <LogoIcon className="w-full h-full transition-transform duration-500 group-hover:scale-110" />
    </div>
    <div className="flex items-center font-['Space_Grotesk']">
      <span className="text-2xl font-bold tracking-tight text-text">
        Trivian<span className="text-muted font-normal">Edge</span>
      </span>
      {showTagline && (
        <span className="ml-3 text-[10px] md:text-xs font-bold tracking-[0.2em] text-muted uppercase opacity-80 pt-1.5">
          Solutions
        </span>
      )}
    </div>
  </div>
);

const ProcessTimeline: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    <div className="relative max-w-4xl mx-auto pl-4 md:pl-0">
      {/* Vertical Connecting Line */}
      <div className="absolute left-[27px] md:left-[27px] top-4 bottom-4 w-px bg-gradient-to-b from-cyan-500/40 via-violet-500/20 to-transparent" />
      
      <div className="space-y-8 relative z-10">
        {STEPS.map((step, idx) => {
          const isActive = activeStep === idx;
          
          return (
            <div 
              key={idx}
              className={`relative flex gap-8 group cursor-pointer`}
              onClick={() => setActiveStep(idx)}
            >
              {/* Node/Marker */}
              <div className="relative flex-shrink-0">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all duration-500 relative z-10 ${isActive ? 'bg-background border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)]' : 'bg-background border-border group-hover:border-cyan-500/40'}`}>
                  {isActive ? (
                    <div className="text-cyan-400 animate-pulse">{step.icon}</div>
                  ) : (
                    <span className="font-mono text-sm text-muted font-bold">{step.number}</span>
                  )}
                </div>
                {/* Connecting glow for active step */}
                {isActive && (
                   <div className="absolute -inset-1 rounded-full bg-cyan-500/20 blur-md animate-pulse" />
                )}
              </div>

              {/* Content Card */}
              <div className={`flex-1 rounded-3xl border transition-all duration-500 overflow-hidden ${isActive ? 'bg-surface border-cyan-500/30' : 'bg-transparent border-transparent hover:bg-surface'}`}>
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-xl md:text-2xl font-bold transition-colors ${isActive ? 'text-text' : 'text-muted group-hover:text-text'}`}>
                      {step.title}
                    </h3>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${isActive ? 'border-cyan-500/30 bg-cyan-500/10 rotate-90' : 'border-border'}`}>
                      <ChevronRight className={`w-4 h-4 transition-colors ${isActive ? 'text-cyan-400' : 'text-muted'}`} />
                    </div>
                  </div>
                  
                  <div className={`grid transition-all duration-500 ease-in-out ${isActive ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                       <p className="text-muted text-sm md:text-base leading-relaxed border-t border-border pt-4">
                         {step.description}
                       </p>
                       <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                          <Activity className="w-3 h-3" />
                          <span>Status: {isActive ? 'Protocol Active' : 'Standby'}</span>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const BlogCard: React.FC<{ post: BlogPost; onClick: (id: string) => void; index: number }> = ({ post, onClick, index }) => (
  <button
    type="button"
    onClick={() => onClick(post.id)}
    className="reveal glass group w-full text-left p-8 rounded-[2.5rem] border-border hover-neon-glow overflow-hidden relative"
    style={{ transitionDelay: `${index * 200}ms` }}
  >
    <div className={`absolute top-0 left-0 w-full h-32 bg-gradient-to-br ${post.imageGradient} opacity-20 group-hover:opacity-40 transition-opacity`} />
    <div className="relative z-10 pt-20">
      <div className="flex items-center gap-3 mb-4">
        <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-bold uppercase tracking-widest text-cyan-400">
          {post.category}
        </span>
        <span className="text-[10px] text-muted font-mono tracking-widest">{post.readTime}</span>
      </div>
      <h3 className="text-2xl font-bold mb-4 group-hover:text-cyan-400 transition-colors text-text">{post.title}</h3>
      <p className="text-muted text-sm leading-relaxed mb-6 line-clamp-2">{post.excerpt}</p>
      <div className="flex items-center justify-between pt-6 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center">
            <User className="w-4 h-4 text-muted" />
          </div>
          <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{post.author}</span>
        </div>
        <ArrowRight className="w-5 h-5 text-muted group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  </button>
);

const TalentHubCard: React.FC<{ hub: TalentHub; index: number; onClick: (hub: TalentHub) => void }> = ({ hub, index, onClick }) => {
  const cardRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      const centerOffset = (rect.top + rect.height / 2) - (viewportHeight / 2);
      const progress = centerOffset / (viewportHeight / 2);
      
      const shift1 = progress * -60;
      const shift2 = progress * 30;
      
      cardRef.current.style.setProperty('--p-offset-1', `${shift1}px`);
      cardRef.current.style.setProperty('--p-offset-2', `${shift2}px`);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <button
      ref={cardRef}
      type="button"
      onClick={() => onClick(hub)}
      className="reveal glass w-full text-left p-8 md:p-10 rounded-[2.5rem] border-border hover-neon-glow relative overflow-hidden group"
      style={{ transitionDelay: `${index * 100}ms` } as React.CSSProperties}
    >
      <div 
        className={`absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br ${hub.gradient} opacity-20 blur-[100px] group-hover:opacity-40 transition-opacity duration-1000`} 
        style={{ 
          transform: 'translate3d(0, var(--p-offset-1, 0), 0)',
          willChange: 'transform'
        }}
      />
      <div 
        className={`absolute -bottom-10 -left-10 w-48 h-48 bg-gradient-to-tr ${hub.gradient} opacity-10 blur-[60px] group-hover:opacity-25 transition-opacity duration-1000`} 
        style={{ 
          transform: 'translate3d(0, var(--p-offset-2, 0), 0)',
          willChange: 'transform'
        }}
      />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="text-4xl filter grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-110">{hub.flag}</div>
          <div className="flex items-center gap-3">
            <div className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 flex items-center gap-1">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">View Analysis</span>
                <ArrowRight className="w-3 h-3 text-cyan-400" />
            </div>
            <div className="px-4 py-1.5 rounded-full bg-surface border border-border text-[10px] font-bold uppercase tracking-widest text-cyan-400/80 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition-colors">
              Global Hub
            </div>
          </div>
        </div>
        <h3 className="text-3xl font-bold mb-2 group-hover:text-text transition-colors text-text">{hub.country}</h3>
        <p className="text-cyan-400 font-mono text-[10px] uppercase tracking-[0.2em] mb-6">{hub.specialty}</p>
        <p className="text-muted text-sm leading-relaxed mb-8">{hub.description}</p>
        <div className="space-y-4 pt-6 border-t border-border">
          <div className="flex items-start gap-3 group/item">
            <Network className="w-4 h-4 text-violet-400 mt-1 flex-shrink-0 transition-transform group-hover/item:scale-125" />
            <div>
              <p className="text-[10px] font-bold uppercase text-muted tracking-wider mb-1">Infrastructure</p>
              <p className="text-xs text-muted leading-relaxed line-clamp-2">{hub.infrastructure}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 group/item">
            <MessageSquare className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0 transition-transform group-hover/item:scale-125" />
            <div>
              <p className="text-[10px] font-bold uppercase text-muted tracking-wider mb-1">Communication</p>
              <p className="text-xs text-muted leading-relaxed line-clamp-2">{hub.communication}</p>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
};

const BlogView: React.FC<{ onPostClick: (id: string) => void }> = ({ onPostClick }) => (
  <section id="blog-list" className="py-32 px-6 min-h-screen">
    <div className="max-w-7xl mx-auto">
      <div className="mb-20 reveal">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-border bg-surface backdrop-blur-md text-[10px] font-bold tracking-[0.2em] uppercase mb-8 text-text">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          Intel & Insights
        </div>
        <h2 className="text-5xl md:text-7xl font-bold mb-6 text-text">Insights from the <br className="hidden md:block" /> <span className="text-gradient">Edge of Intelligence.</span></h2>
        <p className="text-muted text-lg max-w-2xl">Exploring the intersection of AI, global talent, and operational excellence.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {BLOG_POSTS.map((post, idx) => (
          <BlogCard key={post.id} post={post} onClick={onPostClick} index={idx} />
        ))}
      </div>
    </div>
  </section>
);

const BlogPostDetail: React.FC<{ post: BlogPost; onBack: () => void }> = ({ post, onBack }) => (
  <section className="py-32 px-6 min-h-screen relative">
    <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-cyan-500/5 to-transparent -z-10" />
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-muted hover:text-cyan-400 transition-colors mb-12 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-widest">Back to Intelligence Feed</span>
      </button>

      <div className="reveal">
        <div className="flex items-center gap-6 mb-8">
          <div className="flex items-center gap-2 text-[10px] text-muted font-mono tracking-widest uppercase">
            <Calendar className="w-4 h-4" />
            {post.date}
          </div>
          <div className="flex items-center gap-2 text-[10px] text-muted font-mono tracking-widest uppercase">
            <Clock className="w-4 h-4" />
            {post.readTime}
          </div>
          <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-bold uppercase tracking-widest text-cyan-400">
            {post.category}
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-12 leading-tight text-text">{post.title}</h1>
        
        <div className="flex items-center gap-4 mb-16 p-6 glass border-border rounded-3xl w-fit">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center p-0.5">
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
              <User className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <div>
            <p className="text-[10px] text-muted font-mono uppercase tracking-widest">Authored By</p>
            <p className="text-text font-bold">{post.author}</p>
          </div>
        </div>

        <div className="prose prose-invert prose-lg max-w-none">
          <div className="text-muted leading-relaxed space-y-8 text-xl">
            {post.content.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>

        <div className="mt-24 p-12 glass border-border rounded-[3rem] text-center">
          <h3 className="text-2xl font-bold mb-6 text-text">Inspired by this insight?</h3>
          <p className="text-muted mb-10 max-w-md mx-auto">Learn how we can apply these operational strategies to your specific business scaling needs.</p>
          <a 
            href="mailto:info@trivianedge.com"
            className="inline-block px-10 py-5 bg-btn-bg text-btn-text rounded-2xl font-bold text-lg hover:bg-cyan-400 hover:text-white transition-all shadow-2xl shadow-surface"
          >
            Discuss Your Strategy
          </a>
        </div>
      </div>
    </div>
  </section>
);

const TalentAdvisor: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAskAI = async () => {
    if (!query || loading) return;
    setLoading(true);
    setResult('');
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `You are the TrivianEdge Intelligence Engine. A potential client is asking about scaling or talent strategy. Query: "${query}". Provide a concise, high-impact, futuristic executive response (max 80 words). Focus on how TrivianEdge solves the Ops-HR language gap and uses global talent pipelines. Sound elite, confident, and professional.`,
        }),
      });
      const data = await response.json() as { text?: string };
      const text = data.text || "Connection timeout. Please re-initiate uplink.";
      let i = 0;
      const interval = setInterval(() => {
        setResult(text.slice(0, i));
        i++;
        if (i > text.length) {
          clearInterval(interval);
          setLoading(false);
        }
      }, 15);
    } catch (error) {
      setResult("Security protocol triggered. AI Engine offline. Please contact human operators.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reveal glass p-8 md:p-12 rounded-[2.5rem] border-border relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-violet-500/5 opacity-50 group-hover:opacity-100 transition-opacity" />
      <div className="scan-line" />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <Terminal className="text-cyan-400 w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-text">Intelligence Engine</h3>
            <p className="text-xs text-cyan-400/60 font-mono tracking-widest uppercase">Consultation Protocol v4.0</p>
          </div>
        </div>
        <p className="text-muted mb-8 text-sm md:text-base leading-relaxed">
          Input your scaling requirements. Our AI will analyze your operational bottlenecks and provide a preliminary execution blueprint.
        </p>
        <div className="flex flex-col gap-4">
          <div className="relative">
            <textarea 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe your current scaling friction..."
              className="w-full bg-surface border border-border rounded-2xl p-5 text-sm md:text-base focus:outline-none focus:border-cyan-500/40 transition-all h-32 resize-none font-mono text-text placeholder-muted"
            />
            {loading && (
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[10px] font-mono text-cyan-400">ANALYZING...</span>
              </div>
            )}
          </div>
          <button 
            onClick={handleAskAI}
            disabled={loading || !query}
            className="group relative overflow-hidden bg-btn-bg text-btn-text font-bold py-4 px-8 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? 'Processing Protocol...' : 'Generate Execution Blueprint'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
        {result && (
          <div className="mt-8 p-6 bg-cyan-500/5 rounded-2xl border border-cyan-500/20 text-text animate-fade-in">
            <div className="flex items-center gap-2 mb-3 text-[10px] font-mono text-cyan-400">
              <Activity className="w-3 h-3" />
              <span>OUTPUT RECEIVED</span>
            </div>
            <p className="font-mono text-sm leading-relaxed whitespace-pre-wrap">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ARIA_FEATURES = [
  {
    icon: <Bot className="w-7 h-7 text-cyan-400" />,
    title: 'ARIA AI Assistant',
    description: 'Ask anything about your workforce. Get instant insights powered by built-in AI — no third-party tools needed.',
  },
  {
    icon: <Users className="w-7 h-7 text-violet-400" />,
    title: 'Employee Management',
    description: 'Full lifecycle management from onboarding to offboarding — contracts, profiles, documents, and role history in one place.',
  },
  {
    icon: <Calendar className="w-7 h-7 text-cyan-400" />,
    title: 'Leave Management',
    description: 'Automated leave tracking, team-aware approvals, and real-time balance management with zero manual overhead.',
  },
  {
    icon: <Search className="w-7 h-7 text-violet-400" />,
    title: 'Recruitment Pipeline',
    description: 'Kanban-style hiring board to track every candidate through every stage — from sourcing to offer letter.',
  },
  {
    icon: <Zap className="w-7 h-7 text-cyan-400" />,
    title: 'Payroll Automation',
    description: 'Accurate, automated payroll processing at scale — configured to your pay schedules, deductions, and compliance rules.',
  },
  {
    icon: <BarChart4 className="w-7 h-7 text-violet-400" />,
    title: 'Reports & Analytics',
    description: 'Real-time workforce insights and performance dashboards — headcount trends, attrition, leave utilisation, and more.',
  },
];

const AriaSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ company: '', email: '', size: '1-10' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[Trivian Aria] Early Access Request:', form);
    setSubmitted(true);
  };

  return (
    <section id="aria" className="py-32 px-6 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-gradient-to-b from-cyan-500/5 to-violet-500/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-20 reveal">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-8">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Now in Development — Phase 1
          </span>
          <h2 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight leading-[1.1] font-['Space_Grotesk'] text-text">
            Meet Trivian Aria.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">HR on Autopilot.</span>
          </h2>
          <p className="text-muted text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-6">
            Trivian Aria is TrivianEdge's proprietary AI-powered HRIS platform — built to eliminate the Ops-HR language gap from within. We've begun Phase 1 development and are opening early access to select companies completely free.
          </p>
          <p className="text-muted text-base max-w-2xl mx-auto leading-relaxed">
            Aria brings together AI-powered HR management, full employee lifecycle tracking, automated payroll, leave management, a Kanban recruitment pipeline, real-time analytics, and a built-in AI assistant — all in a single unified platform built on React, TypeScript, and Supabase.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {ARIA_FEATURES.map((feature, i) => (
            <div
              key={feature.title}
              className="reveal glass p-8 rounded-[2.5rem] border-border bg-surface hover:border-cyan-500/30 transition-all duration-300 group relative overflow-hidden"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="p-3 rounded-2xl bg-surface border border-border inline-flex mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-text mb-3 font-['Space_Grotesk']">{feature.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Early Access CTA + Form */}
        <div className="reveal glass p-12 md:p-16 rounded-[3rem] border-border relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">

            {/* Left: CTA copy */}
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-mono tracking-widest uppercase mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500 border border-cyan-500/20">
                Early Access
              </span>
              <h3 className="text-3xl md:text-5xl font-bold mb-6 text-text font-['Space_Grotesk'] leading-tight">
                Free for up to<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">10 Employees.</span>
              </h3>
              <p className="text-muted text-base leading-relaxed mb-4">
                Phase 1 is live. Companies can sign up for early access and use Trivian Aria completely free for teams of up to 10 employees — no credit card required, no strings attached.
              </p>
              <ul className="space-y-3">
                {['No credit card required', 'Full Phase 1 feature set', 'Priority onboarding support', 'Free forever for ≤ 10 employees'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-muted">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Form */}
            <div>
              {submitted ? (
                <div className="flex flex-col items-center justify-center gap-6 py-12 text-center">
                  <div className="p-4 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                    <CheckCircle2 className="w-10 h-10 text-cyan-400" />
                  </div>
                  <h4 className="text-2xl font-bold text-text font-['Space_Grotesk']">You're on the list.</h4>
                  <p className="text-muted text-sm leading-relaxed max-w-xs">
                    We'll reach out with your early access credentials shortly. Welcome to the future of HR.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div>
                    <label className="block text-xs font-mono tracking-widest uppercase text-muted mb-2">Company Name</label>
                    <input
                      type="text"
                      required
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="Acme Corp"
                      className="w-full bg-surface border border-border rounded-2xl px-5 py-4 text-sm text-text placeholder-muted focus:outline-none focus:border-cyan-500/40 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono tracking-widest uppercase text-muted mb-2">Work Email</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@company.com"
                      className="w-full bg-surface border border-border rounded-2xl px-5 py-4 text-sm text-text placeholder-muted focus:outline-none focus:border-cyan-500/40 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono tracking-widest uppercase text-muted mb-2">Company Size</label>
                    <select
                      value={form.size}
                      onChange={(e) => setForm({ ...form, size: e.target.value })}
                      className="w-full bg-surface border border-border rounded-2xl px-5 py-4 text-sm text-text focus:outline-none focus:border-cyan-500/40 transition-all appearance-none cursor-pointer"
                    >
                      <option value="1-10">1–10 employees</option>
                      <option value="11-50">11–50 employees</option>
                      <option value="51-200">51–200 employees</option>
                      <option value="200+">200+ employees</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="group relative overflow-hidden bg-btn-bg text-btn-text font-bold py-4 px-8 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] mt-2 flex items-center justify-center gap-2"
                  >
                    Request Early Access — It's Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className={`fixed bottom-28 right-8 z-50 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
      <button
        onClick={scrollToTop}
        className="p-4 rounded-full bg-surface border border-border backdrop-blur-md hover-neon-glow group relative"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-6 h-6 text-muted group-hover:text-cyan-400 transition-colors" />
      </button>
    </div>
  );
};

const Navbar: React.FC<{ onViewChange: (view: 'home' | 'blog' | string) => void }> = ({ onViewChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (href === '#blog') {
      onViewChange('blog');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onViewChange('home');
      setTimeout(() => {
        const id = href.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    }
  };

  const menuVariants = {
    closed: { x: "100%" },
    open: { 
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }
    },
    exit: { 
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 300, 
        damping: 30
      }
    }
  };

  const containerVariants = {
    closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
    open: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const itemVariants = {
    closed: { x: -50, opacity: 0 },
    open: { x: 0, opacity: 1 }
  };

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'glass py-4 shadow-2xl' : 'bg-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center relative z-[101]">
        <a href="#" onClick={(e) => { e.preventDefault(); onViewChange('home'); window.scrollTo({top: 0, behavior: 'smooth'}); }}>
          <Logo />
        </a>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <a 
              key={link.name} 
              href={link.href} 
              onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
              className="text-xs font-bold uppercase tracking-widest text-muted hover:text-cyan-400 transition-colors"
            >
              {link.name}
            </a>
          ))}
          
          <div className="h-4 w-px bg-border mx-2"></div>
          <LanguageSelector />
          <ThemeToggle />
          
          <a href="#contact" onClick={(e) => { e.preventDefault(); handleNavClick('#contact'); }} className="px-6 py-2.5 bg-btn-bg text-btn-text rounded-full text-xs font-bold uppercase tracking-widest hover:bg-cyan-400 hover:text-white transition-all">
            Talk To Us
          </a>
        </div>

        <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <button className="p-2 text-text" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="exit"
            variants={menuVariants}
            className="fixed inset-0 bg-background z-[90] md:hidden overflow-hidden flex flex-col"
          >
            {/* Background Parallax Elements */}
            <motion.div 
               className="absolute top-[-10%] right-[-10%] w-[70vw] h-[70vw] bg-cyan-500/10 blur-[80px] rounded-full"
               initial={{ x: 100, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               transition={{ duration: 1, ease: "easeOut" }}
            />
             <motion.div 
               className="absolute bottom-[-10%] left-[-10%] w-[70vw] h-[70vw] bg-violet-600/10 blur-[80px] rounded-full"
               initial={{ x: -100, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
            />

            <motion.div 
              className="flex flex-col items-center justify-center h-full gap-8 relative z-10"
              variants={containerVariants}
            >
              <motion.a 
                href="#" 
                variants={itemVariants}
                className="text-4xl font-bold text-text hover:text-cyan-400 transition-colors font-['Space_Grotesk']" 
                onClick={(e) => { e.preventDefault(); setIsOpen(false); onViewChange('home'); window.scrollTo({top: 0}); }}
              >
                Home
              </motion.a>

              {NAV_LINKS.map(link => (
                <motion.a 
                  key={link.name} 
                  href={link.href} 
                  variants={itemVariants}
                  className="text-4xl font-bold text-text hover:text-cyan-400 transition-colors font-['Space_Grotesk']" 
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                >
                  {link.name}
                </motion.a>
              ))}

              <motion.div variants={itemVariants} className="my-4 scale-125">
                 <LanguageSelector />
              </motion.div>

              <motion.a 
                href="#contact" 
                variants={itemVariants}
                className="mt-4 px-10 py-4 bg-cyan-600 text-white rounded-2xl font-bold text-xl" 
                onClick={(e) => { e.preventDefault(); handleNavClick('#contact'); }}
              >
                Get Started
              </motion.a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default function App() {
  const [view, setView] = useState<'home' | 'blog' | string>('home');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedHub, setSelectedHub] = useState<TalentHub | null>(null);

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
  }, [view, selectedPostId, selectedHub]);

  const handlePostClick = (id: string) => {
    setSelectedPostId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToBlog = () => {
    setSelectedPostId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedPost = BLOG_POSTS.find(p => p.id === selectedPostId);

  const scrollToSection = (sectionId: string) => {
    setView('home');
    setTimeout(() => document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="bg-background min-h-screen text-text overflow-x-hidden selection:bg-cyan-500/30 transition-colors duration-300">
          <Preloader />
          <Navbar onViewChange={setView} />
          <ChatSidebar />
          
          <AnimatePresence>
            {selectedHub && (
              <TalentHubModal hub={selectedHub} onClose={() => setSelectedHub(null)} />
            )}
          </AnimatePresence>

          <main>
            {view === 'home' && (
              <>
                <section className="relative min-h-[90vh] flex items-center pt-24 px-6 overflow-hidden">
                  <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 blur-[120px] rounded-full" />
                  <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 blur-[120px] rounded-full" />
                  <div className="bg-grid absolute inset-0 opacity-20" />
                  <div className="max-w-7xl mx-auto w-full relative z-10 text-center md:text-left">
                    
                    <GreetingBanner />

                    <div className="reveal inline-flex items-center gap-3 px-4 py-2 rounded-full border border-border bg-surface backdrop-blur-md text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-8 text-text">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      Next-Gen Global Execution Platform
                    </div>
                    <h1 className="reveal text-5xl md:text-8xl font-bold tracking-tight mb-8 leading-[1] text-text cursor-pointer">
                      <span className="glitch-text inline-block hover:text-cyan-400 transition-colors" data-text="The Bridge Between">The Bridge Between</span> <br className="hidden md:block" />
                      <span className="glitch-text inline-block bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600" data-text="AI, Ops, & Talent.">AI, Ops, & Talent.</span>
                    </h1>
                    <p className="reveal text-muted text-lg md:text-2xl max-w-3xl mb-12 leading-relaxed">
                      We empower startups and enterprises to scale without friction. Combining elite global talent pipelines with AI-driven operational software to ensure execution never fails.
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
                    <div className="mt-20 pt-12 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-8 opacity-70 hover:opacity-100 transition-opacity">
                      <div className="flex flex-col gap-1"><span className="text-2xl font-bold text-text">98%</span><span className="text-[10px] tracking-widest text-muted uppercase font-bold">Talent Retention</span></div>
                      <div className="flex flex-col gap-1"><span className="text-2xl font-bold text-text">2.4x</span><span className="text-[10px] tracking-widest text-muted uppercase font-bold">Execution Speed</span></div>
                      <div className="flex flex-col gap-1"><span className="text-2xl font-bold text-text">6+</span><span className="text-[10px] tracking-widest text-muted uppercase font-bold">Strategic Regions</span></div>
                      <div className="flex flex-col gap-1"><span className="text-2xl font-bold text-text">AI-First</span><span className="text-[10px] tracking-widest text-muted uppercase font-bold">Infrastructure</span></div>
                    </div>
                  </div>
                </section>

                <section id="problem" className="py-32 px-6">
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
                <section id="why-us" className="py-24 px-6">
                  <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 reveal">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-6">
                         <CheckCircle2 className="w-3 h-3" />
                         Why TrivianEdge
                      </div>
                      <h2 className="text-4xl md:text-6xl font-bold mb-6 text-text">The Execution Advantage</h2>
                      <p className="text-muted text-lg max-w-2xl mx-auto">
                        We don't just fill seats. We build high-performance, operationally integrated remote teams.
                      </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {WHY_US.map((item, idx) => (
                        <div 
                          key={idx} 
                          className="reveal glass p-8 rounded-[2rem] border-border hover:border-cyan-500/30 transition-all duration-300 group hover:-translate-y-2 relative overflow-hidden"
                          style={{ transitionDelay: `${idx * 100}ms` }}
                        >
                           <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl group-hover:bg-cyan-500/10 transition-colors" />
                          <div className="w-14 h-14 rounded-2xl bg-surface border border-border flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-cyan-500/30 transition-all duration-300 shadow-lg shadow-black/20">
                            {item.icon}
                          </div>
                          <h3 className="text-xl font-bold mb-4 group-hover:text-cyan-400 transition-colors text-text">{item.title}</h3>
                          <p className="text-muted text-sm leading-relaxed">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* CORE OFFERINGS SECTION */}
                <section id="solutions" className="py-32 px-6 bg-surface">
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
                <section id="talent-hubs" className="py-32 px-6">
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
                        <h3 className="text-2xl font-bold mb-4 text-text">Strategic Expansion Program</h3>
                        <p className="text-muted max-w-2xl mx-auto mb-8">
                          The global talent landscape evolves constantly. Our intelligence team continuously audits new regions, assessing digital infrastructure resilience, English proficiency standards, and specialty niche capabilities to ensure our partners stay ahead.
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

                <section id="roles" className="py-32 px-6 relative overflow-hidden bg-surface">
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

                <section id="process" className="py-32 px-6 bg-black">
                  <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24 reveal">
                      <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">The Deployment Protocol</h2>
                      <p className="text-gray-500">Four phases of precision-engineered growth.</p>
                    </div>
                    <ProcessTimeline />
                  </div>
                </section>

                <section className="py-32 px-6"><div className="max-w-5xl mx-auto"><TalentAdvisor /></div></section>

                <section id="future" className="py-32 px-6 relative text-center">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-violet-600/5 blur-[120px] rounded-full -z-10" />
                  <div className="max-w-4xl mx-auto reveal">
                    <Layers className="w-12 h-12 text-cyan-400 mx-auto mb-10 opacity-50" />
                    <h2 className="text-4xl md:text-7xl font-bold mb-10 tracking-tight leading-[1.1] text-text">Distributed Teams. <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">Autonomous Operations.</span> <br />Borderless Potential.</h2>
                    <p className="text-muted text-xl leading-relaxed">We are moving past the era of traditional hiring. The future belongs to borderless organizations powered by intelligent execution engines. TrivianEdge is the blueprint.</p>
                  </div>
                </section>

                <AriaSection />

                <section id="contact" className="py-32 px-6">
                  <div className="max-w-7xl mx-auto reveal">
                    <div className="glass p-12 md:p-24 rounded-[4rem] border-border text-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600/10 blur-[120px] rounded-full" />
                      <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-600/10 blur-[120px] rounded-full" />
                      <div className="relative z-10">
                        <h2 className="text-5xl md:text-7xl font-bold mb-10 text-text">Scale Without Limits.</h2>
                        <p className="text-muted text-lg md:text-2xl max-w-2xl mx-auto mb-12 leading-relaxed">
                          Ready to engineer your future workforce? Connect with our global strategy team.
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
            )}

            {view === 'blog' && (
              selectedPost ? (
                <BlogPostDetail post={selectedPost} onBack={handleBackToBlog} />
              ) : (
                <BlogView onPostClick={handlePostClick} />
              )
            )}
          </main>

          <footer className="pt-32 pb-16 px-6 border-t border-border">
            <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16 mb-20 reveal">
              <div className="md:col-span-2">
                <div className="mb-8"><Logo onClick={() => { setView('home'); window.scrollTo({top: 0, behavior: 'smooth'}); }} /></div>
                <p className="text-muted text-lg max-w-sm mb-10 leading-relaxed">Canada-based global talent architect and software solutions provider. Engineering the future of borderless execution.</p>
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
                    href="#" 
                    aria-label="TrivianEdge on Twitter"
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
                  <li><a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('solutions'); }} className="hover:text-text transition-colors">Core Offerings</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('talent-hubs'); }} className="hover:text-text transition-colors">Talent Hubs</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('roles'); }} className="hover:text-text transition-colors">Global Roles</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('aria'); }} className="hover:text-text transition-colors">Trivian Aria</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); setView('blog'); setSelectedPostId(null); }} className="hover:text-text transition-colors">Intelligence Feed</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-text mb-8 tracking-widest uppercase text-xs">Resources</h4>
                <ul className="space-y-6 text-muted font-medium">
                  <li><a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('process'); }} className="hover:text-text transition-colors">Operating Model</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('talent-hubs'); }} className="hover:text-text transition-colors">Global Hubs</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }} className="hover:text-text transition-colors">Legal & Compliance</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }} className="hover:text-text transition-colors">Contact Support</a></li>
                </ul>
              </div>
            </div>
            <div className="max-w-7xl mx-auto pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-mono tracking-widest uppercase text-muted reveal">
              <p>© {new Date().getFullYear()} TRIVIANEDGE GLOBAL. ALL EXECUTION GUARANTEED.</p>
              <div className="flex gap-12"><a href="#" className="hover:text-text transition-colors">Privacy Protocol</a><a href="#" className="hover:text-text transition-colors">Terms of Engagement</a></div>
            </div>
          </footer>
          <ScrollToTop />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
