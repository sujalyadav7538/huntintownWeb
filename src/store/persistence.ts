/**
 * Redux persistence.
 *
 * One registry describes what survives a reload and under which storage key.
 * `loadPersistedState()` feeds `configureStore({ preloadedState })` and
 * `persistenceMiddleware` writes changed slices back after each action.
 *
 * Rules of thumb for adding a slice here:
 *  - persist data the user would be annoyed to lose (session, chats, prefs);
 *  - never persist transient UI flags (open modals, hidden navbars, spinners) —
 *    a reload must never restore a half-open screen;
 *  - keep `pick` narrow: what is not picked is rebuilt from `initialState`.
 */

import type { Middleware } from "@reduxjs/toolkit";
import type { RootState } from "@/src/store/rootReducer";
import {
  persistAuthStorage,
  readPersistedAuth,
} from "@/src/shared/lib/authStorage";

/** Bump when a persisted shape changes incompatibly — old payloads are dropped. */
const SCHEMA_VERSION = 1;

const STORAGE_PREFIX = "huntintown";

/** Cap on persisted feed size — enough for a first paint, small enough to stay quick. */
const MAX_PERSISTED_POSTS = 40;

interface PersistedEnvelope<T> {
  version: number;
  value: T;
}

const readKey = <T,>(key: string): T | undefined => {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}:${key}`);
    if (!raw) return undefined;

    const parsed = JSON.parse(raw) as PersistedEnvelope<T>;
    if (parsed?.version !== SCHEMA_VERSION) return undefined;

    return parsed.value;
  } catch {
    // Corrupt or unreadable (private mode, quota, hand-edited) — start fresh.
    return undefined;
  }
};

const writeKey = (key: string, value: unknown): void => {
  try {
    const envelope: PersistedEnvelope<unknown> = {
      version: SCHEMA_VERSION,
      value,
    };
    localStorage.setItem(`${STORAGE_PREFIX}:${key}`, JSON.stringify(envelope));
  } catch {
    // Storage full or blocked — persistence is best-effort, never fatal.
  }
};

/**
 * A slice is persisted by describing how to narrow it (`pick`) and how to put it
 * back (`hydrate`). `read`/`write` exist for auth, which lives under legacy keys
 * that `lib/api.ts` reads directly.
 */
interface PersistedSlice<K extends keyof RootState> {
  slice: K;
  pick: (state: RootState[K]) => unknown;
  hydrate: (stored: any) => Partial<RootState[K]> | undefined;
  read?: () => unknown;
  write?: (picked: any) => void;
}

const persistedSlices: PersistedSlice<any>[] = [
  {
    slice: "auth",
    pick: (auth: RootState["auth"]) => ({
      isAuthenticated: auth.isAuthenticated,
      currentUser: auth.currentUser,
      token: auth.token,
    }),
    // Auth keeps its own storage keys: apiFetch reads `access_token` directly
    // and the 401 handler clears them behind a redirect lock.
    read: () => readPersistedAuth(),
    write: (picked) => persistAuthStorage(picked),
    hydrate: (stored) =>
      stored
        ? {
            isAuthenticated: Boolean(stored.isAuthenticated && stored.token),
            currentUser: stored.currentUser ?? null,
            token: stored.token ?? null,
          }
        : undefined,
  },
  {
    slice: "ui",
    // Preferences only. hideMobileBottomNav / hideUpperNavigation / isCreatePostOpen
    // are deliberately excluded: restoring them would hide navigation on load.
    pick: (ui: RootState["ui"]) => ({ theme: ui.theme }),
    hydrate: (stored) =>
      stored?.theme === "dark" || stored?.theme === "light"
        ? { theme: stored.theme }
        : undefined,
  },
  {
    slice: "conversations",
    pick: (conversations: RootState["conversations"]) => ({
      conversations: conversations.conversations,
      chatPosts: conversations.chatPosts,
      conversationMessages: conversations.conversationMessages,
    }),
    hydrate: (stored) =>
      stored
        ? {
            conversations: stored.conversations ?? [],
            chatPosts: stored.chatPosts ?? [],
            conversationMessages: stored.conversationMessages ?? {},
            // Never restore an open thread — the route decides what is active.
            activeConversationId: null,
          }
        : undefined,
  },
  {
    slice: "posts",
    pick: (posts: RootState["posts"]) => posts.slice(0, MAX_PERSISTED_POSTS),
    hydrate: (stored) => (Array.isArray(stored) ? stored : undefined),
  },
  {
    slice: "reputation",
    pick: (reputation: RootState["reputation"]) => ({
      metric: reputation.metric,
      badges: reputation.badges,
    }),
    hydrate: (stored) =>
      stored
        ? {
            metric: stored.metric ?? null,
            badges: stored.badges ?? [],
            // Status is runtime state: a rehydrated cache is still refetched.
            status: "idle" as const,
            error: null,
          }
        : undefined,
  },
];

/**
 * Preloaded state for `configureStore`. Slices are hydrated independently, so a
 * single corrupt entry never blocks the rest.
 */
export function loadPersistedState(): Partial<RootState> {
  if (typeof window === "undefined") return {};

  const preloaded: Record<string, unknown> = {};

  for (const entry of persistedSlices) {
    const stored = entry.read ? entry.read() : readKey(entry.slice as string);
    const hydrated = entry.hydrate(stored);

    if (hydrated) preloaded[entry.slice as string] = hydrated;
  }

  return preloaded as Partial<RootState>;
}

/** Last value written per slice, so unchanged slices are never re-serialized. */
const lastSeen = new Map<string, unknown>();

/**
 * Writes changed slices back to storage. Comparison is by reference: RTK's
 * immer-produced state only changes identity when the slice actually changed,
 * so an unrelated action costs one pointer compare per registered slice.
 */
export const persistenceMiddleware: Middleware =
  (store) => (next) => (action) => {
    const result = next(action);

    const state = store.getState() as RootState;

    for (const entry of persistedSlices) {
      const current = state[entry.slice as keyof RootState];

      if (lastSeen.get(entry.slice as string) === current) continue;
      lastSeen.set(entry.slice as string, current);

      const picked = entry.pick(current as never);

      if (entry.write) entry.write(picked);
      else writeKey(entry.slice as string, picked);
    }

    return result;
  };

/** Drops every persisted slice — used on logout so nothing leaks to the next user. */
export function clearPersistedState(): void {
  for (const entry of persistedSlices) {
    lastSeen.delete(entry.slice as string);

    if (entry.write) continue; // auth clears itself through authStorage

    try {
      localStorage.removeItem(`${STORAGE_PREFIX}:${entry.slice as string}`);
    } catch {
      // ignore
    }
  }
}
