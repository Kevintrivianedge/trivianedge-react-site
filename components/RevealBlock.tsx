import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

interface RevealBlockProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'left' | 'right';
  className?: string;
}

/**
 * RevealBlock: Scroll-triggered fade + slide animation
 * Use for: section headings, body copy, single content blocks
 *
 * Automatically respects prefers-reduced-motion (removes all animation for users who set it)
 */
export const RevealBlock: React.FC<RevealBlockProps> = ({
  children,
  delay = 0,
  duration = 0.7,
  direction = 'up',
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();

  const directionOffset = {
    up: { y: 24, x: 0 },
    left: { y: 0, x: -24 },
    right: { y: 0, x: 24 },
  };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...directionOffset[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: shouldReduceMotion ? 0.01 : duration,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.16, 1, 0.3, 1], // custom easing curve
      }}
    >
      {children}
    </motion.div>
  );
};

export default RevealBlock;
