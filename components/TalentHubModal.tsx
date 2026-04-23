
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, Clock, GraduationCap, Wifi, MessageSquare, Building2, CheckCircle2, Code2, ArrowRight } from 'lucide-react';
import { TalentHub } from '../types';

interface TalentHubModalProps {
  hub: TalentHub;
  onClose: () => void;
}

const InfoRow = ({ icon, label, text }: { icon: React.ReactNode, label: string, text: string }) => (
  <div className="flex gap-4">
    <div className="flex-shrink-0 mt-1 p-2 rounded-xl bg-surface border border-border text-cyan-400">
      {icon}
    </div>
    <div>
      <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted mb-1">{label}</h4>
      <p className="text-sm text-text leading-relaxed">{text}</p>
    </div>
  </div>
);

const MODAL_TITLE_ID = 'talent-hub-modal-title';

export const TalentHubModal: React.FC<TalentHubModalProps> = ({ hub, onClose }) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Prevent body scroll when modal is open — uses a counter so concurrent overlays
  // (e.g. ChatSidebar) don't prematurely clear the lock when one of them closes (#16).
  useEffect(() => {
    const prev = parseInt(document.body.dataset.scrollLocks ?? '0', 10);
    document.body.dataset.scrollLocks = String(prev + 1);
    document.body.style.overflow = 'hidden';
    return () => {
      const next = Math.max(0, parseInt(document.body.dataset.scrollLocks ?? '1', 10) - 1);
      document.body.dataset.scrollLocks = String(next);
      if (next === 0) document.body.style.overflow = '';
    };
  }, []);

  // Focus the close button when modal opens so keyboard users can act immediately.
  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  // Close on Escape key.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      // Trap focus inside the modal.
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ).filter(el => !el.hasAttribute('disabled') && el.tabIndex >= 0);
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Animation variants for staggered reveal
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={MODAL_TITLE_ID}
      className="fixed inset-0 z-[200] flex items-center justify-center p-0 sm:p-4"
    >
      {/* Backdrop */}
      <motion.div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Content — full screen on mobile, max-w-5xl on larger screens */}
      <motion.div 
        className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-5xl overflow-y-auto bg-[#020203] border-0 sm:border sm:border-border rounded-none sm:rounded-[2.5rem] shadow-2xl shadow-cyan-900/20 scrollbar-hide"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
      >
        {/* Hero header strip — gradient with flag watermark */}
        <div className={`relative h-36 sm:h-48 overflow-hidden rounded-none sm:rounded-t-[2.5rem] bg-gradient-to-br ${hub.gradient}`}>
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute -right-6 -top-4 text-[160px] leading-none opacity-[0.18] select-none pointer-events-none">
            {hub.flag}
          </div>
          <div className="absolute inset-0 flex items-end p-6 sm:p-10">
            <div className="flex items-end gap-5">
              <span className="text-7xl sm:text-[5.5rem] drop-shadow-2xl select-none leading-none">{hub.flag}</span>
              <div className="pb-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-[9px] font-bold uppercase tracking-widest mb-2">
                  Global Talent Node
                </div>
                <h2 id={MODAL_TITLE_ID} className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">{hub.country}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative glow below header */}
        <div className={`absolute top-0 left-0 w-full h-80 bg-gradient-to-b ${hub.gradient} opacity-[0.08] blur-3xl pointer-events-none`} aria-hidden="true" />

        {/* Close Button */}
        <button 
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-white/80 hover:text-white hover:bg-black/70 transition-colors z-20 min-w-[40px] min-h-[40px] flex items-center justify-center"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <motion.div 
          className="p-8 md:p-12 relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Specialty + Description */}
          <motion.div variants={itemVariants} className="mb-10 pb-10 border-b border-border">
            <p className="text-xl text-cyan-400 font-mono mb-4">{hub.specialty}</p>
            <p className="text-muted text-lg leading-relaxed max-w-2xl">{hub.description}</p>
          </motion.div>

          {/* Grid Layout */}
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-10 mb-8">
            
            {/* Column 1: Core Infrastructure */}
            <motion.div variants={itemVariants} className="space-y-8">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-violet-400" />
                Operational Landscape
              </h3>
              
              <InfoRow 
                icon={<Wifi className="w-5 h-5" />}
                label="Digital Infrastructure"
                text={hub.infrastructure}
              />
              
              <InfoRow 
                icon={<MessageSquare className="w-5 h-5" />}
                label="Communication & Culture"
                text={hub.communication}
              />

              <InfoRow 
                icon={<Clock className="w-5 h-5" />}
                label="Time Zone Alignment"
                text={hub.timeZoneAlignment}
              />
            </motion.div>

            {/* Column 2: Talent & Education */}
            <motion.div variants={itemVariants} className="space-y-8">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-violet-400" />
                Talent Composition
              </h3>

              <div className="p-6 rounded-2xl bg-surface border border-border hover:border-cyan-500/30 transition-colors group">
                 <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted mb-3 flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-cyan-400 group-hover:scale-110 transition-transform" /> Key Innovation Hubs
                 </h4>
                 <div className="flex flex-wrap gap-2">
                    {hub.keyCities.map(city => (
                        <span key={city} className="px-3 py-1 bg-surface border border-border rounded-lg text-xs font-medium text-text hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-colors cursor-default">
                            {city}
                        </span>
                    ))}
                 </div>
              </div>

              <div className="p-6 rounded-2xl bg-surface border border-border hover:border-cyan-500/30 transition-colors group">
                 <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted mb-3 flex items-center gap-2">
                    <GraduationCap className="w-3 h-3 text-cyan-400 group-hover:scale-110 transition-transform" /> Education Focus
                 </h4>
                 <p className="text-sm text-text leading-relaxed mb-4">{hub.educationFocus}</p>

                 <div className="pt-4 border-t border-border/50">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted mb-3 flex items-center gap-2">
                        <Code2 className="w-3 h-3 text-cyan-400" /> Tech Stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {hub.popularTech.map((tech, idx) => (
                            <span key={idx} className="px-2 py-1.5 rounded-md bg-cyan-900/20 border border-cyan-500/20 text-[10px] font-mono text-cyan-300 hover:bg-cyan-500/20 hover:text-cyan-200 transition-colors cursor-default">
                                {tech}
                            </span>
                        ))}
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
          
          {/* Footer Action */}
          <motion.div variants={itemVariants} className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-muted font-mono uppercase tracking-widest">Pipeline Active • Ready for Deployment</span>
            </div>
            <button
              onClick={() => {
                onClose();
                setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 300);
              }}
              className="group flex items-center gap-3 px-8 py-4 bg-white text-black rounded-xl font-bold uppercase tracking-widest hover:bg-cyan-400 hover:text-white transition-all shadow-lg hover:shadow-cyan-400/20"
            >
                <span>Initiate Hiring Protocol</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
         </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};
