/**
 * Request Signing Utilities
 * Implements optional HMAC-SHA256 request signing for admin API endpoints
 * Provides defense-in-depth against request tampering and MITM attacks
 */

/**
 * Convert hex string to Uint8Array
 */
function hexToUint8Array(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Convert Uint8Array to hex string
 */
function uint8ArrayToHex(bytes: Uint8Array): string {
  let hex = '';
  for (const b of bytes) {
    hex += b.toString(16).padStart(2, '0');
  }
  return hex;
}

/**
 * Generate HMAC-SHA256 signature for a request
 * Signature = HMAC-SHA256(adminToken:method:path:timestamp)
 */
export async function generateRequestSignature(
  adminToken: string,
  method: string,
  path: string,
  timestamp?: number
): Promise<{ signature: string; timestamp: number }> {
  const ts = timestamp || Date.now();
  const message = `${adminToken}:${method}:${path}:${ts}`;
  const textEncoder = new TextEncoder();

  // Import key
  const key = await crypto.subtle.importKey(
    'raw',
    textEncoder.encode(adminToken),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  // Generate signature
  const signature = await crypto.subtle.sign('HMAC', key, textEncoder.encode(message));
  return {
    signature: uint8ArrayToHex(new Uint8Array(signature)),
    timestamp: ts,
  };
}

/**
 * Add request signing headers to a fetch request
 * Adds X-Request-Signature and X-Request-Timestamp headers
 * Returns the modified headers object and timestamp for reference
 */
export async function addSigningHeaders(
  headers: Record<string, string>,
  adminToken: string,
  method: string,
  path: string
): Promise<{ headers: Record<string, string>; timestamp: number }> {
  const { signature, timestamp } = await generateRequestSignature(adminToken, method, path);

  return {
    headers: {
      ...headers,
      'X-Request-Signature': signature,
      'X-Request-Timestamp': timestamp.toString(),
    },
    timestamp,
  };
}

/**
 * Sign a complete fetch request for admin endpoints
 * Usage:
 *   const signedRequest = await signAdminRequest(request, adminToken);
 *   const response = await fetch(signedRequest);
 */
export async function signAdminRequest(
  request: Request,
  adminToken: string
): Promise<Request> {
  const url = new URL(request.url);
  const { headers, timestamp } = await addSigningHeaders(
    Object.fromEntries(request.headers.entries()),
    adminToken,
    request.method,
    url.pathname + url.search
  );

  return new Request(request, { headers });
}

/**
 * Store admin token securely (in-memory or sessionStorage if available)
 * Note: Never store in localStorage as it persists across tabs/sessions
 */
const adminTokenCache = new Map<string, string>();

export function setAdminToken(token: string, namespace = 'default'): void {
  adminTokenCache.set(namespace, token);
  // Optional: also store in sessionStorage for cross-tab coordination
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(`admin_token_${namespace}`, token);
    }
  } catch {
    // Silently ignore sessionStorage errors
  }
}

export function getAdminToken(namespace = 'default'): string | undefined {
  // Try in-memory first
  let token = adminTokenCache.get(namespace);
  if (token) return token;

  // Try sessionStorage if available
  try {
    if (typeof sessionStorage !== 'undefined') {
      token = sessionStorage.getItem(`admin_token_${namespace}`) || undefined;
      if (token) {
        adminTokenCache.set(namespace, token);
      }
    }
  } catch {
    // Silently ignore sessionStorage errors
  }

  return token;
}

export function clearAdminToken(namespace = 'default'): void {
  adminTokenCache.delete(namespace);
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(`admin_token_${namespace}`);
    }
  } catch {
    // Silently ignore sessionStorage errors
  }
}

/**
 * Make a signed admin API request
 * Handles both signing and potential error responses
 */
export async function fetchAdminAPI<T>(
  endpoint: string,
  options: {
    adminToken: string;
    method?: string;
    body?: unknown;
    sign?: boolean;
  }
): Promise<{ ok: boolean; data?: T; error?: string; status?: number }> {
  const method = options.method || 'GET';
  let headers: HeadersInit = {
    'Content-Type': 'application/json',
    'X-Admin-Token': options.adminToken,
  };

  let fetchOptions: RequestInit = {
    method,
    headers,
  };

  if (options.body) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  // Add optional request signing
  if (options.sign) {
    const { headers: signedHeaders } = await addSigningHeaders(
      headers as Record<string, string>,
      options.adminToken,
      method,
      endpoint
    );
    fetchOptions.headers = signedHeaders;
  }

  try {
    const response = await fetch(endpoint, fetchOptions);
    const data = (await response.json()) as T;

    if (!response.ok) {
      return {
        ok: false,
        error: (data as any)?.error || `HTTP ${response.status}`,
        status: response.status,
      };
    }

    return { ok: true, data, status: response.status };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
