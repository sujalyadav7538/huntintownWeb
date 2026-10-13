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

// --- Type-safe helpers ----------------------------------------------------
/**
 * Get a stable user identifier from a User object.
 * Returns empty string when the user is not available.
 */
export const getUserId = (u?: { _id?: string } | null): string => {
  if (!u) return '';
  return (u._id && String(u._id)) || '';
};

/**
 * Ensure an author object contains an `_id` field.
 * Does not mutate the original object.
 */
export const normalizeAuthor = <T extends { _id?: string }>(
  author: T,
): T & { _id: string } => {
  return { ...(author as any), _id: (author._id as string) || '' };
};

/**
 * Helper to check if the given `postAuthor` corresponds to the `currentUser`.
 * Accepts author and currentUser shapes that expose `_id`.
 */
export const isAuthorOf = (
  postAuthor?: { _id?: string } | null,
  currentUser?: { _id?: string } | null,
): boolean => {
  if (!postAuthor || !currentUser) return false;
  const a = postAuthor._id || '';
  const b = currentUser._id || '';
  return a !== '' && b !== '' && a === b;
};


