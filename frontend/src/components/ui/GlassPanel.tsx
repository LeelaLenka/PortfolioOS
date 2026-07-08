/**
 * GlassPanel.tsx — Glassmorphism surface primitive
 */

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';
import { scaleIn } from '@/utils/motion';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  static?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8 lg:p-10',
};

export function GlassPanel({
  children,
  className,
  static: isStatic = false,
  padding = 'md',
}: GlassPanelProps) {
  const classes = cn(
    'rounded-2xl border border-[var(--color-glass-border)] bg-glass shadow-glass backdrop-blur-glass',
    paddingMap[padding],
    className,
  );

  if (isStatic) {
    return <div className={classes}>{children}</div>;
  }

  return (
    <motion.div
      className={classes}
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
    >
      {children}
    </motion.div>
  );
}
