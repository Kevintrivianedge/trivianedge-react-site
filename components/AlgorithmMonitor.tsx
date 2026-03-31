import React from 'react';
import { AlgorithmSignals } from '../utils/algorithmIntelligence';

interface AlgorithmMonitorProps {
  signals: AlgorithmSignals | null;
  recommendations: string[];
}

function vitalColor(value: number, good: number, needs: number): string {
  if (value === 0) return 'text-gray-400';
  if (value <= good) return 'text-emerald-400';
  if (value <= needs) return 'text-amber-400';
  return 'text-red-400';
}

function clsColor(value: number): string {
  if (value === 0) return 'text-gray-400';
  if (value <= 0.1) return 'text-emerald-400';
  if (value <= 0.25) return 'text-amber-400';
  return 'text-red-400';
}

/**
 * Dev-only floating panel for monitoring SEO signals.
 * Hidden in production via import.meta.env.DEV check.
 */
const AlgorithmMonitor: React.FC<AlgorithmMonitorProps> = ({ signals, recommendations }) => {
  const [collapsed, setCollapsed] = React.useState(false);

  if (!(import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV) return null;
  if (!signals) {
    return (
      <div className="fixed bottom-4 left-4 z-[9999] bg-black/90 border border-white/10 rounded-xl p-3 text-[10px] font-mono text-white/50 backdrop-blur-md">
        [SEO] Measuring vitals…
      </div>
    );
  }

  const { lcp, cls, inp } = signals.coreWebVitals;

  return (
    <div className="fixed bottom-4 left-4 z-[9999] bg-black/90 border border-white/10 rounded-xl backdrop-blur-md max-w-xs w-full shadow-xl text-[10px] font-mono">
      {/* Header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-3 py-2 text-cyan-400 hover:bg-white/5 rounded-xl transition-colors"
      >
        <span className="font-bold uppercase tracking-widest">[SEO] Algorithm Monitor</span>
        <span>{collapsed ? '▲' : '▼'}</span>
      </button>

      {!collapsed && (
        <div className="px-3 pb-3 space-y-3">
          {/* Engine */}
          <div className="flex justify-between border-t border-white/10 pt-2">
            <span className="text-white/50">Engine Detected</span>
            <span className="text-cyan-300 uppercase">{signals.engine}</span>
          </div>

          {/* Network */}
          <div className="flex justify-between">
            <span className="text-white/50">Network</span>
            <span className="text-violet-300 uppercase">{signals.networkQuality}</span>
          </div>

          {/* Core Web Vitals */}
          <div className="border-t border-white/10 pt-2 space-y-1">
            <p className="text-white/40 uppercase tracking-widest mb-1">Core Web Vitals</p>
            <div className="flex justify-between">
              <span className="text-white/50">LCP</span>
              <span className={vitalColor(lcp, 2500, 4000)}>
                {lcp > 0 ? `${lcp.toFixed(0)}ms` : '—'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">CLS</span>
              <span className={clsColor(cls)}>{cls.toFixed(4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">INP</span>
              <span className={vitalColor(inp, 200, 500)}>
                {inp > 0 ? `${inp.toFixed(0)}ms` : '—'}
              </span>
            </div>
          </div>

          {/* Schema */}
          <div className="flex justify-between border-t border-white/10 pt-2">
            <span className="text-white/50">Schema Detected</span>
            <span className={signals.schemaValid ? 'text-emerald-400' : 'text-red-400'}>
              {signals.schemaValid ? 'Yes ✓' : 'No ✗'}
            </span>
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="border-t border-white/10 pt-2 space-y-1">
              <p className="text-white/40 uppercase tracking-widest mb-1">Recommendations</p>
              {recommendations.slice(0, 5).map((rec, i) => (
                <p key={i} className="text-white/60 leading-relaxed">{rec}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AlgorithmMonitor;
