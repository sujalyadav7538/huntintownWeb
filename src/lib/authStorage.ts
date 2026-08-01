import { User } from "../types";

export const AUTH_REDIRECT_LOCK_KEY = "neighbourly_auth_redirect_lock";

const AUTH_STORAGE_KEYS = [
  "neighbourly_auth",
  "neighbourly_user",
  "access_token",
  "neighbourly_posts",
  "neighbourly_conversations",
] as const;

export function clearAuthStorage(): void {
  for (const key of AUTH_STORAGE_KEYS) {
    localStorage.removeItem(key);
  }
}

export function persistAuthStorage(params: {
  isAuthenticated: boolean;
  currentUser: User | null;
  token: string | null;
}): void {
  const { isAuthenticated, currentUser, token } = params;

  if (isAuthenticated && token) {
    localStorage.setItem("neighbourly_auth", "true");
    localStorage.setItem("neighbourly_user", JSON.stringify(currentUser));
    localStorage.setItem("access_token", token);
    return;
  }

  clearAuthStorage();
}
