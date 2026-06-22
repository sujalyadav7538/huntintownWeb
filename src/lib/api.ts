/**
 * Single source-of-truth for all API calls.
 *
 * Development  → set VITE_API_URL=http://localhost:5000 in .env.local
 *                (Vite proxy also forwards /api/* so an empty string works too)
 * Production   → set VITE_API_URL=https://your-backend.onrender.com in your
 *                CI / hosting environment variables.
 *
 * Usage:
 *   apiFetch('/api/posts')
 *   apiFetch('/api/profile/update', { method: 'PUT', body: formData })
 */

const BASE: string =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? '';

export function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const url = path.startsWith('http') ? path : `${BASE}${path}`;
  return fetch(url, init);
}

/** Convenience: returns parsed JSON or throws a structured error. */
export async function apiFetchJSON<T = unknown>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await apiFetch(path, init);
  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const body = await res.json();
      if (body?.message) message = body.message;
    } catch {
      // ignore parse errors
    }
    const err = new Error(message) as Error & { status: number };
    err.status = res.status;
    throw err;
  }
  return res.json() as Promise<T>;
}
