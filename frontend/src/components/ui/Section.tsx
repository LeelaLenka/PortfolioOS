/**
 * Section.tsx — Semantic page section with consistent vertical spacing
 *
 * WHY: Portfolio pages are composed of sections (Hero, Skills, Projects).
 *      This primitive enforces consistent spacing before we build feature UIs.
 */

import type { ReactNode } from 'react';
import { cn } from '@/utils';

interface SectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  /** HTML heading level for accessibility — rendered as visually hidden if title provided */
  title?: string;
}

export function Section({ children, id, className, title }: SectionProps) {
  return (
    <section id={id} className={cn('py-12 lg:py-16', className)} aria-label={title}>
      {title ? <h2 className="sr-only">{title}</h2> : null}
      {children}
    </section>
  );
}
