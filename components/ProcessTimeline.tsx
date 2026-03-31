import React, { useState } from 'react';
import { ChevronRight, Activity } from 'lucide-react';
import { STEPS } from '../constants';

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

export default ProcessTimeline;
