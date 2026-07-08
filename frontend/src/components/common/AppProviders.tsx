/**
 * AppProviders.tsx — Composes all top-level React providers
 *
 * WHY: Separates provider wiring from App.tsx — keeps the root component clean.
 *
 * PROVIDER ORDER (outer → inner):
 * 1. QueryClientProvider — React Query cache (server state)
 * 2. ThemeProvider — PrimeReact + UI store (client state)
 * 3. AppRouter — React Router
 *
 * HOW React Query works:
 * - Wraps app with a cache (QueryClient)
 * - Feature hooks like `useProjects()` call `useQuery()` to fetch + cache API data
 * - Automatic refetch, loading, error states — no manual useEffect fetch patterns
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';
import { ThemeProvider } from '@/components/common';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">
        <ThemeProvider>{children}</ThemeProvider>
      </MotionConfig>
    </QueryClientProvider>
  );
}
