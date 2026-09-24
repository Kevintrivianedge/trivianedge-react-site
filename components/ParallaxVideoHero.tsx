import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface ParallaxVideoHeroProps {
  videoUrl?: string;
  posterUrl?: string;
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export const ParallaxVideoHero: React.FC<ParallaxVideoHeroProps> = ({
  videoUrl,
  posterUrl,
  title = 'Global Talent Solutions',
  subtitle = 'Engineered for the future',
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const elementTop = rect.top;
      const elementHeight = rect.height;
      const windowHeight = window.innerHeight;

      // Calculate parallax offset (negative offset pushes content up)
      const scrollAmount = Math.max(0, windowHeight - elementTop) * 0.5;
      const progress = Math.min(1, (windowHeight - elementTop) / (windowHeight + elementHeight));

      setScrollProgress(progress);

      // Apply parallax to video (moves slower than scroll)
      if (videoRef.current) {
        videoRef.current.style.transform = `translateY(${scrollAmount * 0.3}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen overflow-hidden"
      style={{ perspective: '1000px' }}
    >
      {/* Parallax Video Background */}
      <motion.div
        className="absolute inset-0 w-full h-full overflow-hidden -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {videoUrl ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={posterUrl}
            style={{
              willChange: 'transform',
            }}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : (
          <div
            className="w-full h-full bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900"
            style={{
              backgroundImage: posterUrl
                ? `url(${posterUrl})`
                : 'linear-gradient(135deg, rgba(0, 15, 30, 0.8) 0%, rgba(77, 188, 159, 0.1) 100%)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )}
      </motion.div>

      {/* Dynamic Gradient Overlay - Synced with scroll */}
      <motion.div
        className="absolute inset-0 -z-5"
        animate={{
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          background: `linear-gradient(135deg, rgba(0, 20, 40, ${0.3 + scrollProgress * 0.3}) 0%, rgba(77, 188, 159, ${0.05 + scrollProgress * 0.15}) 100%)`,
        }}
      />

      {/* Animated grid pattern */}
      <div className="absolute inset-0 -z-5 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
            backgroundSize: '100px 100px',
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 h-screen flex flex-col items-center justify-center px-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-8"
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Premium Experience
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {title}
            <motion.span
              className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            >
              {subtitle}
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Seamless integration of global talent, compliance management, and custom software development.
          </motion.p>

          {/* CTA Buttons */}
          {children || (
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <button className="px-8 py-4 rounded-2xl font-bold text-lg bg-cyan-400 text-black hover:bg-cyan-300 transition-colors">
                Get Started
              </button>
              <button className="px-8 py-4 rounded-2xl font-bold text-lg border border-white/30 text-white hover:border-white/60 hover:bg-white/5 transition-colors">
                Learn More
              </button>
            </motion.div>
          )}
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{
            y: [0, 12, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <p className="text-white/60 text-sm font-medium">Scroll to explore</p>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-2 bg-white rounded-full mt-2"
              animate={{
                y: [0, 6, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll-linked parallax intensity indicator */}
      <motion.div
        className="absolute top-0 left-0 h-1 bg-gradient-to-r from-cyan-400 to-emerald-400"
        style={{
          width: `${scrollProgress * 100}%`,
          zIndex: 20,
        }}
      />
    </section>
  );
};

export default ParallaxVideoHero;
