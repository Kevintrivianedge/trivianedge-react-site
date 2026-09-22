import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface ComparisonSliderProps {
  beforeImage?: string;
  afterImage?: string;
  beforeLabel: string;
  afterLabel: string;
  beforeContent: React.ReactNode;
  afterContent: React.ReactNode;
}

export const ComparisonSlider: React.FC<ComparisonSliderProps> = ({
  beforeLabel,
  afterLabel,
  beforeContent,
  afterContent,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newPosition = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, newPosition)));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const newPosition = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, newPosition)));
  };

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full bg-white dark:bg-white/5 rounded-2xl overflow-hidden border border-border"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* After (right side) */}
      <div className="w-full p-8 md:p-12">
        <div className="mb-4 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-400" />
          <span className="text-sm font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            {afterLabel}
          </span>
        </div>
        {afterContent}
      </div>

      {/* Before (left side overlay) */}
      <motion.div
        className="absolute inset-0 p-8 md:p-12 pointer-events-none overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <div className="bg-white dark:bg-white/5 rounded-2xl p-8 md:p-12 h-full">
          <div className="mb-4 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-stone-400" />
            <span className="text-sm font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">
              {beforeLabel}
            </span>
          </div>
          {beforeContent}
        </div>
      </motion.div>

      {/* Slider handle */}
      <motion.div
        className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-cyan-400 to-transparent cursor-col-resize pointer-events-auto"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-cyan-400 rounded-full p-3 shadow-lg"
          whileHover={{ scale: 1.2 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 5H7v14h2V5zm8 0h-2v14h2V5z" />
          </svg>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ComparisonSlider;
