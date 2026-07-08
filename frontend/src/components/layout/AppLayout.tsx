/**
 * AppLayout.tsx — Responsive application shell with page transitions
 *
 * Phase 3 enhancements:
 * - PageTransition (Framer Motion) replaces raw Outlet
 * - Responsive main padding (mobile → desktop)
 * - Admin variant shows Sidebar; public variant is full-width
 *
 * LAYOUT FLOW:
 * Navbar (sticky)
 * └── body (flex)
 *     ├── Sidebar (admin only)
 *     └── main → PageTransition → active page
 * Footer
 */

import type { LayoutVariant } from '@/types';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { PageTransition } from './PageTransition';
import { cn } from '@/utils';

interface AppLayoutProps {
  variant?: LayoutVariant;
}

export function AppLayout({ variant = 'public' }: AppLayoutProps) {
  const isAdmin = variant === 'admin';

  return (
    <div className="app-layout flex min-h-screen flex-col">
      <Navbar />

      <div className="app-layout__body flex flex-1">
        <Sidebar visible={isAdmin} />

        <main
          className={cn(
            'app-layout__main flex-1 transition-[margin] duration-300',
            'px-4 py-6 sm:px-6 lg:px-8 lg:py-8',
            isAdmin && 'lg:ml-sidebar',
          )}
        >
          <PageTransition />
        </main>
      </div>

      <Footer />
    </div>
  );
}
