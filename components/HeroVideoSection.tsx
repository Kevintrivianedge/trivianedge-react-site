import React, { useRef, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import HeroNetworkVisual from './HeroNetworkVisual';

interface HeroVideoSectionProps {
  videoSrc?: string;
  fallbackImageSrc?: string;
  overlayGradient?: string;
  children: React.ReactNode;
}

export const HeroVideoSection: React.FC<HeroVideoSectionProps> = ({
  videoSrc,
  fallbackImageSrc,
  overlayGradient = 'linear-gradient(135deg, rgba(0, 20, 40, 0.4) 0%, rgba(0, 30, 60, 0.5) 100%)',
  children,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [videoReady, setVideoReady] = useState(!videoSrc);

  useEffect(() => {
    if (!videoRef.current || !videoSrc) return;

    const video = videoRef.current;
    const handleCanPlay = () => setVideoReady(true);

    video.addEventListener('canplay', handleCanPlay);
    return () => video.removeEventListener('canplay', handleCanPlay);
  }, [videoSrc]);

  return (
    <section
      aria-label="Hero"
      className="hero-dark hero-fade-out relative min-h-screen sm:min-h-0 lg:min-h-screen flex flex-col px-4 sm:px-6 overflow-hidden"
    >
      {/* VIDEO BACKGROUND — Autoplay muted for premium feel */}
      {videoSrc && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover -z-20"
          autoPlay
          muted
          loop
          playsInline
          style={{ opacity: videoReady ? 1 : 0 }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      {/* FALLBACK IMAGE if video doesn't load */}
      {fallbackImageSrc && !videoReady && (
        <div
          className="absolute inset-0 w-full h-full object-cover -z-20"
          style={{
            backgroundImage: `url(${fallbackImageSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      {/* GRADIENT OVERLAY — Dark gradient for text readability */}
      <div
        className="absolute inset-0 -z-10"
        style={{ background: overlayGradient }}
      />

      {/* PARALLAX BACKGROUND — Subtle animated grid for depth */}
      <motion.div
        className="hidden lg:block absolute inset-0 -z-10"
        style={{
          background: 'linear-gradient(135deg, rgba(77, 188, 159, 0.08) 0%, rgba(0, 255, 224, 0.04) 100%)',
          opacity: 0.3,
        }}
      />

      {/* Abstract network graphic */}
      <div className="hidden lg:block absolute inset-y-0 right-0 -z-5" style={{ left: '820px' }}>
        <HeroNetworkVisual />
      </div>

      {/* Hero content — flex-1 so it expands and pushes stats to the bottom */}
      <motion.div
        className="flex-1 flex items-center max-w-7xl mx-auto w-full relative z-10 pt-20 pb-8 gap-8 xl:gap-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: shouldReduceMotion ? 0.01 : 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </section>
  );
};

export default HeroVideoSection;
