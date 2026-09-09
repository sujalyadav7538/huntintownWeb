import type { SyntheticEvent } from 'react';

export const isPostExpired = (expiresAtStr: string): boolean => {
  if (!expiresAtStr) return false;
  return new Date() > new Date(expiresAtStr);
};

export const getPostExpiryLabel = (expiresAtStr: string): string => {
  const diffMs = new Date(expiresAtStr).getTime() - new Date().getTime();
  if (diffMs <= 0) return 'Expired';
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Expires today';
  return `Expires in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
};

/**
 * Returns a valid avatar URL. If the stored avatar is empty/invalid,
 * falls back to a generated letter-avatar via DiceBear.
 */
export const getAvatarUrl = (name: string, avatar?: string): string => {
  if (avatar && avatar.trim() !== '') return avatar;
  const seed = encodeURIComponent((name || 'U').trim());
  return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=FF3F3F&textColor=ffffff&radius=50&size=128`;
};

/** Inline onError handler — replaces broken img with a generated fallback */
export const handleAvatarError = (
  e: SyntheticEvent<HTMLImageElement>,
  name: string
) => {
  const seed = encodeURIComponent((name || 'U').trim());
  (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=FF3F3F&textColor=ffffff&radius=50&size=128`;
};

// --- Type-safe helpers ----------------------------------------------------
/**
 * Get a stable user identifier from a User object.
 * Returns empty string when the user is not available.
 */
export const getUserId = (u?: { id?: string } | null): string => {
  if (!u) return '';
  return (u.id && String(u.id)) || '';
};

/**
 * Ensure an author object contains an `id` field.
 * Does not mutate the original object.
 */
export const normalizeAuthor = <T extends { id?: string }>(
  author: T,
): T & { id: string } => {
  return { ...(author as any), id: (author.id as string) || '' };
};

/**
 * Helper to check if the given `postAuthor` corresponds to the `currentUser`.
 * Accepts author and currentUser shapes that expose `id`.
 */
export const isAuthorOf = (
  postAuthor?: { id?: string } | null,
  currentUser?: { id?: string } | null,
): boolean => {
  if (!postAuthor || !currentUser) return false;
  const a = postAuthor.id || '';
  const b = currentUser.id || '';
  return a !== '' && b !== '' && a === b;
};


