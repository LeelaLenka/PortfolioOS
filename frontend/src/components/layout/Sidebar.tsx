/**
 * Sidebar.tsx — Collapsible sidebar for admin dashboard layout
 *
 * WHY: Admin CMS has many sections (Projects, Skills, Resumes…).
 *      A sidebar scales better than a top navbar for 10+ admin links.
 *
 * HOW:
 * - Public layout (`variant="public"`) → Sidebar is NOT rendered
 * - Admin layout (`variant="admin"`) → Fixed sidebar with ADMIN_NAV_ITEMS
 * - Mobile: PrimeReact Sidebar overlay (Phase 3 polish)
 * - Desktop: Fixed left panel, toggles collapsed state via UIStore
 *
 * React Router: NavLink highlights active admin route.
 */

import { NavLink } from 'react-router-dom';
import { Button } from 'primereact/button';
import { ADMIN_NAV_ITEMS } from '@/routes/nav.config';
import { useUIStore } from '@/store';
import { cn } from '@/utils';

interface SidebarProps {
  /** When false, component renders nothing (public portfolio pages) */
  visible: boolean;
}

export function Sidebar({ visible }: SidebarProps) {
  const { isSidebarOpen, toggleSidebar } = useUIStore();

  if (!visible) return null;

  return (
    <aside
      className={cn(
        'fixed left-0 top-[var(--navbar-height)] z-40 hidden h-[calc(100vh-var(--navbar-height))] flex-col border-r border-border bg-card transition-all duration-300 lg:flex',
        isSidebarOpen ? 'w-sidebar' : 'w-[var(--sidebar-collapsed-width)]',
      )}
      aria-label="Admin navigation"
    >
      {/* Collapse toggle */}
      <div className="flex items-center justify-end border-b border-border p-2">
        <Button
          icon={isSidebarOpen ? 'pi pi-angle-left' : 'pi pi-angle-right'}
          rounded
          text
          size="small"
          aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          onClick={toggleSidebar}
        />
      </div>

      {/* Admin nav links */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
        {ADMIN_NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm no-underline transition-colors',
                isActive
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted hover:bg-white/5 hover:text-text',
              )
            }
          >
            {item.icon ? <i className={cn(item.icon, 'text-base')} aria-hidden /> : null}
            {isSidebarOpen ? <span>{item.label}</span> : null}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
