import React, { useRef, useEffect } from 'react';
import { ArrowRight, Network, MessageSquare } from 'lucide-react';
import { TalentHub } from '../types';

// ---------------------------------------------------------------------------
// Shared scroll bus — a single window scroll listener that fans out to all
// registered card update callbacks. This replaces one listener per card (#23).
// ---------------------------------------------------------------------------
type ScrollCallback = () => void;
const scrollCallbacks = new Set<ScrollCallback>();
let sharedScrollAttached = false;

function registerScrollCallback(cb: ScrollCallback): () => void {
  if (!sharedScrollAttached) {
    window.addEventListener('scroll', () => scrollCallbacks.forEach(fn => fn()), { passive: true });
    sharedScrollAttached = true;
  }
  scrollCallbacks.add(cb);
  cb(); // run once on mount
  return () => scrollCallbacks.delete(cb);
}

const TalentHubCard: React.FC<{ hub: TalentHub; index: number; onClick: (hub: TalentHub) => void }> = ({ hub, index, onClick }) => {
  const cardRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const update = () => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const centerOffset = (rect.top + rect.height / 2) - (viewportHeight / 2);
      const progress = centerOffset / (viewportHeight / 2);
      cardRef.current.style.setProperty('--p-offset-1', `${progress * -60}px`);
      cardRef.current.style.setProperty('--p-offset-2', `${progress * 30}px`);
    };
    return registerScrollCallback(update);
  }, []);

  return (
    <button
      ref={cardRef}
      type="button"
      onClick={() => onClick(hub)}
      className="reveal glass tilt-card w-full text-left p-8 md:p-10 rounded-[2.5rem] border-border hover-neon-glow relative overflow-hidden group"
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
          <div className="text-4xl transition-all duration-700 transform group-hover:scale-110">{hub.flag}</div>
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

export default TalentHubCard;
