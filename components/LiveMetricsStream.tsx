import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, Zap } from 'lucide-react';

interface MetricUpdate {
  id: string;
  label: string;
  value: number;
  delta: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: string;
}

interface LiveMetricsStreamProps {
  metrics: MetricUpdate[];
  updateInterval?: number;
}

export const LiveMetricsStream: React.FC<LiveMetricsStreamProps> = ({
  metrics,
  updateInterval = 5000,
}) => {
  const [displayMetrics, setDisplayMetrics] = useState(metrics);
  const [pulseActive, setPulseActive] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayMetrics(prev =>
        prev.map(metric => ({
          ...metric,
          value: metric.value + Math.floor(Math.random() * 10 - 3),
          delta: Math.floor(Math.random() * 20 - 10),
          trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable',
        }))
      );

      // Trigger pulse on a random metric
      const randomId = metrics[Math.floor(Math.random() * metrics.length)].id;
      setPulseActive(randomId);
      setTimeout(() => setPulseActive(null), 500);
    }, updateInterval);

    return () => clearInterval(interval);
  }, [metrics, updateInterval]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {displayMetrics.map((metric, idx) => (
        <motion.div
          key={metric.id}
          className={`relative p-6 rounded-xl border transition-colors duration-300 ${
            pulseActive === metric.id
              ? 'border-cyan-400/60 bg-cyan-400/5'
              : 'border-border hover:border-cyan-500/30 bg-slate-900/30'
          }`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.1 }}
          whileHover={{ y: -4 }}
        >
          {/* Live indicator */}
          <motion.div
            className="absolute top-4 right-4 flex items-center gap-1"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs text-emerald-400 font-semibold">LIVE</span>
          </motion.div>

          {/* Icon */}
          <motion.div
            className={`w-12 h-12 rounded-lg bg-gradient-to-br ${
              metric.color === 'cyan'
                ? 'from-cyan-400/30 to-cyan-600/30'
                : metric.color === 'emerald'
                ? 'from-emerald-400/30 to-emerald-600/30'
                : 'from-amber-400/30 to-amber-600/30'
            } flex items-center justify-center mb-4 text-${metric.color}-400`}
            animate={{
              scale: pulseActive === metric.id ? [1, 1.1, 1] : 1,
            }}
            transition={{ duration: 0.5 }}
          >
            {metric.icon}
          </motion.div>

          {/* Label */}
          <p className="text-muted text-sm mb-2">{metric.label}</p>

          {/* Value with animation */}
          <div className="mb-3">
            <motion.p
              className="text-3xl font-bold text-text"
              key={metric.value}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {metric.value}
            </motion.p>
          </div>

          {/* Delta indicator */}
          <motion.div
            className={`flex items-center gap-1 text-sm font-semibold ${
              metric.trend === 'up'
                ? 'text-emerald-400'
                : metric.trend === 'down'
                ? 'text-red-400'
                : 'text-slate-400'
            }`}
            initial={{ x: -5 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {metric.trend === 'up' && (
              <>
                <TrendingUp className="w-4 h-4" />
                +{metric.delta}%
              </>
            )}
            {metric.trend === 'down' && (
              <>
                <TrendingUp className="w-4 h-4 rotate-180" />
                {metric.delta}%
              </>
            )}
            {metric.trend === 'stable' && (
              <>
                <Activity className="w-4 h-4" />
                Stable
              </>
            )}
          </motion.div>

          {/* Pulse effect on update */}
          {pulseActive === metric.id && (
            <motion.div
              className="absolute inset-0 rounded-xl border-2 border-cyan-400"
              initial={{ scale: 0.95, opacity: 1 }}
              animate={{ scale: 1.1, opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default LiveMetricsStream;
