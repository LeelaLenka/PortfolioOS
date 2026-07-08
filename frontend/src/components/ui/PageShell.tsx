/**
 * PageShell.tsx — Standard layout wrapper for content pages
 *
 * WHY: Every portfolio page (About, Skills, Projects…) shares:
 *      Container → PageHeader → content slot for CMS-driven children.
 *
 * HOW: Pass `title` from page. `children` stays empty until API integration.
 *      No dummy "coming soon" text — empty slot is intentional.
 */

import type { ReactNode } from 'react';
import { Container } from './Container';
import { PageHeader } from './PageHeader';
import { Section } from './Section';

interface PageShellProps {
  title: string;
  description?: string;
  children?: ReactNode;
  /** Optional section id for anchor links */
  id?: string;
}

export function PageShell({ title, description, children, id }: PageShellProps) {
  return (
    <Section id={id} title={title}>
      <Container>
        <PageHeader title={title} description={description} />
        {children ? (
          <div className="min-h-[40vh]">{children}</div>
        ) : (
          /* CMS content slot — intentionally empty */
          <div className="min-h-[40vh]" data-content-slot={title.toLowerCase()} />
        )}
      </Container>
    </Section>
  );
}
