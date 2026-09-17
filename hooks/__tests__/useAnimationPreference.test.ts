import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAnimationPreference, setAnimationSpeedMultiplier, getAnimationSpeedMultiplier } from '../useAnimationPreference';

describe('useAnimationPreference', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('returns default preference when no user override exists', () => {
    const { prefersReducedMotion, speedMultiplier } = useAnimationPreference();
    expect(prefersReducedMotion).toBe(false);
    expect(speedMultiplier).toBe(1);
  });

  it('respects prefers-reduced-motion system preference', () => {
    const mockMediaQuery = {
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    window.matchMedia = vi.fn(() => mockMediaQuery as any);

    const { prefersReducedMotion, speedMultiplier } = useAnimationPreference();
    expect(prefersReducedMotion).toBe(true);
    expect(speedMultiplier).toBe(0.01);
  });

  it('sets animation speed multiplier correctly', () => {
    setAnimationSpeedMultiplier(0.5);
    const result = getAnimationSpeedMultiplier();
    expect(result).toBe(0.5);
  });

  it('clamps speed multiplier between 0.1 and 2.0', () => {
    setAnimationSpeedMultiplier(0.05); // Too low
    let result = getAnimationSpeedMultiplier();
    expect(result).toBe(0.1);

    setAnimationSpeedMultiplier(3.0); // Too high
    result = getAnimationSpeedMultiplier();
    expect(result).toBe(2.0);
  });

  it('persists speed multiplier to localStorage', () => {
    setAnimationSpeedMultiplier(1.5);
    const stored = localStorage.getItem('animation_speed_multiplier');
    expect(stored).toBe('1.5');
  });

  it('dispatches custom event on speed change', () => {
    const listener = vi.fn();
    window.addEventListener('animationSpeedChange', listener);

    setAnimationSpeedMultiplier(0.8);

    expect(listener).toHaveBeenCalled();
    window.removeEventListener('animationSpeedChange', listener);
  });

  it('loads persisted speed multiplier from localStorage', () => {
    localStorage.setItem('animation_speed_multiplier', '1.2');
    const result = getAnimationSpeedMultiplier();
    expect(result).toBe(1.2);
  });

  it('returns 1 when no stored multiplier exists', () => {
    localStorage.clear();
    const result = getAnimationSpeedMultiplier();
    expect(result).toBe(1);
  });
});
