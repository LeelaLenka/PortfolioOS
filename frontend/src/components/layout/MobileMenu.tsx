/**
 * MobileMenu.tsx — Full-screen mobile navigation drawer
 *
 * WHY: 8 nav links don't fit on mobile — PrimeReact Sidebar provides focus trap + overlay.
 *
 * HOW:
 * - Controlled by UIStore.isMobileNavOpen
 * - Glass styling matches Navbar
 * - NavLinkItem closes drawer on navigate
 *
 * PrimeReact Sidebar: accessible, animated slide-in, backdrop dismiss.
 */

import { Sidebar } from 'primereact/sidebar';
import { useNavigate } from 'react-router-dom';
import { NavLinkItem } from './NavLinkItem';
import { PUBLIC_NAV_ITEMS } from '@/routes/nav.config';
import { ROUTES } from '@/routes/paths';
import { useUIStore } from '@/store';
import { Button } from '@/components/ui';

export function MobileMenu() {
  const { isMobileNavOpen, setMobileNavOpen } = useUIStore();
  const navigate = useNavigate();

  const close = () => setMobileNavOpen(false);

  return (
    <Sidebar
      visible={isMobileNavOpen}
      onHide={close}
      position="right"
      className="!w-full !max-w-sm !border-l !border-border !bg-surface/95 !backdrop-blur-xl"
      pt={{
        header: { className: '!border-b !border-border !bg-transparent !p-4' },
        content: { className: '!p-4 !bg-transparent' },
      }}
      header={
        <span className="font-display text-lg font-semibold text-text">Menu</span>
      }
    >
      <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
        {PUBLIC_NAV_ITEMS.map((item) => (
          <NavLinkItem
            key={item.path}
            to={item.path}
            label={item.label}
            onClick={close}
            className="!px-4 !py-3 !text-base"
          />
        ))}
      </nav>

      <div className="mt-8 border-t border-border pt-6">
        <Button
          label="Dashboard"
          icon="pi pi-th-large"
          variant="secondary"
          className="w-full !justify-center"
          onClick={() => {
            close();
            void navigate(ROUTES.ADMIN.DASHBOARD);
          }}
        />
      </div>
    </Sidebar>
  );
}
