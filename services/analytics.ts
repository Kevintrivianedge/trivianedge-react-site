/**
 * Analytics Service
 * Handles sending performance metrics, events, and user interactions to backend
 */

interface WebVitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
  isFinal?: boolean;
}

interface AnalyticsEvent {
  eventName: string;
  properties?: Record<string, string | number | boolean>;
  timestamp?: number;
}

/**
 * Send performance metric to analytics backend
 */
export const sendMetricToAnalytics = async (metric: WebVitalMetric) => {
  try {
    // Use sendBeacon for reliability on page unload
    if (navigator.sendBeacon) {
      const payload = JSON.stringify({
        type: 'performance_metric',
        metric: metric.name,
        value: metric.value,
        rating: metric.rating,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
      });

      navigator.sendBeacon('/api/analytics/metrics', payload);
    } else {
      // Fallback to fetch
      await fetch('/api/analytics/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'performance_metric',
          metric: metric.name,
          value: metric.value,
          rating: metric.rating,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: Date.now(),
        }),
        keepalive: true,
      }).catch(() => {}); // Silently fail
    }
  } catch (error) {
    // Silently fail - don't let analytics break the app
    console.debug('[Analytics] Failed to send metric:', error);
  }
};

/**
 * Send analytics event (user interaction, page view, etc.)
 */
export const sendAnalyticsEvent = async (event: AnalyticsEvent) => {
  try {
    const payload = {
      type: 'event',
      eventName: event.eventName,
      properties: event.properties || {},
      url: window.location.href,
      timestamp: event.timestamp || Date.now(),
    };

    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/events', JSON.stringify(payload));
    } else {
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    }
  } catch (error) {
    console.debug('[Analytics] Failed to send event:', error);
  }
};

/**
 * Track page view
 */
export const trackPageView = async (path: string, title?: string) => {
  await sendAnalyticsEvent({
    eventName: 'page_view',
    properties: {
      path,
      title: title || document.title,
    },
  });
};

/**
 * Track link click
 */
export const trackLinkClick = async (url: string, label?: string) => {
  await sendAnalyticsEvent({
    eventName: 'link_click',
    properties: {
      url,
      label: label || url,
    },
  });
};

/**
 * Track form submission
 */
export const trackFormSubmit = async (formName: string, success: boolean) => {
  await sendAnalyticsEvent({
    eventName: 'form_submit',
    properties: {
      formName,
      success,
    },
  });
};

/**
 * Track CTA button click
 */
export const trackCTAClick = async (ctaName: string, ctaType?: string) => {
  await sendAnalyticsEvent({
    eventName: 'cta_click',
    properties: {
      ctaName,
      ctaType: ctaType || 'button',
    },
  });
};

/**
 * Track feature usage
 */
export const trackFeatureUsage = async (featureName: string, action: string) => {
  await sendAnalyticsEvent({
    eventName: 'feature_usage',
    properties: {
      featureName,
      action,
    },
  });
};

/**
 * Track chat/AI interaction
 */
export const trackChatInteraction = async (
  messageType: 'user_message' | 'ai_response',
  tokenCount?: number
) => {
  await sendAnalyticsEvent({
    eventName: 'chat_interaction',
    properties: {
      messageType,
      ...(tokenCount && { tokenCount }),
    },
  });
};

/**
 * Track error
 */
export const trackError = async (errorName: string, errorMessage?: string) => {
  await sendAnalyticsEvent({
    eventName: 'error',
    properties: {
      errorName,
      errorMessage: errorMessage || 'Unknown error',
    },
  });
};

/**
 * Batch analytics events for efficiency
 */
export class AnalyticsBatcher {
  private events: AnalyticsEvent[] = [];
  private flushInterval: NodeJS.Timeout | null = null;
  private readonly batchSize = 10;
  private readonly flushIntervalMs = 5000; // 5 seconds

  constructor() {
    // Auto-flush on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => this.flush());
    }
  }

  addEvent(event: AnalyticsEvent) {
    this.events.push(event);

    // Flush if batch is full
    if (this.events.length >= this.batchSize) {
      this.flush();
    } else if (!this.flushInterval) {
      // Start timer if not already running
      this.flushInterval = setInterval(() => this.flush(), this.flushIntervalMs);
    }
  }

  async flush() {
    if (this.events.length === 0) return;

    const eventsToSend = [...this.events];
    this.events = [];

    // Clear interval if no more events
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }

    try {
      const payload = {
        type: 'batch_events',
        events: eventsToSend,
        timestamp: Date.now(),
      };

      await fetch('/api/analytics/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    } catch (error) {
      console.debug('[Analytics] Failed to flush batch:', error);
    }
  }

  destroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
  }
}

// Export singleton instance
export const analyticsBatcher = new AnalyticsBatcher();
