/**
 * UIStore.tsx — Client-side UI state (sidebar, mobile menu)
 *
 * WHY: Sidebar open/close is UI state — not server data. It doesn't belong in React Query.
 *      Context keeps it colocated without adding Redux/Zustand yet.
 *
 * HOW: UIProvider wraps the app; layout components call useUIStore().
 *
 * STATE MANAGEMENT RULE (Microsoft pattern):
 * - Server state  → React Query (API data)
 * - Client UI state → Context or Zustand (sidebar, theme toggle)
 * - Form state    → React Hook Form (admin CRUD)
 *
 * ALTERNATIVE: Zustand — lighter for complex UI state; we'll migrate if needed.
 */

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface UIState {
  isSidebarOpen: boolean;
  isMobileNavOpen: boolean;
}

interface UIActions {
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleMobileNav: () => void;
  setMobileNavOpen: (open: boolean) => void;
}

type UIStoreValue = UIState & UIActions;

const UIStoreContext = createContext<UIStoreValue | null>(null);

interface UIProviderProps {
  children: ReactNode;
}

export function UIProvider({ children }: UIProviderProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const toggleSidebar = useCallback(() => setIsSidebarOpen((prev) => !prev), []);
  const setSidebarOpen = useCallback((open: boolean) => setIsSidebarOpen(open), []);
  const toggleMobileNav = useCallback(() => setIsMobileNavOpen((prev) => !prev), []);
  const setMobileNavOpen = useCallback((open: boolean) => setIsMobileNavOpen(open), []);

  const value = useMemo<UIStoreValue>(
    () => ({
      isSidebarOpen,
      isMobileNavOpen,
      toggleSidebar,
      setSidebarOpen,
      toggleMobileNav,
      setMobileNavOpen,
    }),
    [
      isSidebarOpen,
      isMobileNavOpen,
      toggleSidebar,
      setSidebarOpen,
      toggleMobileNav,
      setMobileNavOpen,
    ],
  );

  return <UIStoreContext.Provider value={value}>{children}</UIStoreContext.Provider>;
}

export function useUIStore(): UIStoreValue {
  const context = useContext(UIStoreContext);
  if (!context) {
    throw new Error('useUIStore must be used within a UIProvider');
  }
  return context;
}
