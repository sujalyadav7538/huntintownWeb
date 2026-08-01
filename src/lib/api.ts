import { AUTH_REDIRECT_LOCK_KEY, clearAuthStorage } from "./authStorage";

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
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ??
  "";

export async function apiFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const url = path.startsWith("http") ? path : `${BASE}${path}`;

  const response = await fetch(url, init);

  if (response.status === 401) {
    try {
      const body = await response.clone().json();

      const message = String(body?.message ?? "").toLowerCase();
      const hasToken = Boolean(localStorage.getItem("access_token"));
      const isTokenError =
        message.includes("invalid token") ||
        message.includes("jwt") ||
        message.includes("unauthorized");

      if (hasToken && isTokenError) {
        const alreadyRedirecting =
          sessionStorage.getItem(AUTH_REDIRECT_LOCK_KEY) === "1";

        if (!alreadyRedirecting) {
          sessionStorage.setItem(AUTH_REDIRECT_LOCK_KEY, "1");
          clearAuthStorage();
          window.location.replace("/login");
        }
      }
    } catch {
      // Ignore if response is not JSON
    }
  }

  return response;
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
