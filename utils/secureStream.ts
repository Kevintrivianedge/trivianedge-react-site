/**
 * Secure Streaming Utilities
 * Handles CSRF token rotation and security tracking for streaming responses (SSE)
 */

import { extractRotatedCsrfToken, getCsrfToken } from './csrf';
import {
  trackSecurityEvent,
  trackCsrfTokenRotation,
  trackRateLimitDetected,
  verifySecurityHeaders,
} from './securityEventTracking';

export interface SecureStreamOptions {
  onChunk?: (chunk: string) => void;
  onError?: (error: string, status?: number) => void;
  onComplete?: () => void;
}

/**
 * Handle secure streaming fetch with CSRF token rotation and security tracking
 * Specifically designed for Server-Sent Events and streaming responses
 */
export async function secureStreamFetch(
  endpoint: string,
  init: RequestInit,
  options: SecureStreamOptions = {}
): Promise<boolean> {
  const { onChunk, onError, onComplete } = options;

  try {
    const response = await fetch(endpoint, init);

    // Verify security headers
    verifySecurityHeaders(response);

    // Extract rotated CSRF token if present
    const newToken = extractRotatedCsrfToken(response);
    if (newToken !== getCsrfToken()) {
      trackCsrfTokenRotation({
        endpoint,
        previousToken: getCsrfToken().substring(0, 8) + '...',
        newToken: newToken.substring(0, 8) + '...',
      });
    }

    // Handle rate limiting
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      trackRateLimitDetected(endpoint, retryAfter ? parseInt(retryAfter, 10) : undefined);

      const error = 'Too many requests. Please wait a moment and try again.';
      onError?.(error, 429);
      return false;
    }

    // Handle other errors
    if (!response.ok || !response.body) {
      const error = `API error: ${response.status}`;
      onError?.(error, response.status);
      return false;
    }

    // Stream the response body
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        onChunk?.(chunk);
      }

      onComplete?.();
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Stream processing error';
      onError?.(errorMessage);
      return false;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Network error';

    trackSecurityEvent({
      type: 'auth_failed',
      severity: 'error',
      message: `Streaming request failed: ${errorMessage}`,
      endpoint,
      details: { error: errorMessage },
    });

    onError?.(errorMessage);
    return false;
  }
}
