import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LogoIconLarge = ({ className = "w-24 h-24" }: { className?: string }) => (
  <svg viewBox="0 0 320 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <motion.path 
      d="M0 35L75 35L55 5L0 35Z" 
      fill="#60B46D"
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    />
    <motion.path 
      d="M60 5L150 5L150 95L60 5Z" 
      fill="#4DBC9F" 
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
    />
    <motion.path 
      d="M160 95L160 5L250 5L160 95Z" 
      fill="#46C5B3" 
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
    />
    <motion.path 
      d="M235 35L310 35L255 5L235 35Z" 
      fill="#40C9C8" 
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
    />
  </svg>
);

export const Preloader: React.FC = () => {
  // Use a unique session key version to ensure it shows up for the user this time
  const SESSION_KEY = 'trivian_intro_shown_v2';
  
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      // If key exists, return false (don't show). Otherwise true.
      return !sessionStorage.getItem(SESSION_KEY);
    }
    return true;
  });

  useEffect(() => {
    if (!isVisible) return;

    // Run the animation for 2.5 seconds, then hide
    const timer = setTimeout(() => {
      setIsVisible(false);
      try {
        sessionStorage.setItem(SESSION_KEY, 'true');
      } catch (e) {
        // ignore storage errors
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background text-text overflow-hidden px-6"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.8, ease: "easeInOut" } 
          }}
        >
          {/* Ambient Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/10 via-transparent to-violet-900/10 pointer-events-none" />
          
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100px_100px]" />

          <div className="relative z-10 flex flex-col items-center max-w-4xl text-center">
            
            {/* Logo Animation */}
            <div className="mb-8">
              <LogoIconLarge className="w-24 h-16 md:w-32 md:h-24" />
            </div>

            {/* Brand Name Build */}
            <div className="overflow-hidden mb-4">
              <motion.h1 
                className="text-4xl md:text-6xl font-bold font-['Space_Grotesk'] tracking-tight"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "circOut" }}
              >
                Trivian<span className="text-muted">Edge</span>
              </motion.h1>
            </div>

            {/* Core Tagline */}
            <motion.p 
              className="text-lg md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-500 mb-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Engineering the Future of Talent & Technology
            </motion.p>

            {/* SEO & Strategic Subheading */}
            <motion.div
              className="max-w-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <p className="text-[10px] md:text-xs text-muted font-mono uppercase tracking-widest leading-relaxed">
                Optimizing <span className="text-cyan-400/80">Global Talent Solutions</span> and <span className="text-violet-400/80">AI Automation</span> alongside <span className="text-cyan-400/80">Cybersecurity</span> & <span className="text-text/60">Cloud DevOps</span> to build the next generation of <span className="text-violet-400/80">Software & Mobile Development</span>.
              </p>
            </motion.div>

            {/* Loading Bar */}
            <motion.div 
              className="mt-12 h-0.5 bg-surface rounded-full w-32 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div 
                className="h-full bg-gradient-to-r from-cyan-400 to-violet-500"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
