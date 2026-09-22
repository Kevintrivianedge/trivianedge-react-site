import React from 'react';
import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';

interface StatItem {
  value: number;
  label: string;
  description: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  icon?: React.ReactNode;
}

interface InteractiveStatsGridProps {
  stats: StatItem[];
  columns?: number;
}

export const InteractiveStatsGrid: React.FC<InteractiveStatsGridProps> = ({
  stats,
  columns = 4,
}) => {
  return (
    <motion.div
      className={`grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
    >
      {stats.map((stat, idx) => (
        <motion.div
          key={idx}
          className="rounded-2xl border border-border bg-white dark:bg-white/5 p-6 md:p-8 text-center relative overflow-hidden group"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ y: -4 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            delay: idx * 0.1,
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {/* Background glow */}
          <motion.div
            className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-cyan-400/5 group-hover:bg-cyan-400/10 transition-colors duration-300 -z-10"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          {/* Icon */}
          {stat.icon && (
            <motion.div
              className="flex justify-center mb-4"
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="text-cyan-600 dark:text-cyan-400">{stat.icon}</div>
            </motion.div>
          )}

          {/* Value with animation */}
          <div className="mb-3">
            <motion.div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-cyan-400">
              <AnimatedCounter
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
                decimals={stat.decimals}
              />
            </motion.div>
          </div>

          {/* Label */}
          <p className="font-bold text-text/70 text-sm uppercase tracking-wider mb-2">{stat.label}</p>

          {/* Description */}
          <p className="text-xs text-text/60 leading-relaxed">{stat.description}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default InteractiveStatsGrid;
