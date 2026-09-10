/**
 * CSRF Protection Utilities
 * Implements CSRF token generation and validation for POST endpoints
 */

const CSRF_TOKEN_KEY = 'csrf_token';
const CSRF_TOKEN_STORAGE_KEY = 'trivianedge_csrf_token';
const TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour
const TOKEN_EXPIRY_KEY = 'trivianedge_csrf_expiry';

/**
 * Generate a random CSRF token
 */
function generateRandomToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Get or create a CSRF token for the session
 * Tokens are stored in sessionStorage to survive page reloads but not cross-tab
 */
export function getCsrfToken(): string {
  try {
    if (typeof sessionStorage === 'undefined') {
      return generateRandomToken();
    }

    const stored = sessionStorage.getItem(CSRF_TOKEN_STORAGE_KEY);
    const expiry = sessionStorage.getItem(TOKEN_EXPIRY_KEY);
    const now = Date.now();

    // Check if token exists and hasn't expired
    if (stored && expiry && now < parseInt(expiry, 10)) {
      return stored;
    }

    // Generate new token
    const newToken = generateRandomToken();
    const newExpiry = now + TOKEN_EXPIRY_MS;

    sessionStorage.setItem(CSRF_TOKEN_STORAGE_KEY, newToken);
    sessionStorage.setItem(TOKEN_EXPIRY_KEY, newExpiry.toString());

    return newToken;
  } catch {
    // Fallback: generate token in-memory if sessionStorage unavailable
    return generateRandomToken();
  }
}

/**
 * Clear CSRF token from session storage
 */
export function clearCsrfToken(): void {
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(CSRF_TOKEN_STORAGE_KEY);
      sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
    }
  } catch {
    // Silently ignore errors
  }
}

/**
 * Add CSRF token to request headers
 */
export function addCsrfTokenToHeaders(headers: Record<string, string>): Record<string, string> {
  return {
    ...headers,
    'X-CSRF-Token': getCsrfToken(),
  };
}

/**
 * Add CSRF token to form data
 */
export function addCsrfTokenToFormData(data: Record<string, unknown>): Record<string, unknown> {
  return {
    ...data,
    [CSRF_TOKEN_KEY]: getCsrfToken(),
  };
}
