import { useEffect, useState } from "react";

/** Matches Tailwind's `lg` — the width where the app switches to its desktop layout. */
export const DESKTOP_QUERY = "(min-width: 1024px)";

/** Matches Tailwind's `md` — used by screens that switch a breakpoint earlier. */
export const TABLET_QUERY = "(min-width: 768px)";

/**
 * Subscribes to a media query.
 *
 * Components that render a desktop and a mobile view should pick between them
 * with this hook rather than rendering both and hiding one with CSS: a hidden
 * tree still mounts, so its effects run twice, its refs fight over the same
 * value, and an IntersectionObserver attached to a `display:none` element never
 * fires. One tree in, one tree out.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const list = window.matchMedia(query);
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);

    setMatches(list.matches);
    list.addEventListener("change", onChange);

    return () => list.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

export const useIsDesktop = (): boolean => useMediaQuery(DESKTOP_QUERY);

export const useIsTablet = (): boolean => useMediaQuery(TABLET_QUERY);
