import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface InteractiveServiceCardProps {
  title: string;
  summary: string;
  benefits: string[];
  metrics: Array<{ label: string; value: string }>;
  icon: React.ReactNode;
}

export const InteractiveServiceCard: React.FC<InteractiveServiceCardProps> = ({
  title,
  summary,
  benefits,
  metrics,
  icon,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      className="rounded-2xl border border-border bg-white dark:bg-white/5 p-6 md:p-8 cursor-pointer overflow-hidden"
      onClick={() => setIsExpanded(!isExpanded)}
      whileHover={{ borderColor: 'rgba(77, 188, 159, 0.3)' }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <motion.div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <motion.div className="w-10 h-10 rounded-lg bg-cyan-400/10 flex items-center justify-center flex-shrink-0">
            <div className="text-cyan-600 dark:text-cyan-400">{icon}</div>
          </motion.div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-text mb-2">{title}</h3>
            <p className="text-sm text-text/60 leading-relaxed">{summary}</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
        </motion.div>
      </motion.div>

      {/* Metrics row */}
      <motion.div className="flex gap-3 mb-4 overflow-x-auto pb-2">
        {metrics.map((metric, idx) => (
          <motion.div
            key={idx}
            className="flex-shrink-0 px-3 py-2 rounded-lg bg-cyan-400/5 border border-cyan-400/20"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            viewport={{ once: true }}
          >
            <div className="text-xs font-bold text-cyan-600 dark:text-cyan-400">{metric.value}</div>
            <div className="text-[10px] text-text/60">{metric.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <motion.div
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              exit={{ y: -10 }}
              className="pt-4 border-t border-border"
            >
              <p className="font-bold text-sm text-text mb-3 uppercase tracking-wider">Key Benefits</p>
              <ul className="space-y-2">
                {benefits.map((benefit, idx) => (
                  <motion.li
                    key={idx}
                    className="flex items-start gap-2 text-sm text-text/70"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5" />
                    {benefit}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InteractiveServiceCard;
