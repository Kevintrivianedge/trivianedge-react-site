
import React, { useEffect } from 'react';
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

export const TalentHubModal: React.FC<TalentHubModalProps> = ({ hub, onClose }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <motion.div 
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-[#020203] border border-border rounded-[2.5rem] shadow-2xl shadow-cyan-900/20 scrollbar-hide"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
      >
        {/* Decorative Gradients */}
        <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl ${hub.gradient} opacity-20 blur-[100px] pointer-events-none`} />
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-surface border border-border text-muted hover:text-white hover:bg-white/10 transition-colors z-20"
        >
          <X className="w-6 h-6" />
        </button>

        <motion.div 
          className="p-8 md:p-12 relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-8 items-start mb-10 pb-10 border-b border-border">
            <div className="text-8xl flex-shrink-0 select-none drop-shadow-2xl transform hover:scale-110 transition-transform duration-500 cursor-default">{hub.flag}</div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                Global Talent Node
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-text mb-4">{hub.country}</h2>
              <p className="text-xl text-cyan-400 font-mono mb-6">{hub.specialty}</p>
              <p className="text-muted text-lg leading-relaxed max-w-2xl">{hub.description}</p>
            </div>
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
            <button className="group flex items-center gap-3 px-8 py-4 bg-white text-black rounded-xl font-bold uppercase tracking-widest hover:bg-cyan-400 hover:text-white transition-all shadow-lg hover:shadow-cyan-400/20">
                <span>Initiate Hiring Protocol</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
         </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};
