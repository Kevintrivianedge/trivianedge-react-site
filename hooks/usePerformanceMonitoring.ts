/**
 * Performance Monitoring Hook
 *
 * Tracks Core Web Vitals and sends metrics to analytics
 * - LCP: Largest Contentful Paint
 * - FID: First Input Delay (deprecated, uses INP instead)
 * - CLS: Cumulative Layout Shift
 * - TTFB: Time to First Byte
 * - FCP: First Contentful Paint
 */

import { useEffect } from 'react';

interface WebVitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
  isFinal?: boolean;
  navigationType?: string;
}

type OnMetricCallback = (metric: WebVitalMetric) => void;

export const usePerformanceMonitoring = (onMetric?: OnMetricCallback) => {
  useEffect(() => {
    // Report Web Vitals using the reportWebVitals pattern
    if (typeof window === 'undefined') return;

    // Observe Largest Contentful Paint (LCP)
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];

        const metric: WebVitalMetric = {
          name: 'LCP',
          value: lastEntry.renderTime || lastEntry.loadTime,
          rating: lastEntry.renderTime || lastEntry.loadTime < 2500 ? 'good' : 'poor',
          isFinal: true,
        };

        onMetric?.(metric);
        // Send to analytics
        sendMetricToAnalytics(metric);
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'], buffered: true });
    } catch (e) {
      // LCP not supported
    }

    // Observe Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if ((entry as any).hadRecentInput) continue;
          clsValue += (entry as any).value;
        }

        const metric: WebVitalMetric = {
          name: 'CLS',
          value: clsValue,
          rating: clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needs-improvement' : 'poor',
          isFinal: false,
        };

        onMetric?.(metric);
        sendMetricToAnalytics(metric);
      });

      clsObserver.observe({ entryTypes: ['layout-shift'], buffered: true });
    } catch (e) {
      // CLS not supported
    }

    // Observe Interaction to Next Paint (INP)
    try {
      const inpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];

        const metric: WebVitalMetric = {
          name: 'INP',
          value: (lastEntry as any).processingDuration,
          rating: (lastEntry as any).processingDuration < 200 ? 'good' : 'poor',
          isFinal: true,
        };

        onMetric?.(metric);
        sendMetricToAnalytics(metric);
      });

      inpObserver.observe({ entryTypes: ['event'], buffered: true });
    } catch (e) {
      // INP not supported
    }

    // Observe First Contentful Paint (FCP)
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          const metric: WebVitalMetric = {
            name: 'FCP',
            value: entries[0].startTime,
            rating: entries[0].startTime < 1800 ? 'good' : 'poor',
            isFinal: true,
          };

          onMetric?.(metric);
          sendMetricToAnalytics(metric);
          fcpObserver.disconnect();
        }
      });

      fcpObserver.observe({ entryTypes: ['paint'], buffered: true });
    } catch (e) {
      // FCP not supported
    }
  }, [onMetric]);
};

/**
 * Send metric to analytics service
 * Currently logs to console; integrate with your analytics backend
 */
function sendMetricToAnalytics(metric: WebVitalMetric) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${metric.name}: ${metric.value.toFixed(2)}ms (${metric.rating})`);
  }

  // TODO: Send to your analytics backend
  // Example:
  // fetch('/api/metrics', {
  //   method: 'POST',
  //   body: JSON.stringify(metric),
  // }).catch(() => {});
}

export default usePerformanceMonitoring;
