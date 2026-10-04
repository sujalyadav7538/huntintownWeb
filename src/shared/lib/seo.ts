/**
 * SEO constants and helpers.
 *
 * The site origin comes from VITE_SITE_URL so canonical/OG URLs are absolute in
 * builds. At runtime it falls back to the browser's own origin, which keeps
 * canonicals correct on preview deploys where the variable isn't set.
 */

const ENV_SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined)
  ?.trim()
  ?.replace(/\/$/, "");

export const SITE_NAME = "HuntInTown";

export const SITE_URL: string =
  ENV_SITE_URL ||
  (typeof window !== "undefined" ? window.location.origin : "");

export const DEFAULT_TITLE = `${SITE_NAME} — Find Local Help, Offer Your Skills`;

export const DEFAULT_DESCRIPTION =
  "HuntInTown connects people within local communities to post requirements, discover skilled helpers, collaborate securely, and build lasting reputation through verified interactions.";

export const DEFAULT_OG_IMAGE = "/logo.jpeg";

/** Google truncates titles past roughly 60 characters. */
const MAX_TITLE_LENGTH = 60;

/** …and descriptions past roughly 160. */
const MAX_DESCRIPTION_LENGTH = 160;

const truncate = (value: string, max: number): string => {
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;

  // Cut on a word boundary so the ellipsis doesn't land mid-word.
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");

  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
};

/** "Plumber needed in Sector 62 · HuntInTown", trimmed to a sane length. */
export function buildTitle(pageTitle?: string): string {
  if (!pageTitle?.trim()) return DEFAULT_TITLE;

  const suffix = ` · ${SITE_NAME}`;
  const room = MAX_TITLE_LENGTH - suffix.length;

  return `${truncate(pageTitle, room)}${suffix}`;
}

export function buildDescription(description?: string): string {
  return truncate(description || DEFAULT_DESCRIPTION, MAX_DESCRIPTION_LENGTH);
}

/** Turns a path or relative asset into an absolute URL for canonical/OG tags. */
export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;

  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;

  return `${SITE_URL}${path}`;
}

/**
 * Routes that must never be indexed: they are behind auth, per-user, or
 * transient. Keep this in sync with robots.txt (scripts/generate-seo-files.mjs).
 */
export const NOINDEX_PREFIXES = [
  "/dashboard",
  "/messaging",
  "/activity",
  "/responses",
  "/create-post",
  "/profile",
  "/login",
];

export function isNoIndexPath(pathname: string): boolean {
  return NOINDEX_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
