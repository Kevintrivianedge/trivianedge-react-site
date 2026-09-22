import React from 'react';
import { motion } from 'framer-motion';

interface ChartDataPoint {
  label: string;
  value: number;
  color: string;
}

interface AnimatedChartProps {
  data: ChartDataPoint[];
  type?: 'bar' | 'line';
  title?: string;
  maxValue?: number;
  animationDelay?: number;
}

export const AnimatedChart: React.FC<AnimatedChartProps> = ({
  data,
  type = 'bar',
  title,
  maxValue = Math.max(...data.map(d => d.value)),
  animationDelay = 0,
}) => {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: animationDelay,
      },
    },
  };

  const barVariants = {
    initial: { height: 0, opacity: 0 },
    animate: { height: '100%', opacity: 1 },
  };

  if (type === 'bar') {
    return (
      <motion.div
        variants={containerVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
        className="w-full"
      >
        {title && (
          <h3 className="text-lg font-bold text-text mb-6">{title}</h3>
        )}
        <div className="flex items-end justify-between gap-4 h-64 bg-slate-900/30 rounded-2xl p-6 border border-border">
          {data.map((point, idx) => {
            const heightPercent = (point.value / maxValue) * 100;
            return (
              <motion.div
                key={point.label}
                className="flex-1 flex flex-col items-center gap-3"
                variants={barVariants}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                {/* Bar */}
                <motion.div
                  className="w-full rounded-t-lg bg-gradient-to-t transition-all hover:shadow-lg"
                  style={{
                    backgroundImage: `linear-gradient(to top, ${point.color}, ${point.color}dd)`,
                    height: `${heightPercent}%`,
                  }}
                  whileHover={{ scale: 1.05, boxShadow: `0 0 20px ${point.color}40` }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <motion.div
                    className="h-full flex items-end justify-center pb-2 text-white text-xs font-bold"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                  >
                    {point.value}
                  </motion.div>
                </motion.div>

                {/* Label */}
                <motion.span
                  className="text-xs text-muted text-center font-medium"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                >
                  {point.label}
                </motion.span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  // Line chart variant
  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.3 }}
      className="w-full"
    >
      {title && (
        <h3 className="text-lg font-bold text-text mb-6">{title}</h3>
      )}
      <svg viewBox="0 0 400 200" className="w-full h-auto">
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map(i => (
          <line
            key={`grid-${i}`}
            x1="40"
            y1={40 + i * 40}
            x2="380"
            y2={40 + i * 40}
            stroke="rgba(148, 163, 184, 0.1)"
            strokeWidth="1"
          />
        ))}

        {/* Line path */}
        <motion.polyline
          points={data
            .map((point, idx) => {
              const x = 40 + (idx / (data.length - 1)) * 340;
              const y = 180 - (point.value / maxValue) * 140;
              return `${x},${y}`;
            })
            .join(' ')}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="3"
          initial={{ strokeDashoffset: 500, strokeDasharray: 500 }}
          whileInView={{ strokeDashoffset: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(0, 196, 154)" />
            <stop offset="100%" stopColor="rgb(34, 197, 94)" />
          </linearGradient>
        </defs>

        {/* Data points */}
        {data.map((point, idx) => {
          const x = 40 + (idx / (data.length - 1)) * 340;
          const y = 180 - (point.value / maxValue) * 140;
          return (
            <motion.g key={point.label}>
              <motion.circle
                cx={x}
                cy={y}
                r="4"
                fill="rgb(0, 196, 154)"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 + idx * 0.1 }}
              />
              <motion.circle
                cx={x}
                cy={y}
                r="8"
                fill="none"
                stroke="rgb(0, 196, 154)"
                strokeWidth="2"
                opacity="0.5"
                animate={{ r: [8, 12, 8] }}
                transition={{ duration: 2, repeat: Infinity, delay: idx * 0.15 }}
              />
            </motion.g>
          );
        })}
      </svg>
    </motion.div>
  );
};

export default AnimatedChart;
