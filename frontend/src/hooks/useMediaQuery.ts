/**
 * useMediaQuery.ts — Responsive breakpoint hook
 *
 * WHY: Sidebar behavior differs on mobile (overlay) vs desktop (fixed).
 *      Navbar may collapse links into a menu on small screens (Phase 3).
 *
 * HOW: Listens to `window.matchMedia` and re-runs on resize.
 *      Returns boolean — true when query matches.
 *
 * React note: Effect runs once on mount, subscribes to media query changes,
 *             cleans up listener on unmount (prevents memory leaks).
 */

import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);

    setMatches(mediaQuery.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/** Convenience: true when viewport >= 1024px (Tailwind `lg` breakpoint) */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}
