import React from 'react';
import { motion } from 'framer-motion';
import { AITestimonialCarousel } from './AITestimonialCarousel';
import { SectionReveal } from './SectionReveal';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <SectionReveal direction="up" delay={0}>
          <div className="mb-16">
            <motion.div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-emerald-400" />
              <span className="text-cyan-400 font-semibold">CLIENT SUCCESS</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-text mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-muted max-w-2xl">
              See how companies like yours are transforming their operations with our AI-powered solutions and dedicated teams
            </p>
          </div>
        </SectionReveal>

        {/* Carousel */}
        <SectionReveal direction="up" delay={0.2}>
          <div className="mb-12">
            <AITestimonialCarousel autoPlay={true} interval={6000} />
          </div>
        </SectionReveal>

        {/* Stats */}
        <SectionReveal direction="up" delay={0.4}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-12 border-t border-border">
            {[
              { number: '500+', label: 'Teams Deployed' },
              { number: '95%', label: 'Client Retention' },
              { number: '28 Days', label: 'Avg Deployment' },
              { number: '$50M+', label: 'Cost Saved' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-muted">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
};

export default TestimonialsSection;
