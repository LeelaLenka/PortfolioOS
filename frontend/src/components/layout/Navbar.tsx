/**
 * Navbar.tsx — Premium sticky glass navigation
 *
 * Phase 3 features:
 * - Glassmorphism (backdrop-blur + semi-transparent surface)
 * - Shrinks subtly on scroll (useScrollPosition)
 * - Animated underline links (NavLinkItem)
 * - Mobile menu via PrimeReact Sidebar (MobileMenu)
 *
 * NO HARDCODED USER CONTENT — brand name is product identity only.
 */

import { Link, useNavigate } from 'react-router-dom';
import { Button as PrimeButton } from 'primereact/button';
import { NavLinkItem } from './NavLinkItem';
import { MobileMenu } from './MobileMenu';
import { PUBLIC_NAV_ITEMS } from '@/routes/nav.config';
import { ROUTES } from '@/routes/paths';
import { useScrollPosition } from '@/hooks';
import { useUIStore } from '@/store';
import { cn } from '@/utils';

export function Navbar() {
  const { isScrolled } = useScrollPosition(24);
  const { toggleMobileNav } = useUIStore();
  const navigate = useNavigate();

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 border-b transition-all duration-300',
          isScrolled
            ? 'border-border/80 bg-surface/90 shadow-soft backdrop-blur-xl'
            : 'border-transparent bg-surface/60 backdrop-blur-md',
        )}
        style={{
          height: isScrolled ? 'var(--navbar-height-scrolled)' : 'var(--navbar-height)',
        }}
      >
        <div className="mx-auto flex h-full max-w-content items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand — product name, not user PII */}
          <Link to={ROUTES.HOME} className="group flex items-center gap-2.5 no-underline">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-sm font-bold text-white shadow-glow transition-transform group-hover:scale-105">
              P
            </span>
            <span className="font-display text-lg font-semibold tracking-tight text-text">
              PortfolioOS
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center lg:flex" aria-label="Main navigation">
            {PUBLIC_NAV_ITEMS.map((item) => (
              <NavLinkItem key={item.path} to={item.path} label={item.label} />
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <PrimeButton
              label="Dashboard"
              icon="pi pi-th-large"
              size="small"
              outlined
              className="!hidden !rounded-xl !border-border !text-muted hover:!text-text sm:!inline-flex"
              onClick={() => void navigate(ROUTES.ADMIN.DASHBOARD)}
            />
            <PrimeButton
              icon="pi pi-bars"
              rounded
              text
              className="!text-text lg:!hidden"
              aria-label="Open navigation menu"
              onClick={toggleMobileNav}
            />
          </div>
        </div>
      </header>

      <MobileMenu />
    </>
  );
}
