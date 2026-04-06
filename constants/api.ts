/**
 * Centralised API endpoint constants.
 * All client-side fetch calls should import from here instead of
 * hard-coding path strings across components.
 */
export const API_ENDPOINTS = {
  /** Gemini streaming chat (SSE) */
  CHAT: '/api/chat',
  /** Single-shot text generation */
  GENERATE: '/api/generate',
  /** Early-access signup form */
  EARLY_ACCESS: '/api/early-access',
  /** Worker health-check */
  HEALTH: '/api/health',
} as const;
