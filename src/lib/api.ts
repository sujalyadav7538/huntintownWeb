import { AUTH_REDIRECT_LOCK_KEY, clearAuthStorage } from "./authStorage";

const BASE: string =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ??
  "";

// Injected by store/index.ts after the store is created — avoids circular deps
let _getToken: (() => string | null) | null = null;
export function setApiTokenGetter(fn: () => string | null): void {
  _getToken = fn;
}

export async function apiFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  // Auto-inject Authorization from Redux unless the caller already provided it
  const callerHeaders = new Headers(init?.headers as HeadersInit | undefined);
  if (_getToken && !callerHeaders.has("Authorization")) {
    const token = _getToken();
    if (token) callerHeaders.set("Authorization", token);
  }

  const response = await fetch(BASE + path, { ...init, headers: callerHeaders });

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
