/**
 * Thin fetch wrapper that resolves the correct base URL:
 *  - Development : empty string — Vite dev-server proxy forwards /api/* to the backend
 *  - Production  : injected at build time via Vite's `define` → VITE_API_BASE_URL
 */
declare const __API_BASE__: string;

const BASE: string = typeof __API_BASE__ !== 'undefined' ? __API_BASE__ : '';

export function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${BASE}${path}`, init);
}
