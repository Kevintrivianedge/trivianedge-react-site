/**
 * Security Event Tracking Utilities
 * Tracks security-relevant events on the client side for analysis and debugging
 * Integrates with analytics pipeline for centralized security monitoring
 */

export type SecurityEventType =
  | 'csrf_token_rotated'
  | 'csrf_token_expired'
  | 'request_signed'
  | 'signature_error'
  | 'auth_attempt'
  | 'auth_failed'
  | 'rate_limit_detected'
  | 'security_header_missing'
  | 'tls_version_low';

export type SecurityEventSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface SecurityEvent {
  type: SecurityEventType;
  severity: SecurityEventSeverity;
  timestamp: string;
  endpoint?: string;
  message: string;
  details?: Record<string, unknown>;
  userAgent?: string;
  url?: string;
}

/**
 * Event buffer for batching security events
 */
class SecurityEventBuffer {
  private events: SecurityEvent[] = [];
  private maxEvents = 50;
  private flushInterval = 60_000; // 1 minute
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(private onFlush: (events: SecurityEvent[]) => void) {
    this.startAutoFlush();
  }

  addEvent(event: SecurityEvent): void {
    this.events.push(event);

    // Auto-flush if buffer is full
    if (this.events.length >= this.maxEvents) {
      this.flush();
    }
  }

  flush(): void {
    if (this.events.length > 0) {
      this.onFlush([...this.events]);
      this.events = [];
    }
  }

  private startAutoFlush(): void {
    this.timer = setInterval(() => this.flush(), this.flushInterval);
  }

  destroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.flush();
  }
}

let eventBuffer: SecurityEventBuffer | null = null;

/**
 * Initialize security event tracking
 * Call this once on app startup
 */
export function initializeSecurityTracking(
  onFlush: (events: SecurityEvent[]) => void = sendSecurityEvents
): void {
  if (eventBuffer) {
    eventBuffer.destroy();
  }
  eventBuffer = new SecurityEventBuffer(onFlush);
}

/**
 * Track a security event
 */
export function trackSecurityEvent(event: Omit<SecurityEvent, 'timestamp' | 'userAgent' | 'url'>): void {
  if (!eventBuffer) {
    console.warn('Security event tracking not initialized. Call initializeSecurityTracking() first.');
    return;
  }

  const fullEvent: SecurityEvent = {
    ...event,
    timestamp: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    url: typeof window !== 'undefined' ? window.location.href : undefined,
  };

  eventBuffer.addEvent(fullEvent);

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    const icon = {
      info: 'ℹ️',
      warning: '⚠️',
      error: '❌',
      critical: '🚨',
    }[event.severity];

    console.log(`${icon} [Security] ${event.type}: ${event.message}`, fullEvent.details);
  }
}

/**
 * Send accumulated security events to backend
 */
async function sendSecurityEvents(events: SecurityEvent[]): Promise<void> {
  if (events.length === 0) return;

  try {
    await fetch('/api/analytics/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: 'security_events',
        payload: {
          events,
          count: events.length,
          batchTimestamp: new Date().toISOString(),
        },
      }),
    });
  } catch (error) {
    console.error('Failed to send security events:', error);
  }
}

/**
 * Track CSRF token rotation
 */
export function trackCsrfTokenRotation(details?: Record<string, unknown>): void {
  trackSecurityEvent({
    type: 'csrf_token_rotated',
    severity: 'info',
    message: 'CSRF token rotated from server response',
    details,
  });
}

/**
 * Track CSRF token expiration
 */
export function trackCsrfTokenExpired(details?: Record<string, unknown>): void {
  trackSecurityEvent({
    type: 'csrf_token_expired',
    severity: 'warning',
    message: 'CSRF token expired, new token generated',
    details,
  });
}

/**
 * Track request signing
 */
export function trackRequestSigned(endpoint: string, details?: Record<string, unknown>): void {
  trackSecurityEvent({
    type: 'request_signed',
    severity: 'info',
    message: `Request signed for ${endpoint}`,
    endpoint,
    details,
  });
}

/**
 * Track signature error
 */
export function trackSignatureError(endpoint: string, reason: string): void {
  trackSecurityEvent({
    type: 'signature_error',
    severity: 'error',
    message: `Request signing failed for ${endpoint}: ${reason}`,
    endpoint,
    details: { reason },
  });
}

/**
 * Track authentication attempt
 */
export function trackAuthAttempt(endpoint: string, success: boolean, details?: Record<string, unknown>): void {
  trackSecurityEvent({
    type: success ? 'auth_attempt' : 'auth_failed',
    severity: success ? 'info' : 'warning',
    message: `Authentication ${success ? 'succeeded' : 'failed'} for ${endpoint}`,
    endpoint,
    details,
  });
}

/**
 * Track rate limit detection
 */
export function trackRateLimitDetected(endpoint: string, retryAfter?: number): void {
  trackSecurityEvent({
    type: 'rate_limit_detected',
    severity: 'warning',
    message: `Rate limit detected on ${endpoint}`,
    endpoint,
    details: retryAfter ? { retryAfterSeconds: retryAfter } : undefined,
  });
}

/**
 * Track missing security header
 */
export function trackMissingSecurityHeader(headerName: string, endpoint?: string): void {
  trackSecurityEvent({
    type: 'security_header_missing',
    severity: 'warning',
    message: `Security header missing: ${headerName}`,
    endpoint,
    details: { headerName },
  });
}

/**
 * Verify security headers in response
 */
export function verifySecurityHeaders(response: Response): void {
  const requiredHeaders = [
    'Strict-Transport-Security',
    'X-Content-Type-Options',
    'X-Frame-Options',
    'Content-Security-Policy',
  ];

  for (const header of requiredHeaders) {
    if (!response.headers.has(header)) {
      trackMissingSecurityHeader(header, response.url);
    }
  }
}

/**
 * Flush all pending events
 */
export function flushSecurityEvents(): void {
  if (eventBuffer) {
    eventBuffer.flush();
  }
}

/**
 * Destroy security tracking (call on app teardown)
 */
export function destroySecurityTracking(): void {
  if (eventBuffer) {
    eventBuffer.destroy();
    eventBuffer = null;
  }
}
