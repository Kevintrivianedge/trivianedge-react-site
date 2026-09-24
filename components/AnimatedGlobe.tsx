import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

interface GlobeLocation {
  name: string;
  lat: number;
  lng: number;
  icon?: React.ReactNode;
}

interface AnimatedGlobeProps {
  locations?: GlobeLocation[];
  autoRotate?: boolean;
  interactive?: boolean;
}

// Convert latitude/longitude to 3D coordinates on sphere
const latLngToXY = (lat: number, lng: number, scale: number = 100) => {
  const φ = (lat * Math.PI) / 180;
  const θ = (lng * Math.PI) / 180;

  const x = scale * Math.cos(φ) * Math.cos(θ);
  const y = scale * Math.sin(φ);

  return { x, y };
};

export const AnimatedGlobe: React.FC<AnimatedGlobeProps> = ({
  locations = [
    { name: 'Philippines', lat: 12.8797, lng: 121.774 },
    { name: 'Vietnam', lat: 14.0583, lng: 108.2772 },
    { name: 'Sri Lanka', lat: 7.8731, lng: 80.7718 },
    { name: 'Turkey', lat: 38.9637, lng: 35.2433 },
    { name: 'South Africa', lat: -30.5595, lng: 22.9375 },
    { name: 'Costa Rica', lat: 9.7489, lng: -83.7534 },
  ],
  autoRotate = true,
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 20, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!interactive || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const x = ((e.clientY - rect.top - centerY) / centerY) * 30;
    const y = ((e.clientX - rect.left - centerX) / centerX) * 30;

    setRotation({ x: 20 + x, y });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 20, y: 0 });
    setIsHovering(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-80 md:h-96 flex items-center justify-center"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovering(true)}
      style={{ perspective: '1000px' }}
    >
      {/* Outer glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-b from-cyan-400/20 to-transparent blur-3xl"
        animate={{
          scale: isHovering ? 1.2 : 1,
          opacity: isHovering ? 0.8 : 0.4,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Globe container with 3D rotation */}
      <motion.div
        className="relative w-64 h-64 md:w-72 md:h-72"
        animate={
          autoRotate && !isHovering
            ? { rotateY: 360 }
            : { rotateX: rotation.x, rotateY: rotation.y }
        }
        transition={
          autoRotate && !isHovering
            ? { duration: 20, repeat: Infinity, ease: 'linear' }
            : { type: 'spring', stiffness: 100, damping: 20 }
        }
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Globe background circle */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 200 200"
          style={{
            filter: 'drop-shadow(0 0 60px rgba(77, 188, 159, 0.3))',
          }}
        >
          {/* Outer sphere border */}
          <circle
            cx="100"
            cy="100"
            r="98"
            fill="none"
            stroke="url(#globeGradient)"
            strokeWidth="2"
            opacity="0.6"
          />

          {/* Globe gradient */}
          <defs>
            <radialGradient id="globeGradient" cx="35%" cy="35%">
              <stop offset="0%" stopColor="rgba(77, 188, 159, 0.6)" />
              <stop offset="100%" stopColor="rgba(0, 150, 130, 0.2)" />
            </radialGradient>
            <linearGradient id="globeLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.2)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
            </linearGradient>
          </defs>

          {/* Globe sphere */}
          <circle
            cx="100"
            cy="100"
            r="95"
            fill="url(#globeGradient)"
            opacity="0.15"
          />

          {/* Highlight for 3D effect */}
          <ellipse
            cx="70"
            cy="60"
            rx="40"
            ry="50"
            fill="url(#globeLight)"
          />

          {/* Latitude/longitude grid lines */}
          {[...Array(7)].map((_, i) => {
            const lat = (i - 3) * 30;
            return (
              <circle
                key={`lat-${i}`}
                cx="100"
                cy={100 + (lat / 180) * 90}
                r={Math.cos((lat * Math.PI) / 180) * 95}
                fill="none"
                stroke="rgba(77, 188, 159, 0.1)"
                strokeWidth="0.5"
              />
            );
          })}

          {/* Meridian lines */}
          {[...Array(12)].map((_, i) => {
            const lng = (i * 360) / 12;
            const θ = (lng * Math.PI) / 180;
            const x1 = 100 + 95 * Math.cos(θ);
            const y1 = 100 + 95 * Math.sin(θ);
            return (
              <line
                key={`lng-${i}`}
                x1="100"
                y1="100"
                x2={x1}
                y2={y1}
                stroke="rgba(77, 188, 159, 0.1)"
                strokeWidth="0.5"
              />
            );
          })}
        </svg>

        {/* Location pins */}
        <div className="absolute inset-0 flex items-center justify-center">
          {locations.map((loc, idx) => {
            const { x, y } = latLngToXY(loc.lat, loc.lng, 95);
            const normalizedX = 100 + x;
            const normalizedY = 100 + y;

            return (
              <motion.div
                key={loc.name}
                className="absolute"
                style={{
                  left: `${normalizedX}%`,
                  top: `${normalizedY}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                animate={{
                  scale: isHovering ? 1.2 : 1,
                }}
                transition={{ delay: idx * 0.05 }}
              >
                <motion.div
                  className="relative"
                  animate={{
                    y: [0, -4, 0],
                  }}
                  transition={{
                    duration: 3 + idx * 0.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <div className="relative w-3 h-3 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50" />
                  <motion.div
                    className="absolute inset-0 w-3 h-3 rounded-full border border-cyan-400"
                    animate={{ scale: [1, 1.8, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: idx * 0.15,
                    }}
                  />

                  {/* Tooltip on hover */}
                  <motion.div
                    className="absolute top-6 left-1/2 -translate-x-1/2 px-2 py-1 bg-cyan-400/20 border border-cyan-400/40 rounded text-xs text-cyan-100 whitespace-nowrap"
                    initial={{ opacity: 0, y: -4 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ pointerEvents: 'none' }}
                  >
                    {loc.name}
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Info text */}
      <motion.div
        className="absolute bottom-0 text-center text-muted text-xs"
        animate={{ opacity: isHovering ? 0.5 : 0.3 }}
      >
        {interactive ? 'Drag to explore' : 'Global operations'}
      </motion.div>
    </div>
  );
};

export default AnimatedGlobe;
