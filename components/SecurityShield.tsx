import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield } from 'lucide-react';

interface ShieldLayer {
  id: number;
  label: string;
  sublabel: string;
  color: string;
  ringColor: string;
  prevents: string[];
  size: string;
}

const LAYERS: ShieldLayer[] = [
  {
    id: 1,
    label: 'Audit Logging',
    sublabel: 'Outer layer',
    color: 'text-cyan-400',
    ringColor: 'border-cyan-400/30 bg-cyan-500/5 hover:border-cyan-400/60 hover:bg-cyan-500/10',
    prevents: [
      'Undetected unauthorized access',
      'Retroactive tampering with records',
      'Compliance reporting gaps',
      'Forensic blind spots during incidents',
    ],
    size: 'w-full',
  },
  {
    id: 2,
    label: 'IP Protection',
    sublabel: 'Layer 3',
    color: 'text-violet-400',
    ringColor: 'border-violet-400/30 bg-violet-500/5 hover:border-violet-400/60 hover:bg-violet-500/10',
    prevents: [
      'Code ownership disputes',
      'IP leakage to third parties',
      'Unlicensed reuse of client assets',
      'Contractor IP ambiguity',
    ],
    size: 'w-[83%]',
  },
  {
    id: 3,
    label: 'Secure SDLC',
    sublabel: 'Layer 2',
    color: 'text-emerald-400',
    ringColor: 'border-emerald-400/30 bg-emerald-500/5 hover:border-emerald-400/60 hover:bg-emerald-500/10',
    prevents: [
      'Vulnerabilities introduced at build time',
      'Unreviewed code reaching production',
      'Dependency supply-chain attacks',
      'OWASP Top 10 risks in delivered software',
    ],
    size: 'w-[66%]',
  },
  {
    id: 4,
    label: 'Access Control',
    sublabel: 'Core',
    color: 'text-orange-400',
    ringColor: 'border-orange-400/30 bg-orange-500/5 hover:border-orange-400/60 hover:bg-orange-500/10',
    prevents: [
      'Privilege escalation by contractors',
      'Lateral movement after initial breach',
      'Shared credential abuse',
      'Unauthorized production deployments',
    ],
    size: 'w-[50%]',
  },
];

const SecurityShield: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<ShieldLayer | null>(null);

  return (
    <div className="glass rounded-[2.5rem] border border-border p-8 md:p-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 mb-1">
          Security/IP Shield
        </p>
        <h3 className="text-xl md:text-2xl font-bold text-text">
          Four layers of protection on every engagement
        </h3>
        <p className="text-muted text-sm mt-1">
          Hover or tap any layer to see what it prevents.
        </p>
      </div>

      {/* Shield visual — concentric rings stacked */}
      <div className="flex flex-col items-center gap-3 mb-8">
        {LAYERS.map(layer => (
          <motion.button
            key={layer.id}
            onHoverStart={() => setActiveLayer(layer)}
            onHoverEnd={() => setActiveLayer(a => (a?.id === layer.id ? null : a))}
            onClick={() => setActiveLayer(a => (a?.id === layer.id ? null : layer))}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.15 }}
            className={[
              'mx-auto rounded-2xl border-2 transition-all duration-200 cursor-pointer px-6 py-4',
              layer.size,
              layer.ringColor,
              activeLayer?.id === layer.id ? 'ring-1 ring-inset ring-current shadow-lg' : '',
            ].join(' ')}
            aria-pressed={activeLayer?.id === layer.id}
            aria-label={`${layer.label}: click to see what this prevents`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className={`w-4 h-4 flex-shrink-0 ${layer.color}`} />
                <span className={`font-bold text-sm ${layer.color}`}>{layer.label}</span>
              </div>
              <span className="text-[10px] text-muted font-mono uppercase tracking-widest hidden sm:block">
                {layer.sublabel}
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        {activeLayer ? (
          <motion.div
            key={activeLayer.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="p-6 rounded-2xl bg-surface border border-border"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-3">
              {activeLayer.label} — what it prevents
            </p>
            <ul className="space-y-2">
              {activeLayer.prevents.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted">
                  <span className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${activeLayer.color.replace('text-', 'bg-')}`} />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="p-5 rounded-2xl bg-surface/50 border border-border text-center"
          >
            <p className="text-muted text-sm">
              Hover or tap a layer to see what it protects against.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SecurityShield;
