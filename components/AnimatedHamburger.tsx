import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedHamburgerProps {
  isOpen: boolean;
  onClick: () => void;
  color?: string;
  ariaLabel?: string;
}

const AnimatedHamburger: React.FC<AnimatedHamburgerProps> = ({
  isOpen,
  onClick,
  color = 'currentColor',
  ariaLabel = 'Toggle navigation'
}) => {
  const lineVariants = {
    top: {
      open: {
        rotate: 45,
        y: 10,
        transition: { type: 'spring', stiffness: 300, damping: 30 }
      },
      closed: {
        rotate: 0,
        y: 0,
        transition: { type: 'spring', stiffness: 300, damping: 30 }
      }
    },
    middle: {
      open: {
        opacity: 0,
        transition: { duration: 0.2 }
      },
      closed: {
        opacity: 1,
        transition: { delay: 0.2, duration: 0.2 }
      }
    },
    bottom: {
      open: {
        rotate: -45,
        y: -10,
        transition: { type: 'spring', stiffness: 300, damping: 30 }
      },
      closed: {
        rotate: 0,
        y: 0,
        transition: { type: 'spring', stiffness: 300, damping: 30 }
      }
    }
  };

  const containerVariants = {
    open: {
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    closed: {
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    }
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-expanded={isOpen}
      className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-colors hover:text-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={false}
    >
      <motion.svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={containerVariants}
        animate={isOpen ? 'open' : 'closed'}
        initial={false}
      >
        {/* Top line — rotates to form top of X */}
        <motion.line
          x1="3"
          y1="6"
          x2="21"
          y2="6"
          variants={lineVariants.top}
          animate={isOpen ? 'open' : 'closed'}
          initial={false}
        />

        {/* Middle line — fades out */}
        <motion.line
          x1="3"
          y1="12"
          x2="21"
          y2="12"
          variants={lineVariants.middle}
          animate={isOpen ? 'open' : 'closed'}
          initial={false}
        />

        {/* Bottom line — rotates to form bottom of X */}
        <motion.line
          x1="3"
          y1="18"
          x2="21"
          y2="18"
          variants={lineVariants.bottom}
          animate={isOpen ? 'open' : 'closed'}
          initial={false}
        />
      </motion.svg>
    </motion.button>
  );
};

export default AnimatedHamburger;
