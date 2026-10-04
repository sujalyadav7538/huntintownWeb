import { User } from "@/src/shared/types";

export const AUTH_REDIRECT_LOCK_KEY = "neighbourly_auth_redirect_lock";

const AUTH_STORAGE_KEYS = [
  "neighbourly_auth",
  "neighbourly_user",
  "access_token",
  "neighbourly_posts",
  "neighbourly_conversations",
] as const;

/**
 * Reads the auth session back out of its legacy keys. Kept separate from the
 * generic persistence registry because `lib/api.ts` and the 401 handler read
 * `access_token` directly.
 */
export function readPersistedAuth(): {
  isAuthenticated: boolean;
  currentUser: User | null;
  token: string | null;
} {
  try {
    const token = localStorage.getItem("access_token");
    const saved = localStorage.getItem("neighbourly_user");

    return {
      isAuthenticated:
        Boolean(token) && localStorage.getItem("neighbourly_auth") === "true",
      currentUser: saved ? (JSON.parse(saved) as User) : null,
      token,
    };
  } catch {
    return { isAuthenticated: false, currentUser: null, token: null };
  }
}

export function clearAuthStorage(): void {
  for (const key of AUTH_STORAGE_KEYS) {
    localStorage.removeItem(key);
  }
  sessionStorage.setItem(AUTH_REDIRECT_LOCK_KEY, "1");
}

export function persistAuthStorage(params: {
  isAuthenticated: boolean;
  currentUser: User | null;
  token: string | null;
}): void {
  const { isAuthenticated, currentUser, token } = params;
  const redirectLocked =
    sessionStorage.getItem(AUTH_REDIRECT_LOCK_KEY) === "1";

  if (redirectLocked) {
    clearAuthStorage();
    return;
  }

  if (isAuthenticated && token) {
    localStorage.setItem("neighbourly_auth", "true");
    localStorage.setItem("neighbourly_user", JSON.stringify(currentUser));
    localStorage.setItem("access_token", token);
    return;
  }

  clearAuthStorage();
}
