/**
 * ThemeProvider.tsx — Dark-first theme + PrimeReact global context
 *
 * Phase 3 enhancements:
 * - Sets `data-theme="dark"` on <html> (default, no flash)
 * - Loads full primeReactConfig from config/primereact.config.ts
 * - Wraps UIProvider for layout state (mobile nav, sidebar)
 *
 * HOW dark mode works:
 * 1. useLayoutEffect runs before paint → no light flash
 * 2. CSS `[data-theme='dark']` selectors apply token palette
 * 3. color-scheme: dark → native scrollbars/form controls match
 */

import { PrimeReactProvider } from 'primereact/api';
import { useLayoutEffect, type ReactNode } from 'react';
import { primeReactConfig } from '@/config/primereact.config';
import { DEFAULT_THEME } from '@/types';
import { UIProvider } from '@/store';

interface ThemeProviderProps {
  children: ReactNode;
}

function applyDarkTheme(): void {
  const root = document.documentElement;
  root.setAttribute('data-theme', DEFAULT_THEME);
  root.classList.add('dark');
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  useLayoutEffect(() => {
    applyDarkTheme();
  }, []);

  return (
    <PrimeReactProvider value={primeReactConfig}>
      <UIProvider>{children}</UIProvider>
    </PrimeReactProvider>
  );
}
