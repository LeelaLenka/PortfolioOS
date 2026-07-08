/**
 * useScrollPosition.ts — Tracks vertical scroll for navbar effects
 *
 * WHY: Premium navbars shrink or increase blur after scrolling (Linear, Vercel pattern).
 *
 * HOW: Passive scroll listener — `{ passive: true }` avoids blocking scroll performance.
 */

import { useEffect, useState } from 'react';

interface ScrollState {
  scrollY: number;
  isScrolled: boolean;
}

export function useScrollPosition(threshold = 16): ScrollState {
  const [state, setState] = useState<ScrollState>({
    scrollY: 0,
    isScrolled: false,
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setState({
        scrollY,
        isScrolled: scrollY > threshold,
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return state;
}
