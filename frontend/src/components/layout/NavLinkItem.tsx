/**
 * NavLinkItem.tsx — Navigation link with animated underline
 *
 * WHY: Linear/Vercel nav uses a sliding underline on active + hover — premium feel.
 *
 * HOW:
 * - React Router NavLink provides `isActive`
 * - Framer Motion animates underline scaleX from center
 * - CSS fallback for prefers-reduced-motion
 */

import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/utils';

interface NavLinkItemProps {
  to: string;
  label: string;
  onClick?: () => void;
  className?: string;
}

export function NavLinkItem({ to, label, onClick, className }: NavLinkItemProps) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={cn('group relative px-3 py-2 text-sm no-underline', className)}
    >
      {({ isActive }) => (
        <>
          <span
            className={cn(
              'relative z-10 transition-colors duration-200',
              isActive ? 'text-text' : 'text-muted group-hover:text-text',
            )}
          >
            {label}
          </span>

          {/* Animated underline — active or hover */}
          <motion.span
            className="absolute bottom-1 left-3 right-3 h-px origin-left bg-gradient-to-r from-primary to-secondary"
            initial={false}
            animate={{
              scaleX: isActive ? 1 : 0,
              opacity: isActive ? 1 : 0,
            }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            aria-hidden
          />
          <span
            className="absolute bottom-1 left-3 right-3 h-px origin-left scale-x-0 bg-gradient-to-r from-primary to-secondary opacity-0 transition-transform duration-250 group-hover:scale-x-100 group-hover:opacity-60 motion-reduce:transition-none"
            aria-hidden
          />
        </>
      )}
    </NavLink>
  );
}
