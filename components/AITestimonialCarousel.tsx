import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, CheckCircle2 } from 'lucide-react';
import { AI_TESTIMONIALS, AITestimonial } from './AITestimonialGenerator';

interface AITestimonialCarouselProps {
  autoPlay?: boolean;
  interval?: number;
}

export const AITestimonialCarousel: React.FC<AITestimonialCarouselProps> = ({
  autoPlay = true,
  interval = 6000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex(prev => (prev + 1) % AI_TESTIMONIALS.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval]);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex(prev => (prev - 1 + AI_TESTIMONIALS.length) % AI_TESTIMONIALS.length);
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex(prev => (prev + 1) % AI_TESTIMONIALS.length);
  };

  const current = AI_TESTIMONIALS[currentIndex];
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir > 0 ? -1000 : 1000,
      opacity: 0,
    }),
  };

  return (
    <div className="w-full">
      {/* Main Testimonial */}
      <div className="relative h-full">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.4 },
            }}
            className="w-full"
          >
            <TestimonialCard testimonial={current} />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
          <motion.button
            onClick={handlePrev}
            className="pointer-events-auto p-3 rounded-full bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-400 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>

          <motion.button
            onClick={handleNext}
            className="pointer-events-auto p-3 rounded-full bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-400 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </div>
      </div>

      {/* Indicator Dots */}
      <div className="flex items-center justify-center gap-2 mt-8">
        {AI_TESTIMONIALS.map((_, idx) => (
          <motion.button
            key={idx}
            onClick={() => {
              setDirection(idx > currentIndex ? 1 : -1);
              setCurrentIndex(idx);
            }}
            className={`rounded-full transition-all ${
              idx === currentIndex
                ? 'bg-cyan-400 w-8 h-3'
                : 'bg-slate-600 w-3 h-3 hover:bg-slate-500'
            }`}
            whileHover={{ scale: 1.2 }}
          />
        ))}
      </div>
    </div>
  );
};

interface TestimonialCardProps {
  testimonial: AITestimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <motion.div
      className="glass rounded-2xl p-8 md:p-12 border border-border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Stars */}
        <motion.div
          className="flex gap-1 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {Array(testimonial.rating)
            .fill(0)
            .map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              </motion.div>
            ))}
        </motion.div>

        {/* Quote */}
        <motion.blockquote
          className="text-xl md:text-2xl text-text italic mb-8 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          "{testimonial.quote}"
        </motion.blockquote>

        {/* Author Info */}
        <motion.div
          className="flex items-center gap-4 mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          {/* Avatar */}
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center text-white font-bold text-lg">
            {testimonial.avatar}
          </div>

          {/* Author Details */}
          <div>
            <div className="flex items-center gap-2">
              <p className="font-bold text-text">{testimonial.name}</p>
              {testimonial.verified && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </motion.div>
              )}
            </div>
            <p className="text-muted text-sm">{testimonial.title}</p>
            <p className="text-muted text-xs">{testimonial.company}</p>
          </div>
        </motion.div>

        {/* Result Metric & Service */}
        <motion.div
          className="flex flex-wrap gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {testimonial.resultMetric && (
            <div className="px-4 py-2 rounded-full bg-emerald-400/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold">
              ✓ {testimonial.resultMetric}
            </div>
          )}
          <div className="px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-500/30 text-cyan-400 text-sm font-semibold">
            {testimonial.service}
          </div>
          <div className="px-4 py-2 rounded-full bg-slate-700/50 text-muted text-sm">
            📍 {testimonial.location}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AITestimonialCarousel;
