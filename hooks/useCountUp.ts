import { useState, useEffect, useRef } from 'react';

/**
 * Returns an animated counter value that counts up from `start` to `end`
 * once the returned `ref` element enters the viewport.
 */
export function useCountUp(
  end: number,
  duration = 2000,
  start = 0,
): { count: number; ref: React.RefObject<HTMLElement | null> } {
  const [count, setCount] = useState(start);
  const ref = useRef<HTMLElement | null>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = performance.now();

          const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(start + (end - start) * eased));
            if (progress < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [end, duration, start]);

  return { count, ref: ref as React.RefObject<HTMLElement | null> };
}
