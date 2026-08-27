import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import Logo from '../components/Logo';

const COOKIEYES_PRIVACY_SCRIPT_ID = 'cky-privacy-policy';
const COOKIEYES_PRIVACY_SCRIPT_SRC = 'https://cdn-cookieyes.com/client_data/e7db7682b4d8ef7aafc06f6320d50a3c/privacy-policy/script.js';

// Same mechanism as pages/CookiePolicyPage.tsx (confirmed by reading this
// script's source directly): it finds itself via
// getElementById('cky-privacy-policy') and inserts the generated policy as
// the next sibling via insertAdjacentHTML('afterend', ...), so the script
// tag must live inside this container (not document.body) for the content
// to land in the styled card below. It also fetches
// cdn-cookieyes.com/.../privacy-policy/<lang>.json, already allowed under
// connect-src in src/worker.ts and index.html's CSP.
const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const script = document.createElement('script');
    script.id = COOKIEYES_PRIVACY_SCRIPT_ID;
    script.type = 'text/javascript';
    script.src = COOKIEYES_PRIVACY_SCRIPT_SRC;
    container.appendChild(script);
    return () => {
      container.replaceChildren();
    };
  }, []);

  return (
    <div className="bg-background min-h-screen text-text px-4 md:px-6 py-16 md:py-32">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted hover:text-cyan-400 transition-colors mb-12 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">Back to Home</span>
        </button>

        <div className="flex items-center gap-4 mb-12 reveal">
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
            <ShieldCheck className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-text">Privacy Protocol</h1>
            <p className="text-muted text-sm font-mono mt-1">TrivianEdge Global Privacy Policy</p>
          </div>
        </div>

        <div ref={containerRef} className="glass p-10 md:p-16 rounded-[3rem] border-border reveal cookieyes-generated-content" style={{ transitionDelay: '80ms' }} />

        <div className="mt-16 text-center">
          <Logo onClick={() => navigate('/')} />
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
