import React from 'react';
import { motion } from 'framer-motion';

type SkeletonType = 'text' | 'circle' | 'card' | 'list' | 'hero';

interface SkeletonLoaderProps {
  type?: SkeletonType;
  count?: number;
  className?: string;
}

const shimmer = {
  initial: { backgroundPosition: '-1000px 0' },
  animate: { backgroundPosition: '1000px 0' },
};

const pulse = {
  animate: { opacity: [0.5, 1, 0.5] },
  transition: { duration: 2, repeat: Infinity },
};

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = 'text',
  count = 3,
  className = '',
}) => {
  if (type === 'text') {
    return (
      <div className={className}>
        {Array(count)
          .fill(0)
          .map((_, idx) => (
            <motion.div
              key={idx}
              className="h-4 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded mb-3 last:mb-0"
              style={{
                backgroundSize: '1000px 100%',
              }}
              variants={shimmer}
              initial="initial"
              animate="animate"
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'loop',
              }}
            />
          ))}
      </div>
    );
  }

  if (type === 'circle') {
    return (
      <div className={`flex gap-4 ${className}`}>
        {Array(count)
          .fill(0)
          .map((_, idx) => (
            <motion.div
              key={idx}
              className="w-16 h-16 rounded-full bg-slate-800"
              variants={pulse}
              animate="animate"
              transition={{ delay: idx * 0.1 }}
            />
          ))}
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className={`grid gap-4 ${className}`}>
        {Array(count)
          .fill(0)
          .map((_, idx) => (
            <motion.div
              key={idx}
              className="rounded-lg border border-slate-700 p-6 bg-slate-900/50"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: idx * 0.1 }}
            >
              <motion.div
                className="h-6 bg-slate-800 rounded mb-4 w-1/3"
                variants={shimmer}
                initial="initial"
                animate="animate"
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <motion.div
                    key={i}
                    className="h-3 bg-slate-800 rounded"
                    variants={shimmer}
                    initial="initial"
                    animate="animate"
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                  />
                ))}
              </motion.div>
            </motion.div>
          ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array(count)
          .fill(0)
          .map((_, idx) => (
            <motion.div key={idx} className="flex gap-4">
              <motion.div
                className="w-12 h-12 rounded-lg bg-slate-800 flex-shrink-0"
                variants={pulse}
                animate="animate"
                transition={{ delay: idx * 0.1 }}
              />
              <div className="flex-1 space-y-2">
                <motion.div
                  className="h-4 bg-slate-800 rounded w-1/2"
                  variants={shimmer}
                  initial="initial"
                  animate="animate"
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="h-3 bg-slate-800 rounded w-3/4"
                  variants={shimmer}
                  initial="initial"
                  animate="animate"
                  transition={{ duration: 2, repeat: Infinity, delay: 0.1 }}
                />
              </div>
            </motion.div>
          ))}
      </div>
    );
  }

  if (type === 'hero') {
    return (
      <motion.div className={`space-y-6 ${className}`}>
        <motion.div
          className="h-16 bg-slate-800 rounded-lg w-1/2"
          variants={shimmer}
          initial="initial"
          animate="animate"
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <motion.div
              key={i}
              className="h-4 bg-slate-800 rounded"
              style={{ width: `${100 - i * 15}%` }}
              variants={shimmer}
              initial="initial"
              animate="animate"
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </motion.div>
        <motion.div
          className="h-12 bg-slate-800 rounded-lg w-32"
          variants={shimmer}
          initial="initial"
          animate="animate"
          transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
        />
      </motion.div>
    );
  }

  return null;
};

export default SkeletonLoader;
