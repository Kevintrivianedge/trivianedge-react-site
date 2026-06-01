import React, { useState, useEffect, useRef } from 'react';

interface CountUpStatProps {
  end: number;
  suffix?: string;
  label: string;
  duration?: number;
  textClass?: string;
  labelClass?: string;
}

/**
 * Animates a number from 0 to `end` when the element scrolls into view.
 */
const CountUpStat: React.FC<CountUpStatProps> = ({ end, suffix = '', label, duration = 1800, textClass = 'text-text', labelClass = 'text-muted' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const startTime = performance.now();

          const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - (1 - progress) ** 3; // ease-out cubic
            setCount(Math.round(end * eased));
            if (progress < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <div ref={ref} className="flex flex-col gap-1">
      <span className={`text-2xl md:text-3xl font-bold tabular-nums ${textClass}`}>
        {count}
        {suffix}
      </span>
      <span className={`text-[10px] tracking-widest uppercase font-bold leading-tight ${labelClass}`}>
        {label}
      </span>
    </div>
  );
};

export default CountUpStat;
