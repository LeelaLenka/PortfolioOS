/**
 * Container.tsx — Max-width content wrapper
 *
 * WHY: Keeps page content centered and readable on ultra-wide monitors.
 *      Every page section uses the same horizontal constraint.
 *
 * HOW: `<Container>…</Container>` applies max-width + horizontal padding.
 */

import type { ReactNode } from 'react';
import { cn } from '@/utils';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  /** If true, uses narrower max-width for text-heavy content */
  narrow?: boolean;
}

export function Container({ children, className, narrow = false }: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        narrow ? 'max-w-3xl' : 'max-w-content',
        className,
      )}
    >
      {children}
    </div>
  );
}
