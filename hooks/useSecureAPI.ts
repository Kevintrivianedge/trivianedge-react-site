import { useCallback, useState } from 'react';
import { extractRotatedCsrfToken, addCsrfTokenToHeaders, getCsrfToken } from '../utils/csrf';
import { signAdminRequest, getAdminToken } from '../utils/requestSigning';
import {
  trackSecurityEvent,
  trackCsrfTokenRotation,
  trackAuthAttempt,
  trackRateLimitDetected,
  verifySecurityHeaders,
} from '../utils/securityEventTracking';

export interface SecureAPIOptions {
  method?: string;
  body?: unknown;
  adminToken?: boolean;
  sign?: boolean;
  onError?: (error: string, status?: number) => void;
}

export interface SecureAPIResponse<T> {
  data?: T;
  error?: string;
  status?: number;
}

/**
 * Custom hook for making secure API calls with CSRF protection and optional request signing
 * Automatically handles:
 * - CSRF token injection and rotation
 * - Optional HMAC request signing for admin endpoints
 * - Security event tracking
 * - Rate limit detection
 * - Error handling
 */
export function useSecureAPI() {
  const [isLoading, setIsLoading] = useState(false);

  const call = useCallback(
    async <T,>(
      endpoint: string,
      options: SecureAPIOptions = {}
    ): Promise<SecureAPIResponse<T>> => {
      const { method = 'POST', body, adminToken = false, sign = false, onError } = options;

      setIsLoading(true);

      try {
        // Prepare headers
        let headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };

        // Add CSRF token for non-admin endpoints
        if (!adminToken) {
          headers = addCsrfTokenToHeaders(headers);
        }

        // Add admin token if needed
        if (adminToken) {
          const token = getAdminToken();
          if (!token) {
            const error = 'Admin token not configured';
            onError?.(error);
            return { error, status: 401 };
          }
          headers['X-Admin-Token'] = token;
        }

        // Prepare request options
        let fetchOptions: RequestInit = {
          method,
          headers,
        };

        if (body) {
          fetchOptions.body = JSON.stringify(body);
        }

        // Add optional request signing for admin endpoints
        if (adminToken && sign) {
          const token = getAdminToken();
          if (token) {
            try {
              const request = new Request(new URL(endpoint, window.location.href), fetchOptions);
              const signedRequest = await signAdminRequest(request, token);

              // Update headers from signed request
              fetchOptions.headers = Object.fromEntries(signedRequest.headers.entries());

              trackSecurityEvent({
                type: 'request_signed',
                severity: 'info',
                message: `Request signed for ${endpoint}`,
                endpoint,
              });
            } catch (error) {
              trackSecurityEvent({
                type: 'signature_error',
                severity: 'error',
                message: `Failed to sign request: ${error instanceof Error ? error.message : 'unknown error'}`,
                endpoint,
                details: { error: String(error) },
              });
            }
          }
        }

        // Make the request
        const response = await fetch(endpoint, fetchOptions);

        // Verify security headers in response
        verifySecurityHeaders(response);

        // Extract rotated CSRF token if present (for non-admin endpoints)
        if (!adminToken) {
          const newToken = extractRotatedCsrfToken(response);
          if (newToken !== getCsrfToken()) {
            trackCsrfTokenRotation({
              endpoint,
              previousToken: getCsrfToken().substring(0, 8) + '...',
              newToken: newToken.substring(0, 8) + '...',
            });
          }
        }

        // Handle rate limiting
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          trackRateLimitDetected(endpoint, retryAfter ? parseInt(retryAfter, 10) : undefined);

          const error = 'Too many requests. Please wait a moment and try again.';
          onError?.(error, 429);
          return { error, status: 429 };
        }

        // Track authentication attempts
        if (adminToken) {
          const success = response.ok;
          trackAuthAttempt(endpoint, success, {
            status: response.status,
            method,
          });
        }

        // Parse response
        let data: T | undefined;
        try {
          data = (await response.json()) as T;
        } catch {
          // Response may not be JSON
          data = undefined;
        }

        // Handle errors
        if (!response.ok) {
          const error =
            (data as any)?.error ||
            (data as any)?.message ||
            `HTTP ${response.status}`;

          onError?.(error, response.status);
          return { error: String(error), status: response.status };
        }

        return { data, status: response.status };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        trackSecurityEvent({
          type: 'auth_failed',
          severity: 'error',
          message: `API call failed: ${errorMessage}`,
          endpoint,
          details: { error: errorMessage },
        });

        onError?.(errorMessage);
        return { error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { call, isLoading };
}

/**
 * Convenience wrapper for GET requests
 */
export function useSecureGET<T = unknown>() {
  const { call, isLoading } = useSecureAPI();

  const get = useCallback(
    (endpoint: string, adminToken = false) =>
      call<T>(endpoint, { method: 'GET', adminToken }),
    [call]
  );

  return { get, isLoading };
}

/**
 * Convenience wrapper for POST requests with CSRF protection
 */
export function useSecurePOST<T = unknown>() {
  const { call, isLoading } = useSecureAPI();

  const post = useCallback(
    (endpoint: string, body?: unknown, adminToken = false) =>
      call<T>(endpoint, { method: 'POST', body, adminToken }),
    [call]
  );

  return { post, isLoading };
}
