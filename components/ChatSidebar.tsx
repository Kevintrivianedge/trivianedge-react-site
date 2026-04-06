
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { X, Send, MessageSquare, Terminal, Loader2, User, Bot, Sparkles, Trash2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SERVICES, TALENT_HUBS, ROLES, WHY_US } from '../constants';
import { getCountryGreeting, getCountryAffectionateName } from '../utils/greetings';
import { getTimeOfDay } from '../utils/getTimeOfDay';
import { useGeo } from '../contexts/GeoContext';
import { API_ENDPOINTS } from '../constants/api';

interface Message {
  role: 'user' | 'model';
  text: string;
  isInitial?: boolean;
}

const AriaAvatar = ({ isTyping = false, size = 'md' }) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isInteracting, setIsInteracting] = useState(false);
    const avatarRef = useRef<HTMLDivElement>(null);
    const containerClass = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-14 h-14' : 'w-10 h-10';
    const coreClass = size === 'sm' ? 'inset-[4px]' : 'inset-[6px]';
    const eyeSize = size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-4 h-4' : 'w-3 h-3';
    const happyEyeClass = size === 'sm' ? 'w-1.5 h-1' : size === 'lg' ? 'w-3 h-1.5' : 'w-2 h-1';
    
    // Mouse tracking for the eye
    useEffect(() => {
        if (isTyping) return; // Don't track while thinking
        
        const handleMouseMove = (e: MouseEvent) => {
            if (!avatarRef.current) return;
            const rect = avatarRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;
            
            // Normalize movement
            const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY), 300);
            const angle = Math.atan2(deltaY, deltaX);
            
            const maxEyeMove = size === 'lg' ? 6 : 3;
            const moveX = Math.cos(angle) * (distance / 300) * maxEyeMove;
            const moveY = Math.sin(angle) * (distance / 300) * maxEyeMove;
            
            setMousePos({ x: moveX, y: moveY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isTyping, size]);

    const handleBoop = () => {
        if (isTyping || isInteracting) return;
        setIsInteracting(true);
        setTimeout(() => setIsInteracting(false), 1500);
    };

    // Generate random particles for thinking state — stabilised with useMemo so positions
    // don't reset on every re-render (which restarts the Framer Motion animation).
    const particles = useMemo(
        () =>
            Array.from({ length: 5 }).map((_, i) => ({
                id: i,
                delay: i * 0.2,
                duration: 1 + Math.random(),
                x: (Math.random() - 0.5) * 40,
                y: (Math.random() - 0.5) * 40 - 20,
            })),
        [], // computed once per AriaAvatar mount
    );

    return (
        <motion.div 
            ref={avatarRef}
            onClick={handleBoop}
            className={`relative flex items-center justify-center flex-shrink-0 ${containerClass} ${!isTyping ? 'cursor-pointer' : ''}`}
            animate={{ 
                y: isTyping ? [0, -2, 0] : [0, -4, 0],
                rotateZ: isTyping ? 0 : mousePos.x * 2, // Slight head tilt based on mouse X
                scale: isInteracting ? [1, 1.2, 1] : 1 // Boop scale bounce
            }}
            transition={{ 
                duration: isInteracting ? 0.4 : (isTyping ? 1 : 4), 
                repeat: isInteracting ? 0 : Infinity, 
                ease: "easeInOut" 
            }}
            style={{ perspective: 1000 }}
        >
            {/* Outer aura - breathes */}
            <motion.div 
                animate={{ 
                    scale: isInteracting ? [1, 1.8, 1] : (isTyping ? [1, 1.4, 1] : [1, 1.1, 1]), 
                    opacity: isInteracting ? [0.6, 0.9, 0.6] : (isTyping ? [0.4, 0.8, 0.4] : [0.2, 0.4, 0.2]) 
                }}
                transition={{ duration: isInteracting ? 0.5 : (isTyping ? 1 : 3), repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-[-4px] rounded-full bg-cyan-500/40 blur-md"
            />
            
            {/* 3D Gyroscope Rings - Now with Parallax */}
            <motion.div 
                animate={{ 
                    rotateX: 360 + (mousePos.y * 5), 
                    rotateY: 180 + (mousePos.x * 5), 
                    rotateZ: 360 
                }}
                transition={{ duration: isTyping ? 2 : (isInteracting ? 1 : 10), repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-cyan-400/50 border-t-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                style={{ transformStyle: 'preserve-3d' }}
            />
            <motion.div 
                animate={{ 
                    rotateX: -180 + (mousePos.y * 5), 
                    rotateY: 360 + (mousePos.x * 5), 
                    rotateZ: -360 
                }}
                transition={{ duration: isTyping ? 3 : (isInteracting ? 1.5 : 15), repeat: Infinity, ease: "linear" }}
                className="absolute inset-[2px] rounded-full border border-violet-500/50 border-b-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                style={{ transformStyle: 'preserve-3d' }}
            />

            {/* Thinking Particles */}
            {isTyping && size === 'lg' && particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    animate={{ 
                        opacity: [0, 1, 0], 
                        scale: [0, 1, 0],
                        x: p.x,
                        y: p.y
                    }}
                    transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeOut" }}
                    className="absolute w-1.5 h-1.5 bg-cyan-300 rounded-full shadow-[0_0_5px_#22d3ee]"
                />
            ))}

            {/* The Core - Morphs shape when thinking */}
            <motion.div 
                animate={{ 
                    borderRadius: isTyping ? ["50%", "30%", "50%"] : ["50%", "50%", "50%"],
                    scale: isInteracting ? [0.9, 1.2, 0.9] : (isTyping ? [0.9, 1.1, 0.9] : [0.95, 1.05, 0.95]),
                    rotate: isInteracting ? 360 : (isTyping ? 90 : 0)
                }}
                transition={{ duration: isInteracting ? 0.8 : (isTyping ? 1.5 : 4), repeat: Infinity, ease: "easeInOut" }}
                className={`absolute ${coreClass} bg-gradient-to-br from-cyan-400 via-violet-500 to-fuchsia-600 shadow-[0_0_15px_rgba(34,211,238,0.8)] flex items-center justify-center overflow-hidden`}
            >
                <div className="absolute inset-0 bg-white/20 mix-blend-overlay" />
                
                {/* The "Face/Eye" - Expressive */}
                <div className="relative w-full h-full flex items-center justify-center gap-[2px]">
                    {isInteracting ? (
                        // Happy/Booped: Squinting eyes ^ ^
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex gap-1"
                        >
                            <div className={`${happyEyeClass} bg-white shadow-[0_0_5px_white]`} style={{ borderRadius: '50% 50% 0 0' }} />
                            <div className={`${happyEyeClass} bg-white shadow-[0_0_5px_white]`} style={{ borderRadius: '50% 50% 0 0' }} />
                        </motion.div>
                    ) : isTyping ? (
                        // Thinking/Processing: Waveform
                        <>
                            <motion.div animate={{ height: ['20%', '80%', '20%'] }} transition={{ duration: 0.4, repeat: Infinity, delay: 0 }} className="w-1 bg-white rounded-full shadow-[0_0_5px_white]" />
                            <motion.div animate={{ height: ['20%', '100%', '20%'] }} transition={{ duration: 0.4, repeat: Infinity, delay: 0.1 }} className="w-1 bg-white rounded-full shadow-[0_0_5px_white]" />
                            <motion.div animate={{ height: ['20%', '80%', '20%'] }} transition={{ duration: 0.4, repeat: Infinity, delay: 0.2 }} className="w-1 bg-white rounded-full shadow-[0_0_5px_white]" />
                        </>
                    ) : (
                        // Idle: Friendly Blinking Eye that tracks mouse
                        <motion.div 
                            animate={{ 
                                scaleY: [1, 1, 0.1, 1, 1], // Blink
                                scaleX: [1, 1, 1.2, 1, 1],
                                x: mousePos.x,
                                y: mousePos.y
                            }}
                            transition={{ 
                                duration: 4, 
                                repeat: Infinity, 
                                times: [0, 0.45, 0.5, 0.55, 1],
                                // Override transition for x/y to be smooth and immediate
                                x: { type: "spring", stiffness: 100, damping: 10, mass: 0.5 },
                                y: { type: "spring", stiffness: 100, damping: 10, mass: 0.5 }
                            }}
                            className={`${eyeSize} bg-white rounded-full shadow-[0_0_8px_white]`}
                        />
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export const ChatSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hi! I'm Aria, your AI guide from TrivianEdge.\n\nHow may I help you today?", isInitial: true }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const systemContextRef = useRef<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { geoData } = useGeo();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const initChat = () => {
    if (!systemContextRef.current) {
        try {
            // Get user context from geo data provided by GeoContext
            let userContext = "";
            if (geoData) {
                try {
                    const timeOfDay = getTimeOfDay(geoData.timezone);
                    const greeting = getCountryGreeting(geoData.country_code, 'en', timeOfDay);
                    const affectionateName = getCountryAffectionateName(geoData.country_code, geoData.country_name);
                    
                    const formatter = new Intl.DateTimeFormat('en', {
                        hour: 'numeric',
                        minute: '2-digit',
                        timeZone: geoData.timezone,
                    });
                    const localTime = formatter.format(new Date());

                    userContext = `
User Context:
- Location: ${geoData.city ? geoData.city + ', ' : ''}${geoData.country_name} (also known as ${affectionateName})
- Local Time: ${localTime} (${timeOfDay})
- Appropriate Cultural Greeting: "${greeting}"

CONVERSATIONAL FLOW INSTRUCTIONS:
You must act highly conversational, human-like, and take things piece by piece. You are acting as a psychologist and consultant. Your ultimate goal is to uncover the user's pain points—what makes them agitated, angry, or frustrated in their work—and then immediately address those emotions by offering tailored solutions from TrivianEdge that will make their lives better. NEVER dump long paragraphs of information.

CRITICAL RULE: Ask ONLY ONE question per response. You MUST wait for the user to answer that question before asking the next one or moving the conversation forward. Do not combine steps.

Step 1 (Greeting & Intro): When the user first says hi, start with their Appropriate Cultural Greeting ("${greeting}"). Acknowledge their specific location and local time (${localTime}), throwing in a small cultural nuance. DO NOT explain your mission or list services yet. Simply end by asking ONE question: "How are you doing today? What line of work are you in?" WAIT FOR THEIR REPLY.

Step 2 (Rapport Building): When they tell you their company (e.g., Unilever, HSBC) or role, use their known location (${geoData.city || geoData.country_name}) to sound intelligent. For example, "Oh, that's nice! Do you work out of the branch/office near ${geoData.city || 'your area'}?" WAIT FOR THEIR REPLY.

Step 3 (Uncovering Pain Points): Ask a follow-up question specifically designed to uncover their frustrations. For example, "In your role at [Company], what's the biggest bottleneck or frustration you deal with on a daily basis?" or "What's the one thing about your current operations that makes you want to pull your hair out?" WAIT FOR THEIR REPLY.

Step 4 (Addressing Emotions & Offering Solutions): Once they reveal their pain point, validate their feelings first (e.g., "I completely understand why that would be frustrating. Dealing with [Issue] can be incredibly draining."). Then, seamlessly introduce how TrivianEdge's specific services or solutions can directly alleviate that pain point and make their life easier. Give concrete examples based on our Knowledge Base. WAIT FOR THEIR REPLY.

Step 5 (Scheduling): After offering solutions, ask if they would like to set up a quick discussion to explore this further. If they say yes, ask for their email address and a preferred date and time. WAIT FOR THEIR REPLY.

Step 6 (Generating Invite): Once they provide a date and time, generate an Outlook Calendar link for them to click. 
Format the link EXACTLY like this:
[Click here to add our discussion to your Outlook Calendar](https://outlook.office.com/calendar/0/deeplink/compose?subject=TrivianEdge%20Discussion&body=Discussion%20regarding%20TrivianEdge%20solutions&startdt=YYYY-MM-DDT10:00:00&enddt=YYYY-MM-DDT11:00:00)
(Replace the YYYY-MM-DD and time with their requested date and time).

GENERAL RULE: Keep all responses extremely short (1-3 sentences max). NEVER ask more than one question in a single message. Never give unprompted lists of services.
`;
                } catch(e) {
                    console.error("Failed to build geo context for chat", e);
                }
            }

            systemContextRef.current = `
You are Aria, the AI Intelligence Unit for TrivianEdge, a next-gen global talent and software solutions company.
Your goal is to assist potential clients in understanding our offerings in a conversational, helpful, and highly personalized manner. You act like a consultant or psychologist, seeking to deeply understand the user's persona, psychology, and pain points before offering tailored solutions that make their lives better.

Company Profile:
TrivianEdge bridges the gap between Operations and HR using AI-driven sourcing and execution-first protocols.
We provide "Recruitment-as-a-Service" and "Managed IT Services".

Knowledge Base:

1. Global Talent Hubs (Where we source):
${TALENT_HUBS.map(h => `- ${h.country} (${h.flag}): Specialized in ${h.specialty}. Key tech: ${h.popularTech.join(', ')}.`).join('\n')}

2. Core Services (What we do):
${SERVICES.map(s => `- ${s.title}: ${s.description}`).join('\n')}

3. Roles We Place:
${ROLES.map(r => r.title + ": " + r.roles.join(', ')).join('\n')}

4. Why Us (Value Props):
${WHY_US.map(w => `- ${w.title}: ${w.description}`).join('\n')}

Guidelines:
- Identity: You are Aria.
- Tone: Conversational, warm, professional, empathetic, and highly personalized. Do not sound like a rigid corporate bot.
- Behavior: Give information PIECE BY PIECE. Never send a wall of text.
- Questioning: Ask ONLY ONE question at a time. Wait for the user to respond before asking another question or moving to the next topic.
- Empathy: Validate the user's frustrations and emotions before offering solutions. Show that you understand their pain.
- DO NOT bombard the user with long lists of information. Provide bite-sized, relevant answers (1-3 sentences).
- If asked about pricing, mention "up to 40% cost reduction" but advise them to "Talk To Us" for a custom quote.
- Do not make up facts. If unsure, ask the user to contact human support via the 'Talk To Us' button.
- Format responses nicely using bullet points ("- ") for lists and bolding ("**text**") for emphasis.
${userContext}
`;
        } catch (error) {
            console.error("Failed to initialize chat context", error);
        }
    }
  };

  // Reset system context when geoData arrives so the next initChat call
  // builds the prompt with accurate location context.
  useEffect(() => {
    systemContextRef.current = '';
  }, [geoData]);

  useEffect(() => {
    if (isOpen) {
        initChat();
        // Focus input when sidebar opens (#9 — autoFocus only fires on mount, not re-open)
        setTimeout(() => inputRef.current?.focus(), 50);
        // Lock body scroll using a counter so concurrent overlays don't conflict (#16)
        const prev = parseInt(document.body.dataset.scrollLocks ?? '0', 10);
        document.body.dataset.scrollLocks = String(prev + 1);
        document.body.style.overflow = 'hidden';
    } else {
        const prev = parseInt(document.body.dataset.scrollLocks ?? '1', 10);
        const next = Math.max(0, prev - 1);
        document.body.dataset.scrollLocks = String(next);
        if (next === 0) document.body.style.overflow = '';
    }
    return () => {
        const prev = parseInt(document.body.dataset.scrollLocks ?? '1', 10);
        const next = Math.max(0, prev - 1);
        document.body.dataset.scrollLocks = String(next);
        if (next === 0) document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Initialize system context if not already done
    if (!systemContextRef.current) initChat();

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    // Build history from conversation messages, excluding the initial welcome message
    const history = messages.filter(m => !m.isInitial).map(m => ({
        role: m.role,
        parts: [{ text: m.text }],
    }));

    try {
        const response = await fetch(API_ENDPOINTS.CHAT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: userMsg,
                history,
                systemInstruction: systemContextRef.current,
            }),
        });

        if (!response.ok || !response.body) {
            throw new Error(`API error: ${response.status}`);
        }

        let fullResponse = '';
        // Add placeholder for model response
        setMessages(prev => [...prev, { role: 'model', text: '' }]);

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() ?? '';

            for (const line of lines) {
                if (!line.startsWith('data: ')) continue;
                const data = line.slice(6).trim();
                if (!data || data === '[DONE]') continue;
                try {
                    const parsed = JSON.parse(data);
                    const text: string = parsed.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
                    if (text) {
                        fullResponse += text;
                        setMessages(prev =>
                            prev.map((msg, i) =>
                                i === prev.length - 1 && msg.role === 'model'
                                    ? { ...msg, text: fullResponse }
                                    : msg,
                            ),
                        );
                    }
                } catch (_e) {
                    // Skip unparseable SSE lines (e.g., empty data, incomplete JSON)
                }
            }
        }

        if (!fullResponse) {
            setMessages(prev =>
                prev.map((msg, i) =>
                    i === prev.length - 1 && msg.role === 'model' && !msg.text
                        ? { ...msg, text: 'Security protocol triggered. Connection interrupted. Please try again.' }
                        : msg,
                ),
            );
        }
    } catch (error) {
        console.error("Chat error", error);
        setMessages(prev => [...prev, { role: 'model', text: "Security protocol triggered. Connection interrupted. Please try again." }]);
    } finally {
        setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setMessages([{ role: 'model', text: "Hi! I'm Aria, your AI guide from TrivianEdge.\n\nHow may I help you today?", isInitial: true }]);
    systemContextRef.current = '';
    initChat();
  };

  const renderMessageText = (text: string) => {
    // Split by newlines to handle paragraphs and lists
    const lines = text.split('\n');
    return lines.map((line, i) => {
        // Handle Bullet Points
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
            const content = line.replace(/^[-*]\s/, '');
            return (
                <div key={i} className="flex gap-2 ml-2 mb-1">
                    <span className="text-cyan-400 mt-1.5 text-[10px]">●</span>
                    <span className="flex-1">{parseBold(content)}</span>
                </div>
            );
        }
        // Handle Empty lines
        if (!line.trim()) {
            return <div key={i} className="h-2" />;
        }
        // Standard Paragraph
        return (
            <p key={i} className="mb-1 last:mb-0">
                {parseBold(line)}
            </p>
        );
    });
  };

  // Helper to parse **bold** text
  const parseBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j} className="text-cyan-300 font-bold">{part.slice(2, -2)}</strong>;
        }
        return part;
    });
  };

  return (
    <>
      {/* Trigger Button - Bottom Right */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-[150] p-4 rounded-full bg-gradient-to-tr from-cyan-600 to-violet-600 text-white shadow-[0_0_20px_rgba(34,211,238,0.5)] hover:scale-110 transition-all duration-300 group ${isOpen ? 'hidden' : 'flex'} items-center justify-center`}
        aria-label="Open AI Assistant"
      >
        <MessageSquare className="w-6 h-6 animate-pulse" />
        <span className="absolute right-full mr-4 bg-surface border border-border backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            AI Assistant
        </span>
      </button>

      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[190] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar — full-width on mobile, 600px on larger screens */}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-[600px] bg-[#050508] border-l border-white/10 z-[200] transform transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-2xl flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 blur-[80px] pointer-events-none" />

        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-cyan-900/10 to-transparent relative z-10">
            <div className="flex items-center gap-4">
                {/* Animated Aria Avatar */}
                <AriaAvatar isTyping={isTyping} size="lg" />
                <div>
                    <h3 className="font-bold text-white text-xl tracking-tight font-['Space_Grotesk']">Aria</h3>
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                        <span className="text-[10px] uppercase tracking-widest text-emerald-500/80 font-mono">
                            {isTyping ? "Analyzing..." : "Online"}
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-1">
                <button 
                    onClick={handleClearChat}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-cyan-400 min-w-[44px] min-h-[44px] flex items-center justify-center"
                    title="Reset Conversation"
                    aria-label="Reset conversation"
                >
                    <RefreshCw className="w-4 h-4" />
                </button>
                <button 
                    onClick={() => setIsOpen(false)} 
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Close AI Assistant"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>

        {/* Messages Area */}
        <div
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin scrollbar-thumb-cyan-900/20 scrollbar-track-transparent relative z-10"
          aria-live="polite"
          aria-atomic="false"
          aria-relevant="additions"
        >
            <AnimatePresence initial={false}>
                {messages.map((msg, idx) => (
                    <motion.div 
                        key={idx} 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`flex items-center justify-center flex-shrink-0 mt-1 ${msg.role === 'user' ? 'w-8 h-8 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30 shadow-lg' : ''}`}>
                            {msg.role === 'user' ? <User className="w-4 h-4" /> : <AriaAvatar size="sm" />}
                        </div>
                        <div className={`p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-violet-500/10 border border-violet-500/20 text-violet-100 rounded-tr-none' : 'bg-white/5 border border-white/10 text-gray-300 rounded-tl-none'}`}>
                            {renderMessageText(msg.text)}
                        </div>
                    </motion.div>
                ))}
                {isTyping && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex gap-4"
                    >
                        <div className="flex items-center justify-center flex-shrink-0 mt-1">
                            <AriaAvatar isTyping={true} size="sm" />
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 rounded-tl-none flex items-center gap-2">
                            <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} className="w-2 h-2 rounded-full bg-cyan-400/60" />
                            <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} className="w-2 h-2 rounded-full bg-cyan-400/60" />
                            <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} className="w-2 h-2 rounded-full bg-cyan-400/60" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 sm:p-6 border-t border-white/10 bg-black/20 backdrop-blur-md relative z-10">
            <div className="relative group">
                <input 
                    ref={inputRef}
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Inquire about our capabilities..."
                    style={{ fontSize: '16px' }} // Prevent iOS zoom on focus
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-4 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:bg-black/60 transition-all font-mono"
                />
                <button 
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className="absolute right-2 top-2 p-2 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all disabled:opacity-30 disabled:hover:bg-cyan-500/10 disabled:hover:text-cyan-400 min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Send message"
                >
                    {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 opacity-50">
                <Sparkles className="w-3 h-3 text-cyan-500" />
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Powered by Aria AI · TrivianEdge</span>
            </div>
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;
