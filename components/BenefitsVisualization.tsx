import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Shield, Users } from 'lucide-react';

interface BenefitCircle {
  label: string;
  percentage: number;
  icon: React.ReactNode;
  color: string;
  description: string;
}

export const BenefitsVisualization: React.FC = () => {
  const benefits: BenefitCircle[] = [
    {
      label: 'Cost Savings',
      percentage: 40,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-emerald-400 to-emerald-600',
      description: 'Average savings vs. local hiring',
    },
    {
      label: 'Time to Deploy',
      percentage: 30,
      icon: <Clock className="w-6 h-6" />,
      color: 'from-cyan-400 to-cyan-600',
      description: 'Days from intake to live team',
    },
    {
      label: 'Compliance Handled',
      percentage: 100,
      icon: <Shield className="w-6 h-6" />,
      color: 'from-amber-400 to-amber-600',
      description: 'End-to-end legal & payroll',
    },
    {
      label: 'Global Coverage',
      percentage: 24,
      icon: <Users className="w-6 h-6" />,
      color: 'from-rose-400 to-rose-600',
      description: 'Hour availability across zones',
    },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-16 reveal">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-3xl md:text-4xl font-bold text-text mb-3">
            Why Companies Choose TrivianEdge
          </h3>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Measurable impact on cost, speed, compliance, and operations.
          </p>
        </motion.div>
      </div>

      {/* Circular Progress Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
        {benefits.map((benefit, idx) => (
          <motion.div
            key={benefit.label}
            className="flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.6,
              delay: idx * 0.12,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {/* Circular Progress */}
            <div className="relative w-32 h-32 mb-6">
              {/* Background circle */}
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="55"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="8"
                />

                {/* Progress circle */}
                <motion.circle
                  cx="60"
                  cy="60"
                  r="55"
                  fill="none"
                  strokeWidth="8"
                  stroke={benefit.color.split(' ')[0].replace('from-', '')}
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: 345.6 }}
                  whileInView={{
                    strokeDashoffset: 345.6 - (345.6 * benefit.percentage) / 100,
                  }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 2,
                    delay: idx * 0.15,
                    ease: 'easeOut',
                  }}
                  style={{
                    strokeDasharray: 345.6,
                  }}
                />
              </svg>

              {/* Center content */}
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: idx * 0.15 + 0.2,
                  ease: 'easeOut',
                }}
              >
                <div
                  className={`w-14 h-14 rounded-full bg-gradient-to-br ${benefit.color} flex items-center justify-center text-white mb-1`}
                >
                  {benefit.icon}
                </div>
                <motion.span
                  className="text-xl font-bold text-text"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 + 0.5 }}
                >
                  {benefit.percentage}
                </motion.span>
                <span className="text-xs text-muted">
                  {benefit.percentage === 100 ? 'Complete' : '%'}
                </span>
              </motion.div>
            </div>

            {/* Label and Description */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: idx * 0.15 + 0.3,
              }}
            >
              <h4 className="font-bold text-text mb-1">{benefit.label}</h4>
              <p className="text-muted text-sm leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BenefitsVisualization;
