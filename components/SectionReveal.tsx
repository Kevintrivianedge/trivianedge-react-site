import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SectionRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  staggerChildren?: boolean;
  className?: string;
}

export const SectionReveal: React.FC<SectionRevealProps> = ({
  children,
  delay = 0,
  direction = 'up',
  staggerChildren = false,
  className = '',
}) => {
  const directionVariants = {
    up: { initial: { opacity: 0, y: 60 }, animate: { opacity: 1, y: 0 } },
    down: { initial: { opacity: 0, y: -60 }, animate: { opacity: 1, y: 0 } },
    left: { initial: { opacity: 0, x: 60 }, animate: { opacity: 1, x: 0 } },
    right: { initial: { opacity: 0, x: -60 }, animate: { opacity: 1, x: 0 } },
  };

  const containerVariants = staggerChildren ? {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: delay,
      },
    },
  } : directionVariants[direction];

  return (
    <motion.div
      variants={staggerChildren ? containerVariants : undefined}
      initial={staggerChildren ? 'initial' : directionVariants[direction].initial}
      whileInView={staggerChildren ? 'animate' : directionVariants[direction].animate}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.6,
        delay: delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default SectionReveal;
