import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  onComplete?: () => void;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 2,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
  onComplete,
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    const animationFrame = requestAnimationFrame((time) => {
      startTime = time;

      const animate = (currentTime: number) => {
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
        const currentValue = Math.floor(progress * value);
        setDisplayValue(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayValue(value);
          onComplete?.();
        }
      };

      animate(time);
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, value, duration, onComplete]);

  const formattedValue = displayValue.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      viewport={{ once: true }}
      className={className}
    >
      {prefix}
      {formattedValue}
      {suffix}
    </motion.span>
  );
};

export default AnimatedCounter;
