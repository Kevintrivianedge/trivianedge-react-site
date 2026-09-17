import { useEffect, useState } from 'react';

interface AnimationPreference {
  prefersReducedMotion: boolean;
  speedMultiplier: number;
}

export const useAnimationPreference = (): AnimationPreference => {
  const [preference, setPreference] = useState<AnimationPreference>({
    prefersReducedMotion: false,
    speedMultiplier: 1,
  });

  useEffect(() => {
    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prefersReduced = mediaQuery.matches;

    // Get speed multiplier from localStorage (user override)
    const stored = localStorage.getItem('animation_speed_multiplier');
    const speedMultiplier = stored ? parseFloat(stored) : 1;

    setPreference({
      prefersReducedMotion: prefersReduced,
      speedMultiplier: prefersReduced ? 0.01 : speedMultiplier,
    });

    // Listen for changes to system preference
    const handleChange = (e: MediaQueryListEvent) => {
      const newSpeedMultiplier = e.matches ? 0.01 : (stored ? parseFloat(stored) : 1);
      setPreference({
        prefersReducedMotion: e.matches,
        speedMultiplier: newSpeedMultiplier,
      });
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return preference;
};

export const setAnimationSpeedMultiplier = (multiplier: number) => {
  // Clamp between 0.1 and 2.0
  const clamped = Math.max(0.1, Math.min(2.0, multiplier));
  localStorage.setItem('animation_speed_multiplier', clamped.toString());

  // Dispatch custom event for components to listen
  window.dispatchEvent(
    new CustomEvent('animationSpeedChange', { detail: { multiplier: clamped } })
  );
};

export const getAnimationSpeedMultiplier = (): number => {
  const stored = localStorage.getItem('animation_speed_multiplier');
  return stored ? parseFloat(stored) : 1;
};
