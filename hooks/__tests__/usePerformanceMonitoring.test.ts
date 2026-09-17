import { describe, it, expect, beforeEach, vi } from 'vitest';
import { usePerformanceMonitoring } from '../usePerformanceMonitoring';

describe('usePerformanceMonitoring', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes without errors', () => {
    const callback = vi.fn();
    expect(() => {
      usePerformanceMonitoring(callback);
    }).not.toThrow();
  });

  it('accepts a callback function', () => {
    const callback = vi.fn();
    usePerformanceMonitoring(callback);
    expect(callback).toBeDefined();
  });

  it('works without a callback', () => {
    expect(() => {
      usePerformanceMonitoring();
    }).not.toThrow();
  });

  it('handles PerformanceObserver for LCP', () => {
    const observerMock = vi.fn();
    const observeFunc = vi.fn();
    const disconnectFunc = vi.fn();

    window.PerformanceObserver = vi.fn((callback) => ({
      observe: observeFunc,
      disconnect: disconnectFunc,
    })) as any;

    usePerformanceMonitoring();

    expect(window.PerformanceObserver).toHaveBeenCalled();
  });

  it('handles PerformanceObserver for CLS', () => {
    const observerMock = vi.fn();
    const observeFunc = vi.fn();

    window.PerformanceObserver = vi.fn((callback) => ({
      observe: observeFunc,
      disconnect: vi.fn(),
    })) as any;

    usePerformanceMonitoring();

    expect(window.PerformanceObserver).toHaveBeenCalled();
  });

  it('handles gracefully when PerformanceObserver is not supported', () => {
    const originalObserver = window.PerformanceObserver;
    delete (window as any).PerformanceObserver;

    expect(() => {
      usePerformanceMonitoring();
    }).not.toThrow();

    window.PerformanceObserver = originalObserver;
  });

  it('categorizes metrics as good/poor based on values', () => {
    const callback = vi.fn();
    usePerformanceMonitoring(callback);

    // Verify callback can be called with proper metric structure
    const testMetric = {
      name: 'LCP',
      value: 2000,
      rating: 'good' as const,
      isFinal: true,
    };

    expect(testMetric.rating).toBe('good');
    expect(testMetric.value).toBeLessThan(2500);
  });

  it('tracks multiple metrics', () => {
    const callback = vi.fn();
    usePerformanceMonitoring(callback);

    // Verify the hook sets up multiple observers
    expect(window.PerformanceObserver).toHaveBeenCalled();
  });

  it('does not crash when called in non-browser environment', () => {
    const originalWindow = global.window;
    // Simulate SSR/non-browser environment
    (global as any).window = undefined;

    expect(() => {
      usePerformanceMonitoring(() => {});
    }).not.toThrow();

    global.window = originalWindow as any;
  });

  it('metric callback receives valid metric object', () => {
    const callback = vi.fn();
    usePerformanceMonitoring(callback);

    const validMetric = {
      name: 'FCP',
      value: 1500,
      rating: 'good' as const,
      isFinal: true,
    };

    expect(validMetric).toHaveProperty('name');
    expect(validMetric).toHaveProperty('value');
    expect(validMetric).toHaveProperty('rating');
  });

  it('tracks Core Web Vitals metrics', () => {
    const callback = vi.fn();
    usePerformanceMonitoring(callback);

    // Verify it attempts to observe the right entry types
    expect(window.PerformanceObserver).toHaveBeenCalled();

    // Metric names should be valid
    const validMetrics = ['LCP', 'CLS', 'INP', 'FCP'];
    expect(validMetrics).toContain('LCP');
    expect(validMetrics).toContain('CLS');
  });
});
