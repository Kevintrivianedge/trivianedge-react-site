import React, { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';

interface HoverGlowProps {
  children: ReactNode;
  scale?: number; // hover scale (1.05 = 5% larger)
  glowColor?: string; // CSS color for glow
  duration?: number; // transition duration in ms
  className?: string;
}

/**
 * HoverGlow: Interactive hover state with scale + teal glow
 * Use for: cards, buttons, interactive elements
 *
 * Applies hover scale and box-shadow glow on mouse enter/leave
 * Uses teal #00C49A by default (your brand accent)
 */
export const HoverGlow: React.FC<HoverGlowProps> = ({
  children,
  scale = 1.02,
  glowColor = 'rgba(0, 196, 154, 0.3)', // teal with 30% opacity
  duration = 0.2,
  className = '',
}) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <motion.div
      className={className}
      animate={isHovering ? { scale } : { scale: 1 }}
      transition={{ duration }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        boxShadow: isHovering
          ? `0 0 24px ${glowColor}, 0 8px 32px rgba(0, 0, 0, 0.1)`
          : '0 8px 32px rgba(0, 0, 0, 0.06)',
        transitionProperty: 'box-shadow',
        transitionDuration: `${duration}s`,
        transitionTimingFunction: 'ease-out',
      }}
    >
      {children}
    </motion.div>
  );
};

export default HoverGlow;
