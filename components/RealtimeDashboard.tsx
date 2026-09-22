import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Users, Zap, Globe } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

interface DashboardMetric {
  label: string;
  value: number;
  suffix?: string;
  icon: React.ReactNode;
  color: string;
}

export const RealtimeDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetric[]>([
    {
      label: 'Active Clients',
      value: 47,
      icon: <Users className="w-6 h-6" />,
      color: 'from-cyan-400 to-cyan-500',
    },
    {
      label: 'Team Members Deployed',
      value: 312,
      icon: <Globe className="w-6 h-6" />,
      color: 'from-emerald-400 to-emerald-500',
    },
    {
      label: 'Hours Saved (Monthly)',
      value: 8640,
      suffix: '+',
      icon: <Zap className="w-6 h-6" />,
      color: 'from-amber-400 to-amber-500',
    },
    {
      label: 'Live Deployments',
      value: 23,
      icon: <Activity className="w-6 h-6" />,
      color: 'from-rose-400 to-rose-500',
    },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev =>
        prev.map(metric => ({
          ...metric,
          value: metric.label === 'Live Deployments'
            ? Math.floor(Math.random() * 30) + 15
            : metric.value,
        }))
      );
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      {/* Dashboard Header */}
      <div className="mb-12 text-center reveal">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6">
            <Activity className="w-3 h-3 animate-pulse" />
            Live Operations
          </div>
          <h3 className="text-3xl md:text-4xl font-bold text-text mb-3">
            TrivianEdge in Action
          </h3>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Real-time metrics from our global operations network
          </p>
        </motion.div>
      </div>

      {/* Metrics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.5,
              delay: idx * 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="glass rounded-2xl p-6 border border-border hover:border-cyan-500/30 transition-colors duration-300 group"
          >
            {/* Background glow */}
            <motion.div
              className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
              style={{
                background: `linear-gradient(135deg, ${metric.color})`,
                filter: 'blur(20px)',
              }}
              animate={{
                opacity: [0, 0.1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            />

            <div className="relative z-10">
              {/* Icon */}
              <motion.div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.color} bg-opacity-20 flex items-center justify-center mb-4 text-white`}
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: idx * 0.2,
                }}
              >
                {metric.icon}
              </motion.div>

              {/* Metric Value */}
              <motion.div className="mb-2">
                <div className="text-3xl md:text-4xl font-bold text-text">
                  <AnimatedCounter
                    value={metric.value}
                    duration={1.5}
                    suffix={metric.suffix}
                  />
                </div>
              </motion.div>

              {/* Label */}
              <p className="text-muted text-sm font-medium">{metric.label}</p>

              {/* Status indicator */}
              <motion.div
                className="mt-3 flex items-center gap-2 text-xs text-cyan-400"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Live
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Activity Feed (bottom) */}
      <motion.div
        className="mt-8 glass rounded-2xl p-6 border border-border"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h4 className="font-bold text-text mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          Recent Activity
        </h4>
        <div className="space-y-3">
          {[
            { time: '2 mins ago', action: 'New team deployed in Philippines' },
            { time: '15 mins ago', action: 'Client onboarding completed' },
            { time: '1 hour ago', action: 'Costa Rica hub at full capacity' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className="flex items-center justify-between text-sm border-b border-border/50 pb-3 last:border-0"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + idx * 0.1 }}
            >
              <span className="text-muted">{item.action}</span>
              <span className="text-muted text-xs">{item.time}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default RealtimeDashboard;
