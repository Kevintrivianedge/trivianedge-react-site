import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

interface StaggerListProps {
  children: ReactNode;
  staggerDelay?: number; // ms between each item
  itemDuration?: number; // ms per item animation
  className?: string;
}

/**
 * StaggerList: Staggered entrance animations for lists of items
 * Use for: card grids (case studies, pillars, testimonials), process timelines
 *
 * Wraps children and applies staggered reveals to each direct child
 * Automatically respects prefers-reduced-motion
 */
export const StaggerList: React.FC<StaggerListProps> = ({
  children,
  staggerDelay = 80,
  itemDuration = 0.55,
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : staggerDelay / 1000,
        delayChildren: 0,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : itemDuration,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25, margin: '-50px' }}
    >
      {React.Children.map(children, (child) => (
        <motion.div variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StaggerList;
