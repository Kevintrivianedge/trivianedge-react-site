import React, { useRef, useEffect } from 'react';
import { ArrowRight, MapPin, Clock } from 'lucide-react';
import { TalentHub } from '../types';

// ---------------------------------------------------------------------------
// Shared scroll bus — a single window scroll listener that fans out to all
// registered card update callbacks. This replaces one listener per card (#23).
// ---------------------------------------------------------------------------
type ScrollCallback = () => void;
const scrollCallbacks = new Set<ScrollCallback>();
let sharedScrollHandler: (() => void) | null = null;

function registerScrollCallback(cb: ScrollCallback): () => void {
  if (!sharedScrollHandler) {
    sharedScrollHandler = () => scrollCallbacks.forEach(fn => fn());
    window.addEventListener('scroll', sharedScrollHandler, { passive: true });
  }
  scrollCallbacks.add(cb);
  cb(); // run once on mount
  return () => {
    scrollCallbacks.delete(cb);
    // Remove the shared listener when no cards are mounted
    if (scrollCallbacks.size === 0 && sharedScrollHandler) {
      window.removeEventListener('scroll', sharedScrollHandler);
      sharedScrollHandler = null;
    }
  };
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
      cardRef.current.style.setProperty('--p-offset-1', `${progress * -40}px`);
    };
    return registerScrollCallback(update);
  }, []);

  return (
    <button
      ref={cardRef}
      type="button"
      onClick={() => onClick(hub)}
      className="reveal w-full text-left group relative overflow-hidden rounded-[2rem] border border-border bg-surface transition-all duration-500 hover:shadow-2xl hover:shadow-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border/70"
      style={{ transitionDelay: `${index * 80}ms` } as React.CSSProperties}
    >
      {/* Gradient accent bar on the left */}
      <div
        className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${hub.gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-500`}
      />

      {/* Parallax glow blob — opacity transition on hover; blur removed to avoid
          triggering a new compositing layer on every hover on mobile GPUs. */}
      <div
        className={`absolute -top-16 -right-16 w-64 h-64 bg-gradient-to-br ${hub.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none rounded-full`}
        style={{ transform: 'translate3d(0, var(--p-offset-1, 0), 0)', willChange: 'transform' }}
      />

      <div className="relative z-10 p-7">
        {/* Header row */}
        <div className="flex items-start justify-between mb-5">
          <img
            src={`https://flagcdn.com/w80/${hub.flagCode}.png`}
            width={48}
            height={36}
            alt={hub.country}
            loading="lazy"
            className="rounded-md object-cover shadow-md transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3"
          />
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
            <span className="text-[10px] font-bold text-text/70 uppercase tracking-widest">Explore</span>
            <ArrowRight className="w-3.5 h-3.5 text-text/70" />
          </div>
        </div>

        {/* Country + specialty */}
        <h3 className="text-2xl font-bold text-text mb-1 leading-tight">{hub.country}</h3>
        <p className="text-text/70 font-mono text-[10px] uppercase tracking-[0.22em] mb-4">{hub.specialty}</p>

        {/* Description */}
        <p className="text-muted text-sm leading-relaxed mb-5 line-clamp-3">{hub.description}</p>

        {/* Tech tag pills */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {hub.popularTech.slice(0, 3).map(tech => (
            <span
              key={tech}
              className="px-2 py-1 text-[10px] font-mono bg-surface border border-border rounded-md text-text/70 transition-colors"
            >
              {tech}
            </span>
          ))}
          {hub.popularTech.length > 3 && (
            <span className="px-2 py-1 text-[10px] font-mono text-muted rounded-md">
              +{hub.popularTech.length - 3}
            </span>
          )}
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between pt-4 border-t border-border/60 gap-4">
          <div className="flex items-center gap-1.5 min-w-0">
            <Clock className="w-3 h-3 text-muted flex-shrink-0" />
            <span className="text-[10px] font-mono text-muted truncate">{hub.timeZoneAlignment}</span>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <MapPin className="w-3 h-3 text-muted" />
            <span className="text-[10px] text-muted font-mono">{hub.keyCities[0]}</span>
          </div>
        </div>
      </div>
    </button>
  );
};

export default TalentHubCard;
