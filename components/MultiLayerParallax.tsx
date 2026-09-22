import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface ParallaxLayer {
  depth: number;
  children: React.ReactNode;
  className?: string;
}

interface MultiLayerParallaxProps {
  layers: ParallaxLayer[];
  height?: string;
}

export const MultiLayerParallax: React.FC<MultiLayerParallaxProps> = ({
  layers,
  height = 'h-screen',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const elementTop = rect.top;
      const windowHeight = window.innerHeight;

      if (elementTop < windowHeight) {
        const scrollAmount = Math.max(0, windowHeight - elementTop);
        setScrollY(scrollAmount);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${height}`}
      style={{ perspective: '1200px' }}
    >
      {layers.map((layer, idx) => (
        <motion.div
          key={idx}
          className={`absolute inset-0 ${layer.className || ''}`}
          style={{
            transform: `translateY(${scrollY * (1 - layer.depth) * 0.5}px)`,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {layer.children}
        </motion.div>
      ))}
    </div>
  );
};

export default MultiLayerParallax;
