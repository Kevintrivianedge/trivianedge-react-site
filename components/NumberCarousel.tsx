import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface NumberCarouselProps {
  numbers: number[];
  duration?: number;
  interval?: number;
  format?: (n: number) => string;
  className?: string;
}

export const NumberCarousel: React.FC<NumberCarouselProps> = ({
  numbers,
  duration = 2,
  interval = 3,
  format = (n) => n.toString(),
  className = '',
}) => {
  const [current, setCurrent] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % numbers.length);
    }, (duration + interval) * 1000);

    return () => clearInterval(timer);
  }, [isInView, numbers.length, duration, interval]);

  return (
    <motion.div
      ref={ref}
      className={`relative h-16 ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="absolute inset-0 overflow-hidden">
        {numbers.map((num, idx) => (
          <motion.div
            key={idx}
            className="absolute inset-0 flex items-center justify-center"
            initial={{ y: 100, opacity: 0 }}
            animate={
              idx === current
                ? { y: 0, opacity: 1 }
                : idx === (current - 1 + numbers.length) % numbers.length
                  ? { y: -100, opacity: 0 }
                  : { y: 100, opacity: 0 }
            }
            transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-4xl font-bold text-cyan-600 dark:text-cyan-400">
              {format(num)}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default NumberCarousel;
