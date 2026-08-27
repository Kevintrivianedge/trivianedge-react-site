import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Cookie } from 'lucide-react';
import Logo from '../components/Logo';

const COOKIEYES_POLICY_SCRIPT_ID = 'cky-cookie-policy';
const COOKIEYES_POLICY_SCRIPT_SRC = 'https://cdn-cookieyes.com/client_data/e7db7682b4d8ef7aafc06f6320d50a3c/cookie-policy/script.js';

// This script doesn't look for a pre-existing target div (an earlier version
// of this page assumed a #cky-auto-cookie-policy container, which the script
// never actually references — confirmed by reading the script's source
// directly). Instead it does:
//   document.getElementById('cky-cookie-policy').insertAdjacentHTML('afterend', ...)
// i.e. it finds itself by id and inserts the generated policy as the next
// sibling. So the script tag must live inside this container (not
// document.body) for the generated content to land in the styled card below
// rather than at the very end of the page.
const CookiePolicyPage: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const script = document.createElement('script');
    script.id = COOKIEYES_POLICY_SCRIPT_ID;
    script.type = 'text/javascript';
    script.src = COOKIEYES_POLICY_SCRIPT_SRC;
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
            <Cookie className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-text">Cookie Policy</h1>
            <p className="text-muted text-sm font-mono mt-1">TrivianEdge Global Cookie Policy</p>
          </div>
        </div>

        <div ref={containerRef} className="glass p-10 md:p-16 rounded-[3rem] border-border reveal cookie-policy-content" style={{ transitionDelay: '80ms' }} />

        <div className="mt-16 text-center">
          <Logo onClick={() => navigate('/')} />
        </div>
      </div>
    </div>
  );
};

export default CookiePolicyPage;
