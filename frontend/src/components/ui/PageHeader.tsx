/**
 * PageHeader.tsx — Consistent page title block for non-home routes
 *
 * WHY: About, Skills, Projects pages share the same header pattern.
 *      Title comes from route/page; description is optional CMS field.
 *
 * Renders title only — no placeholder body copy.
 */

import { motion } from 'framer-motion';
import { cn } from '@/utils';
import { fadeInUp } from '@/utils/motion';

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <motion.header
      className={cn('mb-10 lg:mb-14', className)}
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
    >
      <h1 className="font-display text-3xl font-bold tracking-tight text-text lg:text-4xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-3 max-w-2xl text-lg text-muted">{description}</p>
      ) : null}
    </motion.header>
  );
}
